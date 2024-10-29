import type { Theme } from '../entities/Theme'
import type {
  GenerationType,
  ThemeInput,
  ThemeLevel,
} from '../types/theme.types'

export interface IThemeRepository {
  generateTheme(params: ThemeGenerationParams): Promise<string>
  save(theme: Theme): Promise<void>
}

export interface ThemeGenerationParams {
  content: string
  type: string
  themeInput: ThemeInput
  level: ThemeLevel
  generationType: GenerationType
}
