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
        Evaluation: {
          select: {
            similarityScore: true,
            diversityScore: true,
            overallScore: true,
            aiEvaluation: true,
          },
        },
      },
    })

    const history = speakingResults.map(entry => ({
      id: entry.id,
      date: new Date(entry.createdAt).toLocaleString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
      theme: entry.theme,
      level: entry.level as 'Low' | 'Middle' | 'High',
      thinkTime: entry.thinkTime,
      speakTime: entry.speakTime,
      spokenText: entry.spokenText,
      similarityScore: entry.Evaluation[0]?.similarityScore || null,
      diversityScore: entry.Evaluation[0]?.diversityScore || null,
      overallScore: entry.Evaluation[0]?.overallScore || null,
      aiEvaluation: entry.Evaluation[0]?.aiEvaluation || '',
    }))

    return <HistoryPageClient history={history} />
  } catch (error) {
    return <div>Failed to load speaking results. Please try again later.</div>
  }
}
