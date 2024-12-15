import { auth } from '@/app/api/auth/[...nextauth]/auth'
import prisma from '@/lib/prisma'
import ContributionGraphClient from './ContributionGraphClient'

export default async function ContributionGraph() {
  const session = await auth()

  if (!session || !session.user || !session.user.email) {
    throw new Error('User session not found')
  }

  let speakingResults = []

  if (session.user.userType === 'user') {
    speakingResults = await prisma.speakingResult.findMany({
      where: {
        user: {
          email: session.user.email,
        },
      },
      select: {
        createdAt: true,
      },
    })
  } else {
    const organizationUser = await prisma.organizationUser.findUnique({
      where: {
        email: session.user.email,
      },
    })

    if (!organizationUser) {
      throw new Error('OrganizationUser not found')
    }

    speakingResults = await prisma.speakingResult.findMany({
      where: {
        organizationUserId: organizationUser.id,
      },
      select: {
        createdAt: true,
      },
    })
  }

  const contributions: { [key: string]: number } = {}
  // biome-ignore lint/complexity/noForEach: <explanation>
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
