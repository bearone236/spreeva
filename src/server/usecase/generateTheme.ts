import type { Theme } from '../domain/theme'
import { ThemeRepository } from '../repository/themeRepository'

export class GenerateThemeUseCase {
  private themeRepository: ThemeRepository

  constructor() {
    this.themeRepository = new ThemeRepository()
  }

  async execute(themeData: Theme): Promise<string> {
    try {
      return await this.themeRepository.generateTheme(themeData)
    } catch (error) {
      throw new Error('Failed to generate theme')
    }
  }
}
