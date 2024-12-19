import { GoogleGenerativeAI } from '@google/generative-ai'
import type { PrismaClient } from '@prisma/client'
import type { SpeakingEvaluation } from '../domain/entities/SpeakingEvaluation'
import type {
  EvaluationParams,
  IEvaluationInterface,
} from '../domain/interfaces/IEvaluationInterface'

export class GeminiEvaluationRepository implements IEvaluationInterface {
  private genAI: GoogleGenerativeAI

  constructor(private prisma: PrismaClient) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not defined')
    }
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  }

  private async generateContentFromAI(prompt: string): Promise<string> {
    if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
      throw new Error('Invalid or empty prompt provided to generateContent')
    }

    try {
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: { responseMimeType: 'application/json' },
      })

      const result = await model.generateContent(prompt)
      if (!result || !result.response) {
        throw new Error('Failed to generate content from Gemini AI')
      }
      return result.response.text()
    } catch (error) {
      throw new Error('Failed to generate content from Gemini AI')
    }
  }

  async generateEvaluation(params: EvaluationParams): Promise<string> {
    if (!params.theme || !params.level || !params.spokenText) {
      throw new Error('Invalid evaluation parameters')
    }

    const prompt = this.createPrompt(params)
    return this.generateContentFromAI(prompt)
  }

  async saveEvaluation(evaluation: SpeakingEvaluation): Promise<void> {
    const userId = evaluation.getUserId()
    const organizationUserId = evaluation.getOrganizationUserId()

    if (!userId && !organizationUserId) {
      throw new Error('Either User ID or Organization User ID is required')
    }

    try {
      await this.prisma.$transaction(async tx => {
        if (userId) {
          const userExists = await tx.user.findUnique({
            where: { id: userId },
          })
          if (!userExists) {
            throw new Error(`User with ID ${userId} does not exist.`)
          }
        }

        if (organizationUserId) {
          const organizationUserExists = await tx.organizationUser.findUnique({
            where: { id: organizationUserId },
          })
          if (!organizationUserExists) {
            throw new Error(
              `OrganizationUser with ID ${organizationUserId} does not exist.`,
            )
          }
        }

        const speakingResult = await tx.speakingResult.create({
          data: {
            userId: userId || null,
            organizationUserId: organizationUserId || null,
            theme: evaluation.getTheme(),
            level: evaluation.getLevel(),
            thinkTime: evaluation.getThinkTime(),
            speakTime: evaluation.getSpeakTime(),
            spokenText: evaluation.getSpokenText(),
          },
        })

        await tx.evaluation.create({
          data: {
            speakingResultId: speakingResult.id,
            aiEvaluation: evaluation.getEvaluation(),
          },
        })
      })
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Unknown error')
    }
  }

  private createPrompt(params: EvaluationParams): string {
    if (!params.theme || !params.level || !params.spokenText) {
      throw new Error('Invalid parameters for prompt creation')
    }
    return `以下のスピーチを評価してください。

テーマ: ${params.theme}
レベル: ${params.level}
スピーチ: ${params.spokenText}

以下の点について、評価を行い、その評価結果をJSON形式で返してください：

1. 文法の正確性
2. 語彙の適切性と多様性
3. テーマとの関連性
4. 改善のための具体的な提案

以下のようなJSONフォーマットで評価を返してください：
grammarAccuracy、vocabularyAppropriateness、relevanceToTheme、improvementSuggestionsには、それぞれ評価内容を日本語で記載してください。improvedExpressionExamplesに関しては、英語の文章で改善された表現例を記載してください。

\`\`\`
{
  "grammarAccuracy": "評価内容",
  "vocabularyAppropriateness": "評価内容",
  "relevanceToTheme": "評価内容",
  "improvementSuggestions": "評価内容",
  "improvedExpressionExamples": [
    "改善された表現例1",
    "改善された表現例2"
  ]
}
\`\`\`

注意: 各評価項目に対する具体的なコメントと、改善された表現例をJSONの \`improvedExpressionExamples\` 配列に含めてください。`
  }
}
