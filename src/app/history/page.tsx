import { auth } from '@/app/api/auth/[...nextauth]/auth'
import prisma from '@/lib/prisma'
import HistoryPageClient from './HistoryPageClient'

export default async function HistoryPage() {
  const session = await auth()

  if (!session || !session.user?.email) {
    return <div>Please login to view your speaking history.</div>
  }

  try {
    const speakingResults = await prisma.speakingResult.findMany({
      where: {
        user: {
          email: session.user.email,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        theme: true,
        level: true,
        thinkTime: true,
        speakTime: true,
        spokenText: true,
        createdAt: true,
      },
    })

    const history = await Promise.all(
      speakingResults.map(async entry => {
        const evaluation = await prisma.evaluation.findFirst({
          where: {
            speakingResultId: entry.id,
          },
          select: {
            aiEvaluation: true,
          },
        })

        return {
          id: entry.id,
          date: entry.createdAt.toISOString().split('T')[0],
          theme: entry.theme,
          level: entry.level as 'Low' | 'Middle' | 'High',
          thinkTime: entry.thinkTime,
          speakTime: entry.speakTime,
          spokenText: entry.spokenText,
          aiEvaluation: evaluation?.aiEvaluation || '',
        }
      }),
    )

    return <HistoryPageClient history={history} />
  } catch (error) {
    console.error('Failed to load speaking results:', error)
    return <div>Failed to load speaking results. Please try again later.</div>
  }
}
