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
      return `Generate a random English question at a ${themeData.themeLevel} level, ${levelDescriptions[themeData.themeLevel]}.`
    }

    return `Generate a detailed English question at a ${themeData.themeLevel} level, focusing on the theme: "${themeData.theme}". ${levelDescriptions[themeData.themeLevel]}`
  }
}
