import { Theme } from '../domain/entities/Theme'
import type {
  IThemeRepository,
  ThemeGenerationParams,
} from '../domain/interfaces/IThemeRepository'
import type { GenerationType, ThemeLevel } from '../domain/types/theme.types'

export class GenerateThemeUseCase {
  constructor(private themeRepository: IThemeRepository) {}

  async execute(params: {
    theme: string
    themeLevel: ThemeLevel
    themeType: GenerationType
  }): Promise<Theme> {
    this.validateInput(params)

    const generationParams: ThemeGenerationParams = {
      themeInput: params.theme,
      level: params.themeLevel,
      generationType: params.themeType,
      content: '',
      type: '',
    }

    // テーマ生成
    const generatedContent =
      await this.themeRepository.generateTheme(generationParams)

    if (!generatedContent) {
      throw new Error('Failed to generate theme content')
    }

    // テーマエンティティの作成
    const theme = new Theme(
      crypto.randomUUID(),
      generatedContent,
      params.themeLevel,
      params.themeType,
      params.themeType === 'ocr' ? params.theme : undefined,
    )

    await this.themeRepository.save(theme)

    return theme
  }

  private validateInput(params: {
    theme: string
    themeLevel: ThemeLevel
    themeType: GenerationType
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
