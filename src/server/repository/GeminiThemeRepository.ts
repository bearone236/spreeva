import { GoogleGenerativeAI } from '@google/generative-ai'
import type { Theme } from '../domain/entities/Theme'
import type { IThemeInterface } from '../domain/interfaces/IThemeInterface'
import type { ThemeGenerationParams } from '../domain/interfaces/IThemeInterface'

export class GeminiThemeRepository implements IThemeInterface {
  genAI!: GoogleGenerativeAI
  private generatedThemes: Set<string> = new Set()

  constructor(
    private apiUrl: string,
    private apiKey: string,
  ) {}

  async generateTheme(params: ThemeGenerationParams): Promise<string> {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not defined')
    }
    this.genAI = new GoogleGenerativeAI(this.apiKey)

    const prompt = this.createPrompt(params)

    try {
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 2.0,
          topP: 0.9,
        },
      })

      // biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
      let result
      for (let attempts = 0; attempts < 3; attempts++) {
        result = await model.generateContent(prompt)
        if (!result || !result.response) {
          throw new Error('Failed to generate content from Gemini AI')
        }

        const jsonResponse = JSON.parse(await result.response.text())
        if (!jsonResponse.question) {
          throw new Error('Response does not contain a "question" field')
        }

        const question = jsonResponse.question
        if (!this.generatedThemes.has(question)) {
          this.generatedThemes.add(question)
          return question
        }
      }

      throw new Error('Failed to generate a unique theme after 3 attempts')
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Failed to generate theme from Gemini API: ${error.message}`,
        )
      }
      throw new Error('Failed to generate theme from Gemini API: Unknown error')
    }
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

    const creativeGuidance =
      'Ensure the question is unique, thought-provoking, and contains creative elements to keep it fresh.'

    const basePrompt = `You are an English speech test teacher. Your task is to generate a single-sentence English question with a maximum of 15 words, suitable for a speaking practice test at the ${params.level} level (${levelDescriptions[params.level]}). The question should align with the following goal: ${speakingGoals[params.level]}. ${creativeGuidance}`

    if (params.themeType === 'ocr') {
      return `${basePrompt} Based on this text: "${params.theme}", create a relevant and creative discussion question.`
    }

    if (params.theme !== 'random') {
      return `${basePrompt} Create a themed question that encourages unique and thoughtful discussion about "${params.theme}".`
    }

    if (params.level !== 'Low') {
      return `${basePrompt} The topic can reference unique perspectives on current news, historical events, or general knowledge.`
    }

    return `${basePrompt} Generate a random, unique theme that encourages thoughtful discussion while meeting the level-specific requirements.`
  }
}
