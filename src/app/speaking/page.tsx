'use client'
import { Card, CardContent } from '@/components/ui/card'
import { useEffect, useState } from 'react'

export default function SpeakingPage() {
  const [remainingTime, setRemainingTime] = useState(60)

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
      <Card className='w-full max-w-2xl bg-white shadow-lg border-t-4 border-[#ed9600]'>
        <CardContent className='p-12'>
          <h2 className='text-3xl font-bold text-[#ed7e00] mb-8 text-center'>
            Speaking Time
          </h2>
          <div className='text-center'>
            <div className='text-9xl font-bold text-[#ed7e00] mb-4'>
              {remainingTime}
            </div>
            <p className='text-2xl text-[#ed9600]'>seconds remaining</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
