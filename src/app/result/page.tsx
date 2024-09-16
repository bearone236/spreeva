'use client'

import LevelDisplay from '@/components/LevelDisplay'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useState } from 'react'

export default function ResultPage() {
  const [retryCount, setRetryCount] = useState(0)
  const maxRetries = 3

  const theme =
    'What are some effective ways to reduce stress in daily life, and how have you personally dealt with stressful situations?'
  const level = 'Middle'
  const spokenText =
    "In my experience, effective ways to reduce stress include regular exercise, meditation, and maintaining a healthy work-life balance. Personally, I've found that taking short breaks throughout the day and practicing deep breathing exercises helps me manage stressful situations."

  const handleRetry = () => {
    if (retryCount < maxRetries) {
      setRetryCount(retryCount + 1)
    }
  }

  const handleEvaluate = () => {}

  return (
    <div className='min-h-screen flex flex-col items-center justify-center'>
      <Card className='w-full max-w-3xl bg-white shadow-lg border-t-4 border-[#ed9600]'>
        <CardHeader>
          <CardTitle className='text-2xl font-bold text-[#ed7e00]'>
            Result
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div>
            <h3 className='text-xl font-semibold text-[#ed9600] mb-2'>Theme</h3>
            <p className='text-lg text-gray-700 bg-[#e6ebf0] p-4 rounded-lg border-l-4 border-[#edc700]'>
              {theme}
            </p>
          </div>
          <LevelDisplay level={level} />

          <div>
            <h3 className='text-xl font-semibold text-[#ed9600] mb-2'>
              Your Response
            </h3>
            <p className='text-lg text-gray-700 bg-[#e6ebf0] p-4 rounded-lg border-l-4 border-[#edc700]'>
              {spokenText}
            </p>
          </div>

          <div className='flex justify-between items-center'>
            <Button
              onClick={handleRetry}
              disabled={retryCount >= maxRetries}
              className='bg-[#ed9600] hover:bg-[#ed7e00] text-white'
            >
              Retry ({maxRetries - retryCount} attempts left)
            </Button>
            <Button
              onClick={handleEvaluate}
              className='bg-[#ed7e00] hover:bg-[#ed9600] text-white'
            >
              Evaluate
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
