import type { ThemeLevel } from '../../../types/theme.types'
import type { SpeakingEvaluation } from '../entities/SpeakingEvaluation'

export interface IEvaluationInterface {
  generateEvaluation(params: EvaluationParams): Promise<string>
  generateImprovedText(params: EvaluationParams): Promise<string>
  saveEvaluation(evaluation: SpeakingEvaluation): Promise<void>
}

export interface EvaluationParams {
  theme: string
  level: ThemeLevel
  spokenText: string
}
