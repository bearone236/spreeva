export type EvaluationRequest = {
  theme: string
  level: 'Low' | 'Middle' | 'High'
  transcript: string
}

export type EvaluationResponse = {
  evaluation: string
}
