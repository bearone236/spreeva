import type { Theme } from '../domain/theme'
import { ThemeRepository } from '../repository/themeRepository'

export class GenerateThemeUseCase {
  private themeRepository: ThemeRepository

  constructor() {
    this.themeRepository = new ThemeRepository()
  }

  async execute(themeData: Theme, themeType: string): Promise<string> {
    if (themeType === 'quickstart') {
      return await this.themeRepository.generateTheme(themeData)
    }
    if (themeType === 'ocr') {
      // OCRで抽出されたテキストを直接テーマ生成に使用
      const ocrThemeData: Theme = {
        id: themeData.id,
        theme: themeData.theme, // OCR抽出テキストが渡される
        themeLevel: themeData.themeLevel,
      }
      return await this.themeRepository.generateTheme(ocrThemeData)
    }

    throw new Error('Invalid theme type')
  }
}
