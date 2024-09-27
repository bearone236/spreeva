'use client'

import LevelDisplay from '@/components/LevelDisplay'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

type Level = 'Low' | 'Middle' | 'High'

export default function ResultPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [retryCount, setRetryCount] = useState(0)
  const maxRetries = 3
  const [isLoading, setIsLoading] = useState(false)

  const theme = searchParams.get('theme') || 'No theme provided.'
  const level = (searchParams.get('level') as Level) || 'Middle'
  const spokenText =
    searchParams.get('spokenText') || 'No spoken text provided.'
  const thinkTime = searchParams.get('thinkTime') || '30'
  const speakTime = searchParams.get('speakTime') || '60'

  const handleRetry = () => {
    if (retryCount < maxRetries) {
      setRetryCount(retryCount + 1)
      router.push(
        `/speaking?theme=${encodeURIComponent(theme)}&level=${encodeURIComponent(
          level,
        )}&thinkTime=${thinkTime}&speakTime=${speakTime}`,
      )
    }
  }

  const handleEvaluate = async () => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          theme,
          level,
          transcript: spokenText,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to evaluate speech')
      }

      const data = await response.json()

      router.push(
        `/evaluate?theme=${encodeURIComponent(theme)}&level=${encodeURIComponent(level)}&spokenText=${encodeURIComponent(spokenText)}&thinkTime=${thinkTime}&speakTime=${speakTime}&evaluation=${encodeURIComponent(data.evaluation)}&speechScore=85&grammarAccuracy=90&vocabularyRange=85&pronunciationClarity=80&fluency=85&contentRelevance=90&aiImprovedText=${encodeURIComponent('Improved version of the speech here.')}`,
      )
    } catch (error) {
      alert('評価に失敗しました。もう一度お試しください。')
    } finally {
      setIsLoading(false)
    }
  }

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
              disabled={isLoading}
            >
              {isLoading ? 'Evaluating...' : 'Evaluate'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
