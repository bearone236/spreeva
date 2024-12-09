import { auth } from '@/app/api/auth/[...nextauth]/auth'
import prisma from '@/lib/prisma'
import type { Context } from 'hono'
import { z } from 'zod'
import type { EvaluateSpeakingUseCase } from '../usecase/EvaluateSpeakingUseCase'

const evaluationRequestSchema = z
  .object({
    userId: z.string().nullable(),
    theme: z.string(),
    level: z.enum(['Low', 'Middle', 'High']),
    transcript: z.string(),
    thinkTime: z.union([z.string(), z.number()]).transform(v => Number(v)),
    speakTime: z.union([z.string(), z.number()]).transform(v => Number(v)),
  })
  .strict()

export class SpeakingEvaluationController {
  constructor(private evaluateSpeakingUseCase: EvaluateSpeakingUseCase) {}

  async handleEvaluation(c: Context) {
    try {
      const body = await c.req.json()

      const requestData = {
        userId: body.userId || null,
        theme: body.theme,
        level: body.level,
        transcript: body.transcript,
        thinkTime: body.thinkTime,
        speakTime: body.speakTime,
      }

      const validatedData = evaluationRequestSchema.parse(requestData)

      const evaluation = await this.evaluateSpeakingUseCase.execute({
        userId: validatedData.userId,
        theme: validatedData.theme,
        level: validatedData.level,
        spokenText: validatedData.transcript,
        thinkTime: validatedData.thinkTime,
        speakTime: validatedData.speakTime,
      })

      const session = await auth()
      const sessionEmail = session?.user?.email
      if (sessionEmail) {
        const user = await prisma.user.findUnique({
          where: { email: sessionEmail },
        })

        if (user) {
          const speakingResult = await prisma.speakingResult.create({
            data: {
              userId: user.id,
              theme: validatedData.theme,
              level: validatedData.level,
              thinkTime: validatedData.thinkTime,
              speakTime: validatedData.speakTime,
              spokenText: validatedData.transcript,
            },
          })

          await prisma.evaluation.create({
            data: {
              speakingResultId: speakingResult.id,
              aiEvaluation: evaluation.getEvaluation(),
              aiImprovedText: null,
            },
          })
        }
      }

      return c.json({
        success: true,
        evaluation: evaluation.getEvaluation(),
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
