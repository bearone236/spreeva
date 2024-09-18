'use client'

import LevelDisplay from '@/components/LevelDisplay'
import { Card, CardContent } from '@/components/ui/card'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

type Level = 'Low' | 'Middle' | 'High'

export default function ThinkingPage() {
  const searchParams = useSearchParams()

  // URLパラメータから取得
  const theme = searchParams.get('theme') || 'No theme provided'
  const thinkingTimeParam = searchParams.get('thinkTime') || '30'
  const themeLevel = (searchParams.get('level') || 'Middle') as Level

  const [remainingTime, setRemainingTime] = useState(
    Number.parseInt(thinkingTimeParam),
  )
  const [question] = useState(theme)

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer)
          return 0
        }
        return prevTime - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className='min-h-screen flex flex-col items-center justify-center'>
      <Card className='w-full max-w-3xl bg-white shadow-lg border-t-4 border-[#ed9600]'>
        <CardContent className='p-6'>
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-2xl font-bold text-[#ed7e00]'>Thinking Time</h2>
            <LevelDisplay level={themeLevel} />
          </div>

          <div className='mb-8'>
            <h3 className='text-xl font-semibold text-[#ed9600] mb-2'>Theme</h3>
            <p className='text-lg text-gray-700 bg-[#e6ebf0] p-4 rounded-lg border-l-4 border-[#edc700]'>
              {question}
            </p>
          </div>

          <div className='text-center'>
            <div className='text-8xl font-bold text-[#ed7e00] mb-2'>
              {remainingTime}
            </div>
            <p className='text-xl text-[#ed9600]'>seconds remaining</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
