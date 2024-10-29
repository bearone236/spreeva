import type { Context } from 'hono'
import { z } from 'zod'
import type { ThemeLevel } from '../domain/types/theme.types'
import type { GenerateThemeUseCase } from '../usecase/GenerateThemeUseCase'
import type { PDFThemeGenerationUsecase } from '../usecase/pdfThemeGeneration'

const themeRequestSchema = z.object({
  theme: z.string(),
  themeLevel: z.enum(['Low', 'Middle', 'High']),
  themeType: z.enum(['quickstart', 'ocr']),
})

export class ThemeController {
  constructor(
    private generateThemeUseCase: GenerateThemeUseCase,
    private pdfThemeGenerationUsecase: PDFThemeGenerationUsecase,
  ) {}

  async handleThemeGeneration(c: Context) {
    try {
      const contentType = c.req.header('content-type')

      if (contentType?.includes('multipart/form-data')) {
        const formData = await c.req.formData()
        const file = formData.get('file') as File

        if (!file) {
          return c.json({ error: 'PDFファイルがありません' }, 400)
        }

        const arrayBuffer = await file.arrayBuffer()
        const pdfBlob = new Blob([arrayBuffer], { type: 'application/pdf' })
        const themeLevel =
          (formData.get('themeLevel') as ThemeLevel) || 'Middle'

        const extractedText =
          await this.pdfThemeGenerationUsecase.execute(pdfBlob)

        const themeParams = {
          theme: extractedText.trim(),
          themeLevel,
          themeType: 'ocr' as const,
        }

        const validatedData = themeRequestSchema.parse(themeParams)

        const theme = await this.generateThemeUseCase.execute(validatedData)

        return c.json({
          success: true,
          theme: theme.getContent(),
          message: theme.getContent(),
          data: {
            id: theme.getId(),
            content: theme.getContent(),
            level: theme.getLevel(),
            type: theme.getGenerationType(),
            sourceText: extractedText,
          },
        })
      }

      const body = await c.req.json()
      const validatedData = themeRequestSchema.parse(body)
      const theme = await this.generateThemeUseCase.execute(validatedData)

      return c.json({
        success: true,
        message: theme.getContent(),
        data: {
          id: theme.getId(),
          content: theme.getContent(),
          level: theme.getLevel(),
          type: theme.getGenerationType(),
          sourceText: validatedData.theme,
        },
      })
    } catch (error) {
      console.error('Theme generation error:', error)

      if (error instanceof z.ZodError) {
        return c.json(
          {
            success: false,
            error: 'Invalid request data',
            details: error.errors,
          },
          400,
        )
      }

      console.error('Theme generation error:', error)
      return c.json(
        {
          success: false,
          error:
            error instanceof Error ? error.message : 'Failed to generate theme',
        },
        500,
      )
    }
  }
}
