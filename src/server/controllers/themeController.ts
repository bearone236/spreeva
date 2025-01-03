import type { Context } from 'hono'
import { z } from 'zod'
import type { ThemeLevel } from '../../types/theme.types'
import type { Theme } from '../domain/entities/Theme'
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
      const isMultipart =
        c.req.header('content-type')?.includes('multipart/form-data') ?? false
      const validatedData = isMultipart
        ? await this.handleMultipartRequest(c)
        : await this.handleJsonRequest(c)

      const theme = await this.generateThemeUseCase.execute(validatedData)

      const response = this.createResponse(
        theme,
        isMultipart,
        validatedData.theme,
      )

      return c.json(response)
    } catch (error) {
      return this.handleError(error, c)
    }
  }

  private async handleMultipartRequest(c: Context) {
    const formData = await c.req.formData()
    const file = formData.get('file') as File
    if (!file) throw new Error('PDFファイルがありません')

    const arrayBuffer = await file.arrayBuffer()
    const extractedText = await this.pdfThemeGenerationUsecase.execute(
      new Blob([arrayBuffer], { type: 'application/pdf' }),
    )

    const themeLevel = (formData.get('themeLevel') as ThemeLevel) || 'Middle'
    return themeRequestSchema.parse({
      theme: extractedText.trim(),
      themeLevel,
      themeType: 'ocr',
    })
  }

  private async handleJsonRequest(c: Context) {
    const body = await c.req.json()
    return themeRequestSchema.parse(body)
  }

  private createResponse(
    theme: Theme,
    isMultipart: boolean,
    sourceText?: string,
  ) {
    if (isMultipart) {
      return ocrThemeResponseSchema.parse({
        success: true,
        theme: theme.getContent(),
        message: theme.getContent(),
        data: {
          id: theme.getId(),
          content: theme.getContent(),
          level: theme.getLevel(),
          type: theme.getThemeType(),
          sourceText,
        },
      })
    }

    return themeResponseSchema.parse({
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
  }

  private handleError(error: unknown, c: Context) {
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
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500,
    )
  }
}
