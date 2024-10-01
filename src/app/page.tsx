import ContributionGraph from '@/components/ContributionGraph/index'
import GamificationCard from '@/components/GemificationCard'
import QuickStartForm from '@/components/QuickStartForm'
import React from 'react'
import { auth } from './api/auth/[...nextauth]/auth'

export default async function Page() {
  const session = await auth()

  return (
    <>
      <main className='min-h-screen'>
        {session?.user ? (
          <>
            <h2 className='text-2xl font-bold'>
              {`Hello, ${session.user.name}`}
            </h2>
            <div className='flex flex-col'>
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
            </div>
          </>
        ) : (
          <div className='mt-5 w-[800px] mx-auto'>
            <h2 className='text-2xl font-bold pb-7'>Hello, Guest</h2>
            <QuickStartForm />
          </div>
        )}
      </main>
    </>
  )
}
