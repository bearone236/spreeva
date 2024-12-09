'use client'

import LevelDisplay from '@/components/LevelDisplay'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import useStore from '../../provider/store/useStore'

export default function ResultPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const {
    theme,
    level,
    spokenText,
    thinkTime,
    speakTime,
    themeType,
    setEvaluation,
    retryCount,
    incrementRetryCount,
  } = useStore()
  const [isLoading, setIsLoading] = useState(false)

  const maxRetries = 1

  const handleEvaluate = async () => {
    setIsLoading(true)

    const evaluationData = {
      userId: session?.user?.id || null,
      theme,
      themeType: themeType as 'quickstart' | 'ocr',
      level,
      thinkTime: Number(thinkTime),
      speakTime: Number(speakTime),
      transcript: spokenText,
    }

    try {
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(evaluationData),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to evaluate speech')
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
    if (retryCount < maxRetries) {
      incrementRetryCount()
      router.push('/speaking')
    } else {
      alert('これ以上再試行できません。')
    }
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
              className='bg-[#ed9600] hover:bg-[#ed7e00] text-white'
              disabled={retryCount >= maxRetries}
            >
              Retry ({maxRetries - retryCount} 残り)
            </Button>
            {isLoading ? (
              <Button className='bg-[#ed7e00] text-white' disabled>
                評価中...
              </Button>
            ) : (
              <Button
                onClick={handleEvaluate}
                className='bg-[#ed7e00] hover:bg-[#ed9600] text-white font-semibold'
                disabled={
                  spokenText === '音声が検出されませんでした' || isLoading
                }
              >
                評価
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
