import AboutPage from '@/components/About'
import ContributionGraph from '@/components/ContributionGraph/index'
import PDFUploadForm from '@/components/PDFUploadForm'
// import GamificationCard from '@/components/GemificationCard'
import QuickStartForm from '@/components/QuickStartForm'
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
              <div className='flex flex-col md:flex-row gap-6 mt-4'>
                <div className='md:w-1/2'>
                  <QuickStartForm />
                </div>
                <div className='md:w-1/2'>
                  <PDFUploadForm />
                </div>
              </div>
            </div>
            <div className='mt-4 px-8'>
              <ContributionGraph />
            </div>
          </>
        ) : (
          <AboutPage />
        )}
      </main>
    </>
  )
}
