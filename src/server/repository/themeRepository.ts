import type { Theme } from '../domain/theme'

export class ThemeRepository {
  private geminiApiUrl = process.env.GEMINI_API_URL
  private geminiApiKey = process.env.GEMINI_API_KEY

  async generateTheme(themeData: Theme): Promise<string> {
    const prompt = this.createPrompt(themeData)
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
    return data.candidates[0].content.parts[0].text
  }

  private createPrompt(themeData: Theme): string {
    const levelDescriptions = {
      Low: 'using simple vocabulary and short sentences.',
      Middle: 'requiring moderate complexity in vocabulary and grammar.',
      High: 'using advanced vocabulary and complex sentence structures.',
    }

    if (themeData.theme === 'random') {
      return `You are an English speech test teacher. Please output only a question suitable for an English speaking practice test, without additional comments or conversational text. The question should focus solely on improving speaking skills at the ${themeData.themeLevel} level (${levelDescriptions[themeData.themeLevel]}). There are three English levels: Low (middle school level), Medium (high school/college level), and High (college graduate/adult level). Generate a random, single-sentence English question for the user to respond to at a ${themeData.themeLevel} level, avoiding basic or conversational questions like “What is your name?” and focusing on questions that encourage a thoughtful response.`
    }

    return `You are an English speech test teacher. Please output only a question suitable for an English speaking practice test, without additional comments or conversational text. The question should focus solely on improving speaking skills at the ${themeData.themeLevel} level (${levelDescriptions[themeData.themeLevel]}). There are three English levels: Low (middle school level), Medium (high school/college level), and High (college graduate/adult level). Generate a single-sentence English question focused on the theme: "${themeData.theme}", encouraging a thoughtful and detailed response from the user at a ${themeData.themeLevel} level. Avoid any conversational text or extraneous comments.`
  }
}
