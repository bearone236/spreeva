import type { ThemeLevel } from '../../../types/theme.types'

export class SpeakingEvaluation {
  constructor(
    private id: string,
    private userId: string | null,
    private theme: string,
    private spokenText: string,
    private level: ThemeLevel,
    private thinkTime: number,
    private speakTime: number,
    private evaluation: string,
    private createdAt: Date = new Date(),
  ) {}

  getId(): string {
    return this.id
  }

  getTheme(): string {
    return this.theme
  }

  getUserId(): string | null {
    return this.userId
  }

  getSpokenText(): string {
    return this.spokenText
  }

  getLevel(): ThemeLevel {
    return this.level
  }

  getThinkTime(): number {
    return this.thinkTime
  }

  getSpeakTime(): number {
    return this.speakTime
  }

  getEvaluation(): string {
    return this.evaluation
  }

  getCreatedAt(): Date {
    return this.createdAt
  }
}
