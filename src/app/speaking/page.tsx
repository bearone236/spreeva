'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Mic } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import useStore from '../../provider/store/useStore'

const Player = dynamic(
  () => import('@lottiefiles/react-lottie-player').then(mod => mod.Player),
  {
    ssr: false,
    loading: () => <div style={{ height: '250px', width: '250px' }} />,
  },
)

const Timer = ({
  remainingTime,
  isRecording,
}: { remainingTime: number; isRecording: boolean }) => {
  const [animateMic, setAnimateMic] = useState(false)

  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setAnimateMic(prev => !prev)
      }, 500)
      return () => clearInterval(interval)
    }
  }, [isRecording])

  return (
    <div className='flex flex-col items-center justify-center pt-12 p-4 '>
      <Card className='w-full max-w-2xl bg-white border shadow-lg rounded-lg border-[#ed9600]/20'>
        <CardContent className='p-8 md:p-12'>
          <h2 className='text-3xl font-bold text-[#ed7e00] mb-6 text-center'>
            Speaking Time
          </h2>
          <p className='text-center text-gray-600 mb-8'>
            Please speak clearly. Your response is being recorded.
          </p>
          <div className='text-center py-8 relative'>
            <div className='text-8xl md:text-9xl font-bold text-[#ed7e00] mb-6'>
              {remainingTime}
            </div>
            <p className='text-xl md:text-2xl text-[#ed9600] mb-4'>
              seconds remaining
            </p>
            <div
              className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 text-[#ed7e00] transition-all duration-300 ${
                animateMic ? 'scale-110' : 'scale-100'
              }`}
            >
              <Mic size={32} />
            </div>
          </div>
          <p className='text-center text-sm text-gray-500 mt-6'>
            The recording will automatically stop when the timer reaches zero.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default function SpeakingPage() {
  const router = useRouter()
  const { speakTime, setSpokenText } = useStore()

  const [remainingTime, setRemainingTime] = useState(Number.parseInt(speakTime))
  const [transcribedText, setTranscribedText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(true)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)

  useEffect(() => {
    if (remainingTime === 0 && !isLoading) {
      processRecording(transcribedText || '音声が検出されませんでした')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      }, Number(speakTime) * 1000)

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
          setIsRecording(false)
          setIsLoading(true)
          if (
            mediaRecorderRef.current &&
            mediaRecorderRef.current.state !== 'inactive'
          ) {
            mediaRecorderRef.current.stop()
          }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speakTime])

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
        const transcription = data.transcription || '音声が検出されませんでした'
        setTranscribedText(transcription)
        setSpokenText(transcription)
        setIsLoading(false)
      } else {
        setIsLoading(false)
        processRecording('音声が検出されませんでした')
      }
    } catch (error) {
      setIsLoading(false)
      processRecording('音声が検出されませんでした')
    }
  }

  const processRecording = (transcription: string = transcribedText) => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== 'inactive'
    ) {
      mediaRecorderRef.current.stop()
    }

    setSpokenText(transcription)
    router.push('/result')
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

  return <Timer remainingTime={remainingTime} isRecording={isRecording} />
}
