import type { GoogleVisionOCRRepository } from '../repository/googleVisionOCRRepository'

export class PDFThemeGenerationUsecase {
  constructor(private ocrRepository: GoogleVisionOCRRepository) {}

  async execute(pdfBlob: Blob): Promise<string> {
    try {
      // BlobからBufferに変換
      const arrayBuffer = await pdfBlob.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      // PDFからテキストを抽出
      const blob = new Blob([buffer], { type: 'application/pdf' })
      const extractedText = await this.ocrRepository.extractTextFromPDF(blob)

      if (!extractedText) {
        throw new Error('テキストを抽出できませんでした')
      }

      return extractedText
    } catch (error) {
      console.error('PDF processing error:', error)
      throw new Error('PDFの処理に失敗しました')
    }
  }
}
