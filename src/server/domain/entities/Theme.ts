import type { ThemeLevel, ThemeType } from '../../../types/theme.types'

export class Theme {
  constructor(
    private id: string,
    private content: string,
    private theme: string,
    private level: ThemeLevel,
    private themeType: ThemeType,
  ) {}

  getId(): string {
    return this.id
  }

  getContent(): string {
    return this.content
  }

  getTheme(): string {
    return this.theme
  }

  getLevel(): ThemeLevel {
    return this.level
  }

  getThemeType(): ThemeType {
    return this.themeType
  }
}
