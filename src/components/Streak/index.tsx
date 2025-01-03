import { auth } from '@/app/api/auth/[...nextauth]/auth'
import { PrismaClient } from '@prisma/client'
import StreakDashboard from './StreakDashboard'

const prisma = new PrismaClient()

export default async function StreakPage() {
  const session = await auth()

  const speakingResults = await prisma.speakingResult.findMany({
    where: { userId: session?.user?.id },
    orderBy: { createdAt: 'asc' },
  })

  const today = new Date()
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(today.getDate() - 7)

  const activeDays = new Set(
    speakingResults
      .filter(result => result.createdAt >= oneWeekAgo)
      .map(result => result.createdAt.toISOString().split('T')[0]),
  ).size

  let currentStreak = 0
  let longestStreak = 0
  let streakCounter = 0
  let previousDate: Date | null = null

  // biome-ignore lint/complexity/noForEach: <explanation>
  speakingResults.forEach(result => {
    if (previousDate) {
      const diffInDays =
        (result.createdAt.getTime() - previousDate.getTime()) /
        (1000 * 60 * 60 * 24)

      if (diffInDays === 1) {
        streakCounter++
      } else {
        longestStreak = Math.max(longestStreak, streakCounter)
        streakCounter = 1
      }
    } else {
      streakCounter = 1
    }
    previousDate = result.createdAt
  })

  longestStreak = Math.max(longestStreak, streakCounter)
  currentStreak = streakCounter

  const totalSessions = speakingResults.length

  return (
    <StreakDashboard
      currentStreak={currentStreak}
      longestStreak={longestStreak}
      totalSessions={totalSessions}
      activeDays={activeDays}
    />
  )
}
