'use client'

import LevelDisplay from '@/components/LevelDisplay'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import useStore from '../../provider/store/useStore'

export default function ResultPage() {
  const router = useRouter()
  const {
    theme,
    level,
    spokenText,
    thinkTime,
    speakTime,
    themeType,
    retryCount,
    setRetryCount,
    setEvaluation,
  } = useStore()

  const [isLoading, setIsLoading] = useState(false)

  const handleEvaluate = async () => {
    setIsLoading(true)

    const evaluationData = {
      theme,
      themeType,
      level,
      thinkTime,
      speakTime,
      transcript: spokenText,
    }

    try {
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(evaluationData),
      })

      if (!response.ok) {
        throw new Error('Failed to evaluate speech')
      }

      const data = await response.json()

      if (data.success) {
        setEvaluation(data.evaluation)
        router.push('/evaluate')
      } else {
        throw new Error(data.error || 'Failed to evaluate speech')
      }
    } catch (error) {
      alert('評価に失敗しました。もう一度お試しください。')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRetry = () => {
    if (retryCount >= 1) return

    setRetryCount(retryCount + 1)
    router.push('/speaking')
  }

  return (
    <div className='flex flex-col items-center justify-center pt-20'>
      <Card className='w-full max-w-3xl bg-white shadow-lg border-t-4 border-[#ed9600]'>
        <CardHeader>
          <CardTitle className='text-2xl font-bold text-[#ed7e00]'>
            Result
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div>
            <h3 className='text-xl font-semibold text-[#ed9600] mb-2'>
              テーマ
            </h3>
            <p className='text-lg text-gray-700 bg-[#e6ebf0] p-4 rounded-lg border-l-4 border-[#edc700]'>
              {theme}
            </p>
          </div>
          <LevelDisplay level={level} />
          <div>
            <h3 className='text-xl font-semibold text-[#ed9600] mb-2'>
              あなたのスピーチ
            </h3>
            <p className='text-lg text-gray-700 bg-[#e6ebf0] p-4 rounded-lg border-l-4 border-[#edc700]'>
              {spokenText}
            </p>
          </div>
          <div className='flex justify-between'>
            <Button
              onClick={handleRetry}
              disabled={retryCount >= 1}
              className={`bg-[#ed7e00] hover:bg-[#ed9600] text-white font-semibold ${
                retryCount >= 1 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {retryCount >= 1 ? 'やり直す（0回）' : 'やり直す（1回）'}
            </Button>

            <Button
              onClick={handleEvaluate}
              className='bg-[#ed7e00] hover:bg-[#ed9600] text-white font-semibold'
              disabled={isLoading}
            >
              評価
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
