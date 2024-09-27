'use client'

import LevelDisplay from '@/components/LevelDisplay'
import { Card, CardContent } from '@/components/ui/card'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

type Level = 'Low' | 'Middle' | 'High'

export default function ThinkingPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const theme = searchParams.get('theme') || 'No theme provided'
  const thinkingTimeParam = searchParams.get('thinkTime') || '30'
  const speakingTime = searchParams.get('speakTime') || '60'
  const level = (searchParams.get('level') || 'Middle') as Level

  const [remainingTime, setRemainingTime] = useState(
    Number.parseInt(thinkingTimeParam),
  )
  const [gracePeriod, setGracePeriod] = useState(0)

  useEffect(() => {
    if (remainingTime > 0) {
      const timer = setInterval(() => {
        setRemainingTime(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timer)
            setGracePeriod(5)
          }
          return prevTime - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }

    if (remainingTime === 0 && gracePeriod > 0) {
      const graceTimer = setInterval(() => {
        setGracePeriod(prev => {
          if (prev <= 1) {
            clearInterval(graceTimer)
            router.push(
              `/speaking?theme=${theme}&thinkTime=${thinkingTimeParam}&speakTime=${speakingTime}&level=${level}`,
            )
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(graceTimer)
    }
  }, [
    remainingTime,
    gracePeriod,
    router,
    theme,
    thinkingTimeParam,
    speakingTime,
    level,
  ])

  return (
    <div className='min-h-screen flex flex-col items-center justify-center'>
      <Card className='w-full max-w-3xl bg-white shadow-lg border-t-4 border-[#ed9600]'>
        <CardContent className='p-6'>
          {remainingTime > 0 ? (
            <>
              <div className='flex justify-between items-center mb-6'>
                <h2 className='text-2xl font-bold text-[#ed7e00]'>
                  Thinking Time
                </h2>
                <LevelDisplay level={level} />
              </div>
              <div className='mb-8'>
                <h3 className='text-xl font-semibold text-[#ed9600] mb-2'>
                  Theme
                </h3>
                <p className='text-lg text-gray-700 bg-[#e6ebf0] p-4 rounded-lg border-l-4 border-[#edc700]'>
                  {theme}
                </p>
              </div>
              <div className='text-center'>
                <div className='text-8xl font-bold text-[#ed7e00] mb-2'>
                  {remainingTime}
                </div>
                <p className='text-xl text-[#ed9600]'>seconds remaining</p>
              </div>
            </>
          ) : (
            gracePeriod > 0 && (
              <div className='text-center'>
                <div className='text-2xl font-bold text-[#ed7e00] mb-4'>
                  5秒後にSpeaking画面に遷移します
                </div>
                <div className='text-5xl font-bold text-[#ed9600] mb-2'>
                  {gracePeriod}
                </div>
                <p className='text-xl text-[#ed9600]'>seconds remaining</p>
              </div>
            )
          )}
        </CardContent>
      </Card>
    </div>
  )
}
