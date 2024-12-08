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
            {/* <h2 className='text-2xl font-bold'>
              {`Hello, ${session.user.name}`}
            </h2> */}
            <div className='flex flex-col'>
              <div className='flex flex-col md:flex-row gap-6 mt-5'>
                <div className='md:w-1/2'>
                  <QuickStartForm />
                </div>

                <div className='md:w-1/2'>
                  <PDFUploadForm />
                </div>
              </div>
            </div>
            <div className='mt-4'>
              <ContributionGraph />
            </div>
          </>
        ) : (
          <div>
            {/* <h2 className='text-2xl font-bold'>Hello, Guest</h2> */}
            <div className='flex flex-col'>
              <div className='flex flex-col md:flex-row gap-6 mt-5'>
                <div className='md:w-1/2'>
                  <QuickStartForm />
                </div>
                <div className='md:w-1/2'>
                  <PDFUploadForm />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  )
}
