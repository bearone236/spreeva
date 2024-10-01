'use client'

import LevelDisplay from '@/components/LevelDisplay'
import { Card, CardContent } from '@/components/ui/card'
import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'
import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'

type Level = 'Low' | 'Middle' | 'High'

export default function ThinkingPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const theme = searchParams.get('theme') || 'No theme provided'
  const thinkingTimeParam = searchParams.get('thinkTime') || '30'
  const speakingTime = searchParams.get('speakTime') || '60'
  const level = (searchParams.get('level') || 'Middle') as Level
  const showTheme = searchParams.get('showTheme') === 'true'
  const readTheme = searchParams.get('readTheme') === 'true'
  const [remainingTime, setRemainingTime] = useState(
    Number.parseInt(thinkingTimeParam),
  )
  const [gracePeriod, setGracePeriod] = useState(0)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const hasStarted = useRef(false)

  const readThemeAloud = async () => {
    const utterance = new SpeechSynthesisUtterance(theme)
    utterance.lang = 'en-US'

    await wait(1000)
    await speak(utterance)

    await wait(1000)
    await speak(utterance)
  }

  const speak = (utterance: SpeechSynthesisUtterance): Promise<void> => {
    return new Promise(resolve => {
      utterance.onend = () => resolve()
      window.speechSynthesis.speak(utterance)
    })
  }

  const wait = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  const startCountdown = () => {
    const timer = setInterval(() => {
      setRemainingTime(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer)
          setGracePeriod(3)
          return 0
        }
        return prevTime - 1
      })
    }, 1000)
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!hasStarted.current) {
      hasStarted.current = true
      const startProcess = async () => {
        if (readTheme) {
          setIsSpeaking(true)
          await readThemeAloud()
          setIsSpeaking(false)
        }
        startCountdown()
      }
      startProcess()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (remainingTime === 0 && gracePeriod > 0) {
      const graceTimer = setInterval(() => {
        setGracePeriod(prev => {
          if (prev <= 1) {
            clearInterval(graceTimer)
            router.push(
              `/speaking?theme=${encodeURIComponent(
                theme,
              )}&thinkTime=${thinkingTimeParam}&speakTime=${speakingTime}&level=${level}`,
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
                {showTheme ? (
                  <p className='text-lg text-gray-700 bg-[#e6ebf0] p-4 rounded-lg border-l-4 border-[#edc700]'>
                    <ReactMarkdown>{theme}</ReactMarkdown>
                  </p>
                ) : (
                  <div className='flex items-center justify-center text-lg text-gray-500 bg-[#f6f6f6] p-4 rounded-lg border-l-4 border-gray-300'>
                    <span className='italic'>テーマが非表示です</span>
                  </div>
                )}
              </div>
              <div className='text-center'>
                <div className='text-8xl font-bold text-[#ed7e00] mb-4'>
                  {remainingTime}
                </div>
                {isSpeaking ? (
                  <p className='text-xl text-[#ed9600]'>
                    <span className='animate-pulse'>テーマを読み上げ中...</span>
                  </p>
                ) : (
                  <p className='text-xl text-[#ed9600]'>seconds remaining</p>
                )}
              </div>
            </>
          ) : gracePeriod > 0 ? (
            <div className='text-center'>
              <div className='text-2xl font-bold text-[#ed7e00] mb-2'>
                Speaking画面に遷移します。
              </div>
              <div className='text-5xl font-bold text-[#ed9600] mb-2'>
                {gracePeriod}
              </div>
              <p className='text-xl text-[#ed9600]'>秒後に遷移します</p>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
