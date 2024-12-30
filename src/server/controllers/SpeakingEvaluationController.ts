import type { Context } from 'hono'
import { z } from 'zod'
import { fetchFastApiEvaluation } from '../repository/FastApiEvaluationRepository'
import type { EvaluateSpeakingUseCase } from '../usecase/EvaluateSpeakingUseCase'

const evaluationRequestSchema = z.object({
  userId: z.string().nullable().default(null),
  organizationUserId: z.string().nullable().default(null),
  theme: z.string(),
  level: z.enum(['Low', 'Middle', 'High']),
  transcript: z.string(),
  thinkTime: z.union([z.string(), z.number()]).transform(v => Number(v)),
  speakTime: z.union([z.string(), z.number()]).transform(v => Number(v)),
})

export class SpeakingEvaluationController {
  constructor(private evaluateSpeakingUseCase: EvaluateSpeakingUseCase) {}

  async handleEvaluation(c: Context) {
    try {
      const body = await c.req.json()

      const requestData = {
        userId: body.userId,
        organizationUserId: body.organizationUserId,
        theme: body.theme,
        level: body.level,
        transcript: body.transcript,
        thinkTime: body.thinkTime,
        speakTime: body.speakTime,
      }

      const validatedData = evaluationRequestSchema.parse(requestData)

      const evaluation = await this.evaluateSpeakingUseCase.execute({
        userId: validatedData.userId ?? '',
        organizationUserId: validatedData.organizationUserId ?? '',
        theme: validatedData.theme,
        level: validatedData.level,
        spokenText: validatedData.transcript,
        thinkTime: validatedData.thinkTime,
        speakTime: validatedData.speakTime,
      })

      const fastApiEvaluation = await fetchFastApiEvaluation(
        validatedData.theme,
        validatedData.transcript,
      )

      return c.json({
        success: true,
        evaluation: evaluation.getEvaluation(),
        fastApiEvaluation: fastApiEvaluation,
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return c.json(
          {
            success: false,
            error: 'Invalid request data',
            details: error.errors,
            received: await c.req.json(),
          },
          400,
        )
      }

      return c.json(
        {
          success: false,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to evaluate speech',
        },
        500,
      )
    }
  }
}
