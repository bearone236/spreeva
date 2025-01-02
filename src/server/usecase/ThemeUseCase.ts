import type { ThemeInput, ThemeLevel, ThemeType } from '../../types/theme.types'
import { Theme } from '../domain/entities/Theme'
import type {
  IThemeInterface,
  ThemeGenerationParams,
} from '../domain/interfaces/IThemeInterface'

export class ThemeUseCase {
  constructor(private themeRepository: IThemeInterface) {}

  async execute(params: {
    theme: ThemeInput
    themeLevel: ThemeLevel
    themeType: ThemeType
  }): Promise<Theme> {
    this.validateInput(params)

    const generationParams: ThemeGenerationParams = {
      theme: params.theme as ThemeInput,
      level: params.themeLevel,
      themeType: params.themeType,
      content: '',
      type: '',
    }

    const generatedContent =
      await this.themeRepository.generateTheme(generationParams)

    if (!generatedContent) {
      throw new Error('Failed to generate theme content')
    }

    const theme = new Theme(
      crypto.randomUUID(),
      generatedContent,
      params.theme,
      params.themeLevel,
      params.themeType,
    )

    await this.themeRepository.save(theme)

    return theme
  }

  private validateInput(params: {
    theme: ThemeInput
    themeLevel: ThemeLevel
    themeType: ThemeType
  }) {
    if (!params.theme || typeof params.theme !== 'string') {
      throw new Error('Theme content is required and must be a string')
    }

    if (!['Low', 'Middle', 'High'].includes(params.themeLevel)) {
      throw new Error('Invalid theme level')
    }

    if (!['quickstart', 'ocr'].includes(params.themeType)) {
      throw new Error('Invalid theme type')
    }
  }
}
