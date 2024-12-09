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
      console.error('Error generating content from Gemini AI:', error)
      throw new Error('Failed to generate content from Gemini AI')
    }
  }

  async generateEvaluation(params: EvaluationParams): Promise<string> {
    const prompt = this.createPrompt(params)
    return this.generateContentFromAI(prompt)
  }

  async generateImprovedText(params: EvaluationParams): Promise<string> {
    const prompt = this.createImprovementPrompt(params)
    return this.generateContentFromAI(prompt)
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
          },
        })

        await tx.evaluation.create({
          data: {
            speakingResultId: speakingResult.id,
            aiEvaluation: evaluation.getEvaluation(),
            aiImprovedText: evaluation.getImprovedText(),
          },
        })
      })
    } catch (error) {
      console.error('Error during saveEvaluation (initial attempt):', error)
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
              },
            })

            await tx.evaluation.create({
              data: {
                speakingResultId: speakingResult.id,
                aiEvaluation: evaluation.getEvaluation(),
                aiImprovedText: evaluation.getImprovedText(),
              },
            })
          })
          return
        } catch (retryError) {
          throw new Error('Failed to save evaluation results after retry')
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

以下の点について、評価を行い、その評価結果をJSON形式で返してください：

1. 文法の正確性
2. 語彙の適切性と多様性
3. テーマとの関連性
4. 改善のための具体的な提案

以下のようなJSONフォーマットで評価を返してください：

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

  private createImprovementPrompt(params: EvaluationParams): string {
    return `以下のスピーチの改善案を提供してください。

テーマ: ${params.theme}
レベル: ${params.level}
スピーチ: ${params.spokenText}

改善案には、より自然で流暢な表現を含め、文法や語彙の使い方を改善してください。

改善案をJSON形式で返してください。以下のJSONフォーマットに従ってください：

\`\`\`
{
  "improvedText": "改善されたスピーチ内容",
  "explanation": "改善の説明"
}
\`\`\`

注意: JSON内の \`improvedText\` にスピーチの改善案を含め、\`explanation\` にはどの部分が改善されたかの説明を記載してください。`
  }
}
