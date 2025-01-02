'use client'

import LevelDisplay from '@/components/LevelDisplay'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import useStore from '../../provider/store/useStore'

export default function ResultPage() {
  const router = useRouter()
  const session = useSession()
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
    setFastApiEvaluation,
  } = useStore()

  const [isLoading, setIsLoading] = useState(false)

  const handleEvaluate = async () => {
    setIsLoading(true)

    const evaluationData = {
      userId: session.data?.user?.id || null,
      organizationUserId: session.data?.user?.organizationId || null,
      theme: theme || '',
      themeType: themeType || '',
      level: level || 'Low',
      thinkTime: thinkTime || 0,
      speakTime: speakTime || 0,
      transcript: spokenText || '',
    }

    // ダミーデータテストの際に使用する
    // const evaluationData = {
    //   userId: 'cm4v1hrcu0000mjqcqxw2nyhk',
    //   organizationUserId: '',
    //   theme: 'The impact of AI on modern society',
    //   themeType: 'random',
    //   level: 'Low',
    //   thinkTime: 30,
    //   speakTime: 30,
    //   transcript: `Artificial intelligence is transforming many aspects of our lives.
    //            It is being used in healthcare, education, and even in entertainment.
    //            While there are many benefits, such as efficiency and innovation,
    //            we must also be cautious about ethical concerns like privacy and job displacement.`,
    // }

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
        setFastApiEvaluation(data.fastApiEvaluation)
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

  const isErrorSpeech = spokenText === '音声が検出されませんでした'

  return (
    <div className='flex flex-col items-center justify-center pt-20'>
      <Card className='w-full max-w-3xl bg-white border border-[#ed9600]/20'>
        <CardHeader className='pb-3 flex flex-row items-center justify-between'>
          <CardTitle className='text-2xl font-bold text-[#ed7e00]'>
            Result
          </CardTitle>
          <LevelDisplay level={level} />
        </CardHeader>
        <CardContent className='space-y-6'>
          <div>
            <h3 className='text-xl font-semibold text-[#ed9600] mb-2'>
              テーマ
            </h3>
            <p className='text-lg text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-100'>
              {theme}
            </p>
          </div>
          <div>
            <h3 className='text-xl font-semibold text-[#ed9600] mb-2'>
              あなたのスピーチ
            </h3>
            <p
              className={`text-lg bg-gray-50 p-4 rounded-lg border border-gray-100 ${
                isErrorSpeech ? 'text-red-400' : 'text-gray-700'
              }`}
            >
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
              className='bg-[#ed7e00] hover:bg-[#ed9600] text-white font-semibold px-6'
              disabled={isLoading || isErrorSpeech}
            >
              {isLoading ? '評価中' : '評価　'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
