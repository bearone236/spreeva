import type { Context } from 'hono'
import { z } from 'zod'
import type { ThemeLevel } from '../../types/theme.types'
import type { ThemeUseCase } from '../usecase/ThemeUseCase'
import type { PDFThemeGenerationUsecase } from '../usecase/pdfThemeGeneration'

const themeRequestSchema = z.object({
  theme: z.string(),
  themeLevel: z.enum(['Low', 'Middle', 'High']),
  themeType: z.enum(['quickstart', 'ocr']),
})

const themeResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    id: z.string(),
    content: z.string(),
    theme: z.string(),
    level: z.enum(['Low', 'Middle', 'High']),
    type: z.enum(['quickstart', 'ocr']),
  }),
})

const ocrThemeResponseSchema = z.object({
  success: z.boolean(),
  theme: z.string(),
  message: z.string(),
  data: z.object({
    id: z.string(),
    content: z.string(),
    level: z.enum(['Low', 'Middle', 'High']),
    type: z.enum(['quickstart', 'ocr']),
    sourceText: z.string(),
  }),
})

export class ThemeController {
  constructor(
    private generateThemeUseCase: ThemeUseCase,
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

        const response = ocrThemeResponseSchema.parse({
          success: true,
          theme: theme.getContent(),
          message: theme.getContent(),
          data: {
            id: theme.getId(),
            content: theme.getContent(),
            level: theme.getLevel(),
            type: theme.getThemeType(),
            sourceText: extractedText,
          },
        })

        return c.json(response)
      }

      const body = await c.req.json()
      const validatedData = themeRequestSchema.parse(body)
      const theme = await this.generateThemeUseCase.execute(validatedData)

      const response = themeResponseSchema.parse({
        success: true,
        message: theme.getContent(),
        data: {
          id: theme.getId(),
          content: theme.getContent(),
          theme: theme.getTheme(),
          level: theme.getLevel(),
          type: theme.getThemeType(),
        },
      })

      return c.json(response)
    } catch (error) {
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
