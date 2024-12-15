import type { ThemeLevel } from '../../../types/theme.types'

export class SpeakingEvaluation {
  constructor(
    private id: string,
    private userId: string | null,
    private organizationUserId: string | null,
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

  getUserId(): string | null {
    return this.userId
  }

  getOrganizationUserId(): string | null {
    return this.organizationUserId
  }

  getTheme(): string {
    return this.theme
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
