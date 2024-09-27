import type {
  EvaluationRequest,
  EvaluationResponse,
} from '../domain/evaluation'

export class EvaluationRepository {
  private geminiApiUrl = process.env.GEMINI_API_URL
  private geminiApiKey = process.env.GEMINI_API_KEY

  async evaluateSpeech(
    requestData: EvaluationRequest,
  ): Promise<EvaluationResponse> {
    const prompt = this.createPrompt(requestData)

    const url = `${this.geminiApiUrl}?key=${this.geminiApiKey}`

    const response = await fetch(url, {
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
    return { evaluation: data.candidates[0].content.parts[0].text }
  }

  private createPrompt(requestData: EvaluationRequest): string {
    return `次のスピーチを以下のテーマに基づいてMarkdown形式で評価してください。テーマ: 「${requestData.theme}」、レベル: ${requestData.level}。 スピーチ内容は以下の通りです。「${requestData.transcript}」。 文法、語彙、内容の関連性に関する詳細なフィードバックを提供してください。また、必要に応じて、改善された文や表現をMarkdown形式で提示してください。評価結果もMarkdownで出力してください。`
  }
}
