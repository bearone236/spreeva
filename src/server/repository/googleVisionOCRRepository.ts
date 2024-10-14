import { Storage } from '@google-cloud/storage'
import { v1 as vision } from '@google-cloud/vision'
import { v4 as uuidv4 } from 'uuid'

export class GoogleVisionOCRRepository {
  private client: vision.ImageAnnotatorClient
  private storage: Storage = new Storage()

  constructor() {
    if (process.env.NODE_ENV === 'production') {
      this.client = new vision.ImageAnnotatorClient({
        credentials: JSON.parse(process.env.GCLOUD_CREDENTIALS || '{}'),
      })
    } else {
      this.client = new vision.ImageAnnotatorClient({
        keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      })
    }
  }

  async uploadToGCS(pdfFile: Blob, fileName: string): Promise<string> {
    const bucketName = 'spreeva-ocr-output'
    const bucket = this.storage.bucket(bucketName)
    const file = bucket.file(fileName)

    await file.save(Buffer.from(await pdfFile.arrayBuffer()), {
      contentType: 'application/pdf',
    })

    console.log(`Uploaded PDF to GCS: gs://${bucketName}/${fileName}`)
    return `gs://${bucketName}/${fileName}`
  }

  async extractTextFromPDF(pdfFile: Blob): Promise<string> {
    const fileName = `uploads/${Date.now()}.pdf`
    const gcsUri = await this.uploadToGCS(pdfFile, fileName)
    const outputPrefix = `gs://spreeva-ocr-output/output/${uuidv4()}-`

    console.log(`Starting OCR process for: ${gcsUri}`)

    const request = {
      requests: [
        {
          inputConfig: {
            gcsSource: { uri: gcsUri },
            mimeType: 'application/pdf',
          },
          features: [{ type: 'DOCUMENT_TEXT_DETECTION' as const }],
          outputConfig: {
            gcsDestination: {
              uri: outputPrefix, // プレフィックスを使用
            },
          },
        },
      ],
    }

    const [operation] = await this.client.asyncBatchAnnotateFiles(request)
    await operation.promise() // 処理が完了するまで待機

    console.log('OCR processing completed. Waiting for output files...')

    // ファイルを取得するための再試行ロジックを追加
    for (let attempt = 0; attempt < 5; attempt++) {
      const [files] = await this.storage.bucket('spreeva-ocr-output').getFiles({
        prefix: outputPrefix,
      })

      console.log(
        `Attempt ${attempt + 1}: Found ${files.length} files with prefix ${outputPrefix}`,
      )

      if (files.length > 0) {
        // 最初のファイルを取得して解析
        const ocrData = JSON.parse(
          (await files[0].download())[0].toString('utf8'),
        )
        const fullText = ocrData.responses[0].fullTextAnnotation?.text

        if (!fullText) {
          throw new Error('OCRテキストが見つかりません。')
        }

        console.log(`OCR Text Extracted: ${fullText}`)
        return fullText
      }

      // 2秒待機してから再試行
      await new Promise(resolve => setTimeout(resolve, 2000))
    }

    throw new Error(
      'OCR結果が見つかりません。処理が完了していることを確認してください。',
    )
  }
}
