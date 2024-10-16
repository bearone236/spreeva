'use client'

import LevelDisplay from '@/components/LevelDisplay'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

type Level = 'Low' | 'Middle' | 'High'

export default function ResultPage() {
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const maxRetries = 3
  const [retryCount, setRetryCount] = useState<number>(() => {
    const storedRetryCount = localStorage.getItem('retryCount')
    return storedRetryCount ? Number.parseInt(storedRetryCount, 10) : 0
  })

  useEffect(() => {
    localStorage.setItem('retryCount', retryCount.toString())
  }, [retryCount])

  const theme = searchParams.get('theme') || 'No theme provided.'
  const level = (searchParams.get('level') as Level) || 'Middle'
  const spokenText =
    searchParams.get('spokenText') || '音声が検出されませんでした'
  const thinkTime = searchParams.get('thinkTime') || '30'
  const speakTime = searchParams.get('speakTime') || '60'

  const handleEvaluate = async () => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session?.user?.id || null,
          theme,
          level,
          thinkTime,
          speakTime,
          transcript: spokenText,
        }),
      })

      if (!response.ok) throw new Error('Failed to evaluate speech')

      const data = await response.json()
      router.push(
        `/evaluate?theme=${encodeURIComponent(theme)}&level=${encodeURIComponent(level)}&spokenText=${encodeURIComponent(spokenText)}&thinkTime=${thinkTime}&speakTime=${speakTime}&evaluation=${encodeURIComponent(data.evaluation)}`,
      )
    } catch (error) {
      alert('評価に失敗しました。もう一度お試しください。')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRetry = () => {
    if (retryCount < maxRetries) {
      setRetryCount(retryCount + 1)
      router.push(
        `/speaking?theme=${encodeURIComponent(theme)}&level=${encodeURIComponent(level)}&thinkTime=${thinkTime}&speakTime=${speakTime}&retryCount=${retryCount + 1}`,
      )
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
                Loading...
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
