import type { Context } from 'hono'
import type { Theme } from '../domain/theme'
import { GenerateThemeUseCase } from '../usecase/generateTheme'

export class ThemeController {
  private generateThemeUseCase: GenerateThemeUseCase

  constructor() {
    this.generateThemeUseCase = new GenerateThemeUseCase()
  }

  async handleGenerateTheme(c: Context) {
    const { theme, themeLevel } = await c.req.json()

    if (!theme || !themeLevel) {
      return c.json(
        { error: 'Invalid input, theme or themeLevel missing' },
        400,
      )
    }

    const themeData: Theme = {
      id: '',
      theme,
      themeLevel,
    }

    try {
      const generatedTheme = await this.generateThemeUseCase.execute(themeData)
      return c.json({ message: generatedTheme })
    } catch (error) {
      return c.json({ error: 'Failed to generate theme' }, 500)
    }
  }
}
