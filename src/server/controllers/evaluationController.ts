import { auth } from '@/app/api/auth/[...nextauth]/auth'
import { prisma } from '@/lib/prisma'
import type { Context } from 'hono'
import type { EvaluationRequest as EvalRequestType } from '../domain/evaluation'
import { EvaluateSpeechUseCase } from '../usecase/evaluateSpeech'

export class EvaluationController {
  private evaluateSpeechUseCase: EvaluateSpeechUseCase

  constructor() {
    this.evaluateSpeechUseCase = new EvaluateSpeechUseCase()
  }

  async handleEvaluateSpeech(c: Context) {
    const session = await auth();

    if (!session?.user?.email) {
      return c.json({ error: 'Unauthorized: User not logged in or session invalid' }, 401);
    }

    const { theme, level, transcript, thinkTime, speakTime } = await c.req.json()

    if (!theme || !level || !transcript) {
      return c.json({ error: 'Invalid input, missing parameters' }, 400)
    }

    const requestData: EvalRequestType = {
      theme,
      level,
      transcript,
    }

    try {
      const evaluationResponse = await this.evaluateSpeechUseCase.execute(requestData)

      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });

      if (user) {
        const speakingResult = await prisma.speakingResult.create({
          data: {
            userId: user.id, 
            theme: theme,
            level: level,
            thinkTime: Number(thinkTime),
            speakTime: Number(speakTime),
            spokenText: transcript,
            aiEvaluation: evaluationResponse.evaluation,
            aiImprovedText: null,
            speechScore: null,
            grammarAccuracy: null,
            vocabularyRange: null,
            pronunciationClarity: null,
            fluency: null,
            contentRelevance: null,
          },
        });

        await prisma.evaluationRequest.create({
          data: {
            speakingResultId: speakingResult.id,
            requestBody: JSON.stringify(requestData),
            responseBody: JSON.stringify(evaluationResponse),
          },
        });
      }

      return c.json({
        evaluation: evaluationResponse.evaluation,
      });
    } catch (error) {
      console.error('Error during evaluation or saving process:', error);
      return c.json({ error: 'Failed to evaluate speech or save result' }, 500);
    }
  }
}
