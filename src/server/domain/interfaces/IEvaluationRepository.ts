import type { SpeakingEvaluation } from '../entities/SpeakingEvaluation'
import type { ThemeLevel } from '../types/theme.types'

export interface IEvaluationRepository {
  generateEvaluation(params: EvaluationParams): Promise<string>
  saveEvaluation(evaluation: SpeakingEvaluation): Promise<void>
}

export interface EvaluationParams {
  theme: string
  level: ThemeLevel
  spokenText: string
}
