'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Player } from '@lottiefiles/react-lottie-player'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export default function SpeakingPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const theme = searchParams.get('theme') || 'No theme provided'
  const speakingTimeParam = searchParams.get('speakTime') || '60'
  const thinkTime = searchParams.get('thinkTime') || '30'
  const level = searchParams.get('level') || 'Middle'
  const themeType = searchParams.get('themeType') || 'quickstart'

  const [remainingTime, setRemainingTime] = useState(
    Number.parseInt(speakingTimeParam),
  )
  const [transcribedText, setTranscribedText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)

  useEffect(() => {
    if (remainingTime === 0 && !isLoading) {
      handleSkipAndEvaluate(transcribedText || '音声が検出されませんでした')
    }
  }, [remainingTime, transcribedText, isLoading])

  useEffect(() => {
    let stream: MediaStream | null = null

    const startSpeechRecognition = async () => {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      const audioChunks: Blob[] = []
      mediaRecorder.ondataavailable = event => {
        audioChunks.push(event.data)
      }

      mediaRecorder.start()

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' })
        setIsLoading(true)
        await sendAudioToServer(audioBlob)
      }

      const timer = setTimeout(() => {
        mediaRecorder.stop()
      }, Number(speakingTimeParam) * 1000)

      return () => {
        clearTimeout(timer)
        for (const track of stream?.getTracks() || []) {
          track.stop()
        }
      }
    }

    startSpeechRecognition()

    const interval = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          setIsLoading(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      clearInterval(interval)
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== 'inactive'
      ) {
        mediaRecorderRef.current.stop()
      }
      if (stream) {
        for (const track of stream.getTracks()) {
          track.stop()
        }
      }
    }
  }, [speakingTimeParam])

  const sendAudioToServer = async (audioBlob: Blob) => {
    const formData = new FormData()
    formData.append('file', audioBlob, 'uploaded-audio.wav')

    try {
      const response = await fetch('/api/speech', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setTranscribedText(data.transcription || '')
        setIsLoading(false)
      } else {
        console.error('Failed to transcribe audio', response.statusText)
        setIsLoading(false)
        handleSkipAndEvaluate('音声が検出されませんでした')
      }
    } catch (error) {
      console.error('Error while sending audio to server', error)
      setIsLoading(false)
      handleSkipAndEvaluate('音声が検出されませんでした')
    }
  }

  const handleSkipAndEvaluate = (transcription: string = transcribedText) => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== 'inactive'
    ) {
      mediaRecorderRef.current.stop()
    }

    router.push(
      `/result?theme=${theme}&thinkTime=${thinkTime}&speakTime=${speakingTimeParam}&level=${level}&spokenText=${encodeURIComponent(transcription)}&themeType=${themeType}`,
    )
  }

  if (isLoading) {
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
          テキストを読み取っています...
        </p>
      </div>
    )
  }

  return (
    <div className=' flex flex-col items-center justify-center pt-20'>
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
              onClick={() =>
                handleSkipAndEvaluate(
                  transcribedText || '音声が検出されませんでした',
                )
              }
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
