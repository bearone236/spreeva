export type ThemeLevel = 'Low' | 'Middle' | 'High'
export type ThemeType = 'quickstart' | 'ocr'
export type ThemeInput = 'random' | 'custom' | string

export type Evaluation = {
  grammarAccuracy: string
  vocabularyAppropriateness: string
  relevanceToTheme: string
  improvementSuggestions: string
  improvedExpressionExamples: string[]
}
