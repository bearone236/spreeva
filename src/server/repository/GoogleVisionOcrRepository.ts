import { Storage } from '@google-cloud/storage'
import { v1 as vision } from '@google-cloud/vision'
import { v4 as uuidv4 } from 'uuid'

export class GoogleVisionOcrRepository {
  private client: vision.ImageAnnotatorClient
  private storage: Storage = new Storage()

  constructor() {
    this.client =
      process.env.NODE_ENV === 'production'
        ? new vision.ImageAnnotatorClient({
            credentials: JSON.parse(process.env.GCLOUD_CREDENTIALS || '{}'),
          })
        : new vision.ImageAnnotatorClient({
            keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
          })
  }

  async uploadToGCS(pdfFile: Blob, fileName: string): Promise<string> {
    const bucketName = 'spreeva-ocr-output'
    const bucket = this.storage.bucket(bucketName)
    const file = bucket.file(fileName)

    await file.save(Buffer.from(await pdfFile.arrayBuffer()), {
      contentType: 'application/pdf',
    })

    return `gs://${bucketName}/${fileName}`
  }

  async extractTextFromPDF(pdfFile: Blob): Promise<string> {
    const fileName = `uploads/${Date.now()}.pdf`
    const gcsUri = await this.uploadToGCS(pdfFile, fileName)
    const outputPrefix = `output/${uuidv4()}-`

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
              uri: `gs://spreeva-ocr-output/${outputPrefix}`,
            },
          },
        },
      ],
    }

    const [operation] = await this.client.asyncBatchAnnotateFiles(request)
    await operation.promise()

    for (let attempt = 0; attempt < 10; attempt++) {
      const [files] = await this.storage.bucket('spreeva-ocr-output').getFiles({
        prefix: outputPrefix,
      })

      if (files.length > 0) {
        const ocrData = JSON.parse(
          (await files[0].download())[0].toString('utf8'),
        )
        const fullText = ocrData.responses[0].fullTextAnnotation?.text

        if (!fullText) {
          throw new Error('OCRテキストが見つかりません。')
        }

        return fullText
      }

      await new Promise(resolve => setTimeout(resolve, 3000))
    }

    throw new Error(
      'OCR結果が見つかりません。処理が完了していることを確認してください。',
    )
  }
}
