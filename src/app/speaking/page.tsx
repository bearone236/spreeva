/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    SpeechRecognition: any
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    webkitSpeechRecognition: any
  }

  interface SpeechRecognition extends EventTarget {
    continuous: boolean
    interimResults: boolean
    lang: string
    start: () => void
    stop: () => void
    onresult: (event: SpeechRecognitionEvent) => void
    onerror: (event: SpeechRecognitionErrorEvent) => void
  }

  interface SpeechRecognitionEvent extends Event {
    readonly results: SpeechRecognitionResultList
  }

  interface SpeechRecognitionErrorEvent extends Event {
    readonly error: string
  }

  interface SpeechRecognitionResultList {
    readonly length: number
    item(index: number): SpeechRecognitionResult
  }

  interface SpeechRecognitionResult {
    readonly isFinal: boolean
    readonly length: number
    item(index: number): SpeechRecognitionAlternative
  }

  interface SpeechRecognitionAlternative {
    readonly transcript: string
    readonly confidence: number
  }
}

export default function SpeakingPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const theme = searchParams.get('theme') || 'No theme provided'
  const speakingTimeParam = searchParams.get('speakTime') || '60'
  const thinkTime = searchParams.get('thinkTime') || '30'
  const level = searchParams.get('level') || 'Middle'

  const [remainingTime, setRemainingTime] = useState(
    Number.parseInt(speakingTimeParam),
  )
  const [transcribedText, setTranscribedText] = useState('')

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition

    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.continuous = true
    recognition.interimResults = true

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const lastResultIndex = event.results.length - 1
      const transcript = event.results[lastResultIndex][0].transcript
      setTranscribedText(prevText => `${prevText} ${transcript}`)
    }

    recognition.start()

    const timer = setInterval(() => {
      setRemainingTime(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer)
          recognition.stop()

          router.push(
            `/result?theme=${theme}&thinkTime=${thinkTime}&speakTime=${speakingTimeParam}&level=${level}&spokenText=${encodeURIComponent(
              transcribedText,
            )}`,
          )
          return 0
        }
        return prevTime - 1
      })
    }, 1000)

    return () => {
      clearInterval(timer)
      recognition.stop()
    }
  }, [router, theme, speakingTimeParam, thinkTime, level, transcribedText])

  const handleSkipAndEvaluate = () => {
    router.push(
      `/result?theme=${theme}&thinkTime=${thinkTime}&speakTime=${speakingTimeParam}&level=${level}&spokenText=${encodeURIComponent(
        transcribedText,
      )}`,
    )
  }

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
          <div className='mt-8 flex justify-center'>
            <Button
              onClick={handleSkipAndEvaluate}
              className='bg-[#ff4a4a] hover:bg-[#dc4343] text-white py-2 px-4 rounded-md'
            >
              Skip and Evaluate
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
