import type {
  EvaluationRequest,
  EvaluationResponse,
} from '../domain/evaluation'
import { EvaluationRepository } from '../repository/evaluationRepository'

export class EvaluateSpeechUseCase {
  private evaluationRepository: EvaluationRepository

  constructor() {
    this.evaluationRepository = new EvaluationRepository()
  }

  async execute(requestData: EvaluationRequest): Promise<EvaluationResponse> {
    try {
      return await this.evaluationRepository.evaluateSpeech(requestData)
    } catch (error) {
      throw new Error('Failed to evaluate speech')
    }
  }
}
