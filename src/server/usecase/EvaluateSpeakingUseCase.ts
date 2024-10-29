import { SpeakingEvaluation } from '../domain/entities/SpeakingEvaluation'
import type { IEvaluationRepository } from '../domain/interfaces/IEvaluationRepository'
import type { ThemeLevel } from '../domain/types/theme.types'

export class EvaluateSpeakingUseCase {
  constructor(private evaluationRepository: IEvaluationRepository) {}

  async execute(params: {
    userId: string | null
    theme: string
    level: ThemeLevel
    spokenText: string
    thinkTime: number
    speakTime: number
  }): Promise<SpeakingEvaluation> {
    try {
      // 入力の検証
      this.validateInput(params)

      // 評価の生成
      const evaluationText = await this.evaluationRepository.generateEvaluation(
        {
          theme: params.theme,
          level: params.level,
          spokenText: params.spokenText,
        },
      )

      const evaluation = new SpeakingEvaluation(
        crypto.randomUUID(),
        params.userId,
        params.theme,
        params.spokenText,
        params.level,
        params.thinkTime,
        params.speakTime,
        evaluationText,
        new Date(),
      )

      // ユーザーが認証されている場合のみ保存
      if (params.userId) {
        await this.evaluationRepository.saveEvaluation(evaluation)
      }

      return evaluation
    } catch (error) {
      console.error('Evaluation execution error:', error)
      throw error
    }
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
