import type { GenerationType, ThemeLevel } from '../types/theme.types'

export class Theme {
  [x: string]: unknown
  getSpeakingResultId() {
    throw new Error('Method not implemented.')
  }
  constructor(
    private id: string,
    private content: string,
    private level: ThemeLevel,
    private generationType: GenerationType,
    private sourceText?: string,
  ) {}

  getId(): string {
    return this.id
  }

  getContent(): string {
    return this.content
  }

  getLevel(): ThemeLevel {
    return this.level
  }

  getGenerationType(): GenerationType {
    return this.generationType
  }

  getSourceText(): string | undefined {
    return this.sourceText
  }
}
