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
      Low: 'Simple vocabulary, short sentences, and familiar topics like daily life or preferences.',
      Middle:
        'Moderate vocabulary and grammar complexity. Topics can include current news or historical events, requiring a few connected sentences.',
      High: 'Advanced vocabulary and complex sentence structures. Topics include critical thinking or problem-solving, based on current news or historical contexts.',
    }

    const speakingGoals = {
      Low: 'Encourage users to speak in simple but complete sentences, avoiding one-word or Yes/No answers.',
      Middle:
        'Prompt users to provide clear, detailed responses with a few sentences, forming a cohesive answer.',
      High: 'Challenge users to articulate comprehensive, well-structured answers with depth and nuance in their reasoning.',
    }

    const basePrompt = `You are an English speech test teacher. Your task is to generate a single-sentence English question with a maximum of 15 words, suitable for a speaking practice test at the ${params.level} level (${levelDescriptions[params.level]}). The question should align with the following goal: ${speakingGoals[params.level]}.`

    if (params.themeType === 'ocr') {
      return `${basePrompt} Based on this text: "${params.theme}", create a relevant discussion question.`
    }

    if (params.theme === 'custom') {
      return `${basePrompt} Create a themed question that encourages thoughtful discussion about "${params.theme}".`
    }

    if (params.level !== 'Low') {
      return `${basePrompt} The topic can reference current news, historical events, or general knowledge.`
    }

    return `${basePrompt} Generate a random theme that encourages thoughtful discussion while meeting the level-specific requirements.`
  }
}
