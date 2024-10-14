import type { GoogleVisionOCRRepository } from '../repository/googleVisionOCRRepository'

export class PDFThemeGenerationUsecase {
  private googleVisionOCRRepository: GoogleVisionOCRRepository

  constructor(googleVisionOCRRepository: GoogleVisionOCRRepository) {
    this.googleVisionOCRRepository = googleVisionOCRRepository
  }

  async execute(pdfFile: Blob): Promise<string> {
    const extractedText =
      await this.googleVisionOCRRepository.extractTextFromPDF(pdfFile)
    return extractedText
  }
}
