import type { SpeechResult } from '../domain/speech'
import type { SpeechRepository } from '../repository/speechRepository'

export class RecognizeSpeechUsecase {
  private repository: SpeechRepository

  constructor(repository: SpeechRepository) {
    this.repository = repository
  }

  async execute(audioContent: Buffer): Promise<SpeechResult> {
    const transcription = await this.repository.recognizeSpeech(audioContent)
    return { transcription, confidence: 1 }
  }
}
