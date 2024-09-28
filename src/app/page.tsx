'use client'

import ContributionGraph from '@/components/ContributionGraph'
import GamificationCard from '@/components/GemificationCard'
import QuickStartForm from '@/components/QuickStartForm'
import { useSession } from 'next-auth/react'

export default function Page() {
  const { data: session } = useSession()

  return (
    <>
      <main className='min-h-screen'>
        <h2>
          {session?.user?.name ? `Hello, ${session.user.name}` : 'Hello, Guest'}
        </h2>
        <div className='flex flex-col md:flex-row gap-6 mt-5'>
          <div className='md:w-1/2'>
            <QuickStartForm />
          </div>
          <div className='md:w-1/2'>
            <GamificationCard
              streak={7}
              level={5}
              points={78}
              nextReward={10}
            />
          </div>
        </div>
        <div className='mt-9'>
          <ContributionGraph />
        </div>
      </main>
    </>
  )
}
