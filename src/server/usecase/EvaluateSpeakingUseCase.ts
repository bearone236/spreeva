import type { ThemeLevel } from '../../types/theme.types'
import { SpeakingEvaluation } from '../domain/entities/SpeakingEvaluation'
import type { IEvaluationInterface } from '../domain/interfaces/IEvaluationInterface'

export class EvaluateSpeakingUseCase {
  constructor(private evaluationRepository: IEvaluationInterface) {}

  async execute(params: {
    userId: string | null
    theme: string
    level: ThemeLevel
    spokenText: string
    thinkTime: number
    speakTime: number
  }): Promise<SpeakingEvaluation> {
    this.validateInput(params)
    const evaluationText = await this.evaluationRepository.generateEvaluation({
      theme: params.theme,
      level: params.level,
      spokenText: params.spokenText,
    })

    const evaluation = new SpeakingEvaluation(
      crypto.randomUUID(),
      params.userId,
      params.theme,
      params.spokenText,
      params.level,
      params.thinkTime,
      params.speakTime,
      evaluationText,
    )

    if (params.userId) {
      await this.evaluationRepository.saveEvaluation(evaluation)
    }

    return evaluation
  }

  private validateInput(params: {
    theme: string
    level: ThemeLevel
    spokenText: string
    thinkTime: number
    speakTime: number
  }) {
    if (!params.theme) {
      throw new Error('Theme content is required')
    }

    if (!params.spokenText || params.spokenText.trim().length === 0) {
      throw new Error('Spoken text cannot be empty')
    }

    if (!['Low', 'Middle', 'High'].includes(params.level)) {
      throw new Error('Invalid theme level')
    }

    if (params.thinkTime < 0 || params.speakTime < 0) {
      throw new Error('Time values must be positive')
    }
  }
}
