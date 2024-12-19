'use client'

import LevelDisplay from '@/components/LevelDisplay'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { ThemeLevel } from '@/types/theme.types'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import useStore from '../../provider/store/useStore'

export default function ResultPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const {
    retryCount,
    setRetryCount,
    theme: storeTheme,
    level: storeLevel,
    spokenText: storeSpokenText,
    thinkTime: storeThinkTime,
    speakTime: storeSpeakTime,
    themeType: storeThemeType,
    setTheme,
    setThinkTime,
    setSpeakTime,
    setLevel,
    setThemeType,
    setEvaluation,
  } = useStore()

  const [theme, setThemeState] = useState<string>(storeTheme || '')
  const [level, setLevelState] = useState<ThemeLevel>(
    (storeLevel as ThemeLevel) || 'Low',
  )
  const [spokenText, setSpokenTextState] = useState<string>(
    storeSpokenText || '',
  )
  const [thinkTime, setThinkTimeState] = useState<number>(
    Number(storeThinkTime) || 0,
  )
  const [speakTime, setSpeakTimeState] = useState<number>(
    Number(storeSpeakTime) || 0,
  )
  const [themeType, setThemeTypeState] = useState<string>(
    storeThemeType || 'quickstart',
  )
  const [isLoading, setIsLoading] = useState(false)
  const [isDataLoaded, setIsDataLoaded] = useState(false)

  useEffect(() => {
    const savedData = localStorage.getItem('resultPageData')
    if (savedData) {
      const { theme, level, spokenText, thinkTime, speakTime, themeType } =
        JSON.parse(savedData)
      setThemeState(theme || '')
      setLevelState((level as ThemeLevel) || 'Low')
      setSpokenTextState(spokenText || '')
      setThinkTimeState(thinkTime || 0)
      setSpeakTimeState(speakTime || 0)
      setThemeTypeState(themeType || 'quickstart')
    }
    setIsDataLoaded(true)
  }, [])

  useEffect(() => {
    const dataToSave = {
      theme,
      level,
      spokenText,
      thinkTime,
      speakTime,
      themeType,
    }
    localStorage.setItem('resultPageData', JSON.stringify(dataToSave))
  }, [theme, level, spokenText, thinkTime, speakTime, themeType])

  const handleEvaluate = async () => {
    setIsLoading(true)

    const savedData = JSON.parse(localStorage.getItem('resultPageData') || '{}')
    const evaluationData = {
      userId: session?.user?.id || null,
      organizationUserId: session?.user?.organizationId || null,
      theme: theme || savedData.theme || '',
      themeType: themeType || savedData.themeType || '',
      level: level || (savedData.level as ThemeLevel) || 'Low',
      thinkTime: thinkTime || savedData.thinkTime || 0,
      speakTime: speakTime || savedData.speakTime || 0,
      transcript: spokenText || savedData.spokenText || '',
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
    if (retryCount >= 1) return

    setRetryCount(retryCount + 1)
    setTheme(theme)
    setThinkTime(String(thinkTime))
    setSpeakTime(String(speakTime))
    setLevel(level)
    setThemeType(themeType)
    router.push('/speaking')
  }

  if (!isDataLoaded) {
    return (
      <div className='flex flex-col items-center justify-center pt-20'>
        <Card className='w-full max-w-3xl bg-white shadow-lg border-t-4 border-[#ed9600] pt-10'>
          <CardContent className='space-y-6'>
            <Skeleton className='h-6 w-32 mb-4' />
            <Skeleton className='h-10 w-full mb-4' />
            <Skeleton className='h-8 w-40 mb-4' />
            <Skeleton className='h-6 w-96 mb-4' />
          </CardContent>
        </Card>
      </div>
    )
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
              disabled={
                spokenText === '音声が検出されませんでした' || isLoading
              }
            >
              評価
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
