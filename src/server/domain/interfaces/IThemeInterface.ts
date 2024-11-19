import type {
  ThemeInput,
  ThemeLevel,
  ThemeType,
} from '../../../types/theme.types'
import type { Theme } from '../entities/Theme'

export interface IThemeInterface {
  generateTheme(params: ThemeGenerationParams): Promise<string>
  save(theme: Theme): Promise<void>
}
export interface ThemeGenerationParams {
  content: string
  type: string
  theme: ThemeInput
  level: ThemeLevel
  themeType: ThemeType
}
