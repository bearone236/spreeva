import type { Context } from 'hono'
import type { Theme } from '../domain/theme'
import type { GenerateThemeUseCase } from '../usecase/generateTheme'
import type { PDFThemeGenerationUsecase } from '../usecase/pdfThemeGeneration'

export class ThemeController {
  private generateThemeUseCase: GenerateThemeUseCase
  private pdfThemeGenerationUsecase: PDFThemeGenerationUsecase

  constructor(
    generateThemeUseCase: GenerateThemeUseCase,
    pdfThemeGenerationUsecase: PDFThemeGenerationUsecase,
  ) {
    this.generateThemeUseCase = generateThemeUseCase
    this.pdfThemeGenerationUsecase = pdfThemeGenerationUsecase
  }

  async handleGenerateTheme(c: Context) {
    try {
      // PDFのアップロード処理を考慮
      if (c.req.header('content-type')?.includes('multipart/form-data')) {
        const formData = await c.req.formData()
        const file = formData.get('file') as File
        if (!file) {
          return c.json({ error: 'PDFファイルがありません' }, 400)
        }

        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        const blob = new Blob([buffer], { type: 'application/pdf' })

        // PDFからテーマを生成
        const theme = await this.pdfThemeGenerationUsecase.execute(blob)

        return c.json({ theme })
      }

      const { theme, themeLevel, themeType } = await c.req.json()

      if (!theme || !themeLevel || !themeType) {
        return c.json(
          { error: 'Invalid input, theme, themeLevel, or themeType missing' },
          400,
        )
      }

      const themeData: Theme = {
        id: '',
        theme,
        themeLevel,
      }

      const generatedTheme = await this.generateThemeUseCase.execute(
        themeData,
        themeType,
      )
      return c.json({ message: generatedTheme })
    } catch (error) {
      return c.json({ error: 'テーマ生成に失敗しました。' }, 500)
    }
  }
}
