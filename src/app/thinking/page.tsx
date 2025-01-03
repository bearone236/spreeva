'use client'

import LevelDisplay from '@/components/LevelDisplay'
import { Card, CardContent } from '@/components/ui/card'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import useStore from '../../provider/store/useStore'
const Player = dynamic(
  () => import('@lottiefiles/react-lottie-player').then(mod => mod.Player),
  {
    ssr: false,
    loading: () => <div style={{ height: '250px', width: '250px' }} />,
  },
)

export default function ThinkingPage() {
  const router = useRouter()
  const { theme, thinkTime, level, showTheme, readTheme } = useStore()
  const [remainingTime, setRemainingTime] = useState(Number.parseInt(thinkTime))
  const [gracePeriod, setGracePeriod] = useState(0)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const hasStarted = useRef(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

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
            setIsTransitioning(true)

            setTimeout(() => router.push('/speaking'), 0)
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(graceTimer)
    }
  }, [remainingTime, gracePeriod, router])

  if (isTransitioning) {
    return (
      <div className='min-h-screen flex flex-col justify-center items-center'>
        <Player
          autoplay
          loop
          src={'/loading.json'}
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            height: '250px',
            width: '250px',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />
        <p className='mt-32 text-lg text-center font-bold fixed'>
          画面の遷移中です...
        </p>
      </div>
    )
  }

  return (
    <div className='flex flex-col items-center justify-center pt-20'>
      <Card className='w-full max-w-3xl bg-white border shadow-lg rounded-lg border-[#ed9600]/20'>
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
                  <div className='text-lg text-gray-700 bg-gray-100 p-4 rounded-lg border border-gray-100'>
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => (
                          <div
                            style={{
                              userSelect: 'none',
                            }}
                          >
                            {children}
                          </div>
                        ),
                      }}
                    >
                      {theme}
                    </ReactMarkdown>
                  </div>
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
            <div className='flex justify-center items-center p-20'>
              <div className='text-center space-y-4'>
                <div className='md:text-3xl lg:text-3xl font-bold text-[#ed7e00] xs:text-2xl'>
                  Speaking画面に遷移します
                </div>
                <div className='md:text-8xl lg:text-8xl font-extrabold text-[#ed9600] '>
                  {gracePeriod}
                </div>
                <p className='md:text-2xl lg:text-2xl text-[#ed9600] font-semibold xs:text-lg'>
                  秒後に遷移します
                </p>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
