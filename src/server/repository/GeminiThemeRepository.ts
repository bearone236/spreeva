import type { Theme } from '../domain/entities/Theme'
import type { IThemeInterface } from '../domain/interfaces/IThemeInterface'
import type { ThemeGenerationParams } from '../domain/interfaces/IThemeInterface'

export class GeminiThemeRepository implements IThemeInterface {
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

  async save(_theme: Theme): Promise<void> {}

  private createPrompt(params: ThemeGenerationParams): string {
    const levelDescriptions = {
      Low: 'using simple vocabulary and short sentences',
      Middle: 'requiring moderate complexity in vocabulary and grammar',
      High: 'using advanced vocabulary and complex sentence structures',
    }

    const basePrompt = `You are an English speech test teacher. Generate a single-sentence English question suitable for a speaking practice test at the ${params.level} level (${levelDescriptions[params.level]}).`

    if (params.themeType === 'ocr') {
      return `${basePrompt} Based on this text: "${params.theme}", create a relevant discussion question.`
    }

    if (params.theme === 'custom') {
      return `${basePrompt} Create a themed question that encourages thoughtful discussion about "${params.theme}".`
    }

    return `${basePrompt} Create a random theme that encourages thoughtful discussion.`
  }
}
