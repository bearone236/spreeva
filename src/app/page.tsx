import AboutPage from '@/components/About'
import ContributionGraph from '@/components/ContributionGraph/index'
import PDFUploadForm from '@/components/PDFUploadForm'
import QuickStartForm from '@/components/QuickStartForm'
import StreakDashboard from '@/components/Streak/index'
import React from 'react'
import { auth } from './api/auth/[...nextauth]/auth'

export default async function Page() {
  const session = await auth()

  return (
    <>
      <main>
        {session?.user ? (
          <>
            <div className='flex flex-col px-8'>
              <div className='flex flex-col md:flex-row gap-6 mt-3'>
                <div className='md:w-1/2'>
                  <QuickStartForm />
                </div>
                <div className='md:w-1/2'>
                  <PDFUploadForm />
                </div>
              </div>
            </div>
            <div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6 px-8 mt-3'>
                <div className='w-full'>
                  <ContributionGraph />
                </div>
                <div className='w-full'>
                  <StreakDashboard />
                </div>
              </div>
            </div>
          </>
        ) : (
          <AboutPage />
        )}
      </main>
    </>
  )
}
