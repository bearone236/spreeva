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
      aiEvaluation: true,
      aiImprovedText: true,
      spokenText: true,
      createdAt: true,
    },
  })

  const history = historyEntries.map(entry => ({
    id: entry.id,
    date: entry.createdAt.toISOString().split('T')[0],
    theme: entry.theme,
    level: entry.level as 'Low' | 'Middle' | 'High',
    thinkTime: entry.thinkTime,
    speakTime: entry.speakTime,
    aiEvaluation: entry.aiEvaluation ?? '',
    aiImprovedText: entry.aiImprovedText ?? '',
    spokenText: entry.spokenText,
  }))

  return <HistoryPageClient history={history} />
}
