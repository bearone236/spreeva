import type { GoogleVisionOcrRepository } from '../repository/GoogleVisionOcrRepository'

export class PDFThemeGenerationUsecase {
  constructor(private ocrRepository: GoogleVisionOcrRepository) {}

  async execute(pdfBlob: Blob): Promise<string> {
    try {
      const arrayBuffer = await pdfBlob.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      const blob = new Blob([buffer], { type: 'application/pdf' })
      const extractedText = await this.ocrRepository.extractTextFromPDF(blob)

      if (!extractedText) {
        throw new Error('テキストを抽出できませんでした')
      }

      return extractedText
    } catch (error) {
      throw new Error('PDFの処理に失敗しました')
    }
  }
}
