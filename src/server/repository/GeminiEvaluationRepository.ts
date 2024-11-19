import type { PrismaClient } from '@prisma/client'
import type { SpeakingEvaluation } from '../domain/entities/SpeakingEvaluation'
import type {
  EvaluationParams,
  IEvaluationInterface,
} from '../domain/interfaces/IEvaluationInterface'

export class GeminiEvaluationRepository implements IEvaluationInterface {
  constructor(
    private prisma: PrismaClient,
    private apiUrl: string,
    private apiKey: string,
  ) {}

  async generateEvaluation(params: EvaluationParams): Promise<string> {
    const prompt = this.createPrompt(params)

    try {
      const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch from Gemini API')
      }

      const data = await response.json()
      return data.candidates[0].content.parts[0].text
    } catch (error) {
      throw new Error('Failed to generate evaluation')
    }
  }

  async saveEvaluation(evaluation: SpeakingEvaluation): Promise<void> {
    const userId = evaluation.getUserId()
    if (!userId) {
      throw new Error('User ID is required')
    }

    try {
      await this.prisma.$transaction(async tx => {
        const speakingResult = await tx.speakingResult.create({
          data: {
            userId,
            theme: evaluation.getTheme(),
            level: evaluation.getLevel(),
            thinkTime: evaluation.getThinkTime(),
            speakTime: evaluation.getSpeakTime(),
            spokenText: evaluation.getSpokenText(),
            aiEvaluation: evaluation.getEvaluation(),
          },
        })

        await tx.evaluationRequest.create({
          data: {
            speakingResultId: speakingResult.id,
            requestBody: JSON.stringify({
              theme: evaluation.getTheme(),
              level: evaluation.getLevel(),
              transcript: evaluation.getSpokenText(),
            }),
            responseBody: JSON.stringify({
              evaluation: evaluation.getEvaluation(),
            }),
            status: 'pending',
          },
        })
      })
    } catch (error) {
      if (error instanceof Error && error.message.includes('status')) {
        try {
          await this.prisma.$transaction(async tx => {
            const speakingResult = await tx.speakingResult.create({
              data: {
                userId,
                theme: evaluation.getTheme(),
                level: evaluation.getLevel(),
                thinkTime: evaluation.getThinkTime(),
                speakTime: evaluation.getSpeakTime(),
                spokenText: evaluation.getSpokenText(),
                aiEvaluation: evaluation.getEvaluation(),
              },
            })

            await tx.evaluationRequest.create({
              data: {
                speakingResultId: speakingResult.id,
                requestBody: JSON.stringify({
                  theme: evaluation.getTheme(),
                  level: evaluation.getLevel(),
                  transcript: evaluation.getSpokenText(),
                }),
                responseBody: JSON.stringify({
                  evaluation: evaluation.getEvaluation(),
                }),
                status: 'pending',
              },
            })
          })
          return
        } catch (retryError) {
          throw new Error('Failed to save evaluation results')
        }
      }
      throw new Error('Failed to save evaluation results')
    }
  }

  private createPrompt(params: EvaluationParams): string {
    return `以下のスピーチを評価してください。

テーマ: ${params.theme}
レベル: ${params.level}
スピーチ: ${params.spokenText}

以下の点について、Markdown形式で評価を提供してください：

1. 文法の正確性
2. 語彙の適切性と多様性
3. テーマとの関連性
4. 改善のための具体的な提案

また、改善された表現例も含めてください。`
  }
}
