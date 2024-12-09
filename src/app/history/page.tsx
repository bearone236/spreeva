import { auth } from '@/app/api/auth/[...nextauth]/auth'
// src/app/history/page.tsx (Server-Side Component)
import prisma from '@/lib/prisma'
import HistoryPageClient from './HistoryPageClient'

export default async function HistoryPage() {
  const session = await auth()

  if (!session || !session.user?.email) {
    return <div>Please login to view your speaking history.</div>
  }

  const historyEntries = await prisma.speakingResult.findMany({
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
      Evaluation: {
        select: {
          aiEvaluation: true,
          aiImprovedText: true,
        },
      },
    },
  })

  const history = historyEntries.map(entry => ({
    id: entry.id,
    date: entry.createdAt.toISOString().split('T')[0],
    theme: entry.theme,
    level: entry.level as 'Low' | 'Middle' | 'High',
    thinkTime: entry.thinkTime,
    speakTime: entry.speakTime,
    spokenText: entry.spokenText,
    aiEvaluation:
      entry.Evaluation?.[0]?.aiEvaluation || 'No AI evaluation available',
    aiImprovedText: entry.Evaluation?.[0]?.aiImprovedText || null,
  }))

  return <HistoryPageClient history={history} />
}
