import type { Theme } from '../domain/entities/Theme'
import type { IThemeRepository } from '../domain/interfaces/IThemeRepository'
import type { ThemeGenerationParams } from '../domain/interfaces/IThemeRepository'

export class GeminiThemeRepository implements IThemeRepository {
  constructor(
    private apiUrl: string,
    private apiKey: string,
  ) {}

  async generateTheme(params: ThemeGenerationParams): Promise<string> {
    const prompt = this.createPrompt(params)

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
      throw new Error('Failed to generate theme from Gemini API')
    }

    const data = await response.json()
    return data.candidates[0].content.parts[0].text
  }

  async save(theme: Theme): Promise<void> {
    // テーマの保存処理を実装（必要に応じて）
  }

  private createPrompt(params: ThemeGenerationParams): string {
    const levelDescriptions = {
      Low: 'using simple vocabulary and short sentences',
      Middle: 'requiring moderate complexity in vocabulary and grammar',
      High: 'using advanced vocabulary and complex sentence structures',
    }

    const basePrompt = `You are an English speech test teacher. Generate a single-sentence English question suitable for a speaking practice test at the ${params.level} level (${levelDescriptions[params.level]}).`

    if (params.generationType === 'ocr') {
      return `${basePrompt} Based on this text: "${params.themeInput}", create a relevant discussion question.`
    }

    if (params.themeInput === 'custom') {
      return `${basePrompt} Create a themed question that encourages thoughtful discussion about "${params.themeInput}".`
    }

    return `${basePrompt} Create a random theme that encourages thoughtful discussion.`
  }
}
