import { Storage } from '@google-cloud/storage'
import { v1 as vision } from '@google-cloud/vision'
import { v4 as uuidv4 } from 'uuid'

export class GoogleVisionOCRRepository {
  private client: vision.ImageAnnotatorClient
  private storage: Storage

  constructor() {
    try {
      if (process.env.NODE_ENV === 'production') {
        const credentials = JSON.parse(process.env.GCLOUD_CREDENTIALS || '{}')
        if (!credentials.client_email) {
          console.error('Invalid credentials: Missing client_email')
          throw new Error('Invalid GCLOUD_CREDENTIALS: client_email is missing')
        }
        console.log(
          'Credentials loaded in production environment:',
          credentials,
        )

        this.client = new vision.ImageAnnotatorClient({
          credentials,
        })
      } else {
        console.log(
          'Using key file for development environment:',
          process.env.GOOGLE_APPLICATION_CREDENTIALS,
        )
        this.client = new vision.ImageAnnotatorClient({
          keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
        })
      }

      this.storage = new Storage()
    } catch (error) {
      console.error('Error initializing GoogleVisionOCRRepository:', error)
      throw error
    }
  }

  async uploadToGCS(pdfFile: Blob, fileName: string): Promise<string> {
    try {
      const bucketName = 'spreeva-ocr-output'
      const bucket = this.storage.bucket(bucketName)
      const file = bucket.file(fileName)

      await file.save(Buffer.from(await pdfFile.arrayBuffer()), {
        contentType: 'application/pdf',
      })

      console.log(`File uploaded to GCS: gs://${bucketName}/${fileName}`)
      return `gs://${bucketName}/${fileName}`
    } catch (error) {
      console.error('Error uploading file to GCS:', error)
      throw new Error('PDFのアップロードに失敗しました。')
    }
  }

  async extractTextFromPDF(pdfFile: Blob): Promise<string> {
    try {
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

      console.log('OCR request:', JSON.stringify(request, null, 2))

      const [operation] = await this.client.asyncBatchAnnotateFiles(request)
      await operation.promise()

      for (let attempt = 0; attempt < 10; attempt++) {
        const [files] = await this.storage
          .bucket('spreeva-ocr-output')
          .getFiles({
            prefix: outputPrefix,
          })

        console.log(
          `Attempt ${attempt + 1}: Found files:`,
          files.map(f => f.name),
        )

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
    } catch (error) {
      console.error('Error during OCR process:', error)
      throw error
    }
  }
}
