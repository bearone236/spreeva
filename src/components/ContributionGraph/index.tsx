import { prisma } from '@/lib/prisma'
import { auth } from '@/app/api/auth/[...nextauth]/auth'
import ContributionGraphClient from './ContributionGraphClient'

export default async function ContributionGraph() {
  const session = await auth()

  if (!session || !session.user || !session.user.email) {
    throw new Error('User session not found')
  }

  const speakingResults = await prisma.speakingResult.findMany({
    where: {
      user: {
        email: session.user.email,
      },
    },
    select: {
      createdAt: true,
    },
  })

  const contributions: { [key: string]: number } = {}
  speakingResults.forEach(result => {
    const dateString = result.createdAt.toISOString().split('T')[0]
    if (contributions[dateString]) {
      contributions[dateString] += 1
    } else {
      contributions[dateString] = 1
    }
  })

  return <ContributionGraphClient contributions={contributions} />
}
