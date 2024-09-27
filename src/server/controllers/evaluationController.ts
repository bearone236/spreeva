import type { Context } from 'hono'
import type { EvaluationRequest } from '../domain/evaluation'
import { EvaluateSpeechUseCase } from '../usecase/evaluateSpeech'

export class EvaluationController {
  private evaluateSpeechUseCase: EvaluateSpeechUseCase

  constructor() {
    this.evaluateSpeechUseCase = new EvaluateSpeechUseCase()
  }

  async handleEvaluateSpeech(c: Context) {
    const { theme, level, transcript } = await c.req.json()

    if (!theme || !level || !transcript) {
      return c.json({ error: 'Invalid input, missing parameters' }, 400)
    }

    const requestData: EvaluationRequest = {
      theme,
      level,
      transcript,
    }

    try {
      const evaluationResponse =
        await this.evaluateSpeechUseCase.execute(requestData)
      return c.json({ evaluation: evaluationResponse.evaluation })
    } catch (error) {
      return c.json({ error: 'Failed to evaluate speech' }, 500)
    }
  }
}
