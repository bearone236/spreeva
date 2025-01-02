'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Label } from '@radix-ui/react-label'
import { Clock, Eye, Info, Mic, Volume2 } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import useStore from '../../provider/store/useStore'

const Player = dynamic(
  () => import('@lottiefiles/react-lottie-player').then(mod => mod.Player),
  { ssr: false },
)

export default function SelectPage() {
  const {
    theme,
    themeType,
    thinkTime,
    speakTime,
    level,
    showTheme,
    readTheme,
    setTheme,
    setThinkTime,
    setSpeakTime,
    setLevel,
    setShowTheme,
    setReadTheme,
  } = useStore()

  const [customThinkingTime, setCustomThinkingTime] = useState('')
  const [customSpeakingTime, setCustomSpeakingTime] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [thinkingError, setThinkingError] = useState('')
  const [speakingError, setSpeakingError] = useState('')
  const router = useRouter()

  const levelDescriptions = {
    Low: '英語学習初心者レベル',
    Middle: '日常会話が可能で、ある程度の英語力を持つレベル',
    High: 'ビジネスや学術的な場面で英語を使用するレベル',
  }

  useEffect(() => {
    if (!showTheme && !readTheme) {
      setReadTheme(true)
    }
  }, [showTheme, readTheme, setReadTheme])

  const handleThemeDisplayChange = (checked: boolean) => {
    if (!checked && !readTheme) {
      setReadTheme(true)
    }
    setShowTheme(checked)
  }

  const handleReadThemeChange = (checked: boolean) => {
    if (!checked && !showTheme) {
      setShowTheme(true)
    }
    setReadTheme(checked)
  }

  const validateCustomTimes = () => {
    let isValid = true

    if (thinkTime === 'custom') {
      const value = Number.parseInt(customThinkingTime, 10)
      if (value < 1 || value > 180 || Number.isNaN(value)) {
        setThinkingError('1秒以上180秒以下の値を入力してください。')
        isValid = false
      } else {
        setThinkingError('')
      }
    }

    if (speakTime === 'custom') {
      const value = Number.parseInt(customSpeakingTime, 10)
      if (value < 1 || value > 180 || Number.isNaN(value)) {
        setSpeakingError('1秒以上180秒以下の値を入力してください。')
        isValid = false
      } else {
        setSpeakingError('')
      }
    }

    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateCustomTimes()) {
      return
    }
    setIsLoading(true)

    try {
      const response = await fetch('/api/theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme, themeLevel: level, themeType }),
      })

      if (!response.ok) throw new Error(`Error: ${response.statusText}`)
      const data = await response.json()
      setTheme(data.message)

      const effectiveThinkTime =
        thinkTime === 'custom' ? customThinkingTime : thinkTime
      const effectiveSpeakTime =
        speakTime === 'custom' ? customSpeakingTime : speakTime

      setThinkTime(effectiveThinkTime)
      setSpeakTime(effectiveSpeakTime)
      await router.push('/thinking')
    } catch (error) {
      alert('セッションの開始に失敗しました。もう一度お試しください。')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className='w-full max-w-lg md:max-w-lg lg:max-w-2xl mx-auto mt-8 p-6 shadow-lg rounded-lg'>
      <CardHeader>
        <CardTitle className='text-2xl font-bold text-[#333]'>
          クイックスタート設定
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-8'>
          <div className='space-y-2'>
            <Label className='text-md font-semibold text-[#ed7e00] flex items-center'>
              <Clock className='w-5 h-5 mr-2' /> シンキングタイム
            </Label>
            <RadioGroup
              value={thinkTime}
              onValueChange={setThinkTime}
              className='flex flex-wrap gap-4'
            >
              {['15', '30', '45', '60'].map(value => (
                <div key={value} className='flex items-center space-x-2'>
                  <RadioGroupItem value={value} id={`thinking-${value}`} />
                  <Label htmlFor={`thinking-${value}`}>{value}秒</Label>
                </div>
              ))}
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value='custom' id='thinking-custom' />
                <Label htmlFor='thinking-custom'>カスタム</Label>
              </div>
            </RadioGroup>
            {thinkTime === 'custom' && (
              <>
                <Input
                  type='number'
                  placeholder='秒数を入力'
                  value={customThinkingTime}
                  onChange={e => setCustomThinkingTime(e.target.value)}
                  className='w-full max-w-[150px]'
                />
                {thinkingError && (
                  <p className='text-red-500 text-sm mt-1'>{thinkingError}</p>
                )}
              </>
            )}
          </div>

          <div className='space-y-2'>
            <Label className='text-md font-semibold text-[#ed7e00] flex items-center'>
              <Volume2 className='w-5 h-5 mr-2' /> スピーキングタイム
            </Label>
            <RadioGroup
              value={speakTime}
              onValueChange={setSpeakTime}
              className='flex flex-wrap gap-4'
            >
              {['15', '30', '45', '60'].map(value => (
                <div key={value} className='flex items-center space-x-2'>
                  <RadioGroupItem value={value} id={`speaking-${value}`} />
                  <Label htmlFor={`speaking-${value}`}>{value}秒</Label>
                </div>
              ))}
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value='custom' id='speaking-custom' />
                <Label htmlFor='speaking-custom'>カスタム</Label>
              </div>
            </RadioGroup>
            {speakTime === 'custom' && (
              <>
                <Input
                  type='number'
                  placeholder='秒数を入力'
                  value={customSpeakingTime}
                  onChange={e => setCustomSpeakingTime(e.target.value)}
                  className='w-full max-w-[150px]'
                />
                {speakingError && (
                  <p className='text-red-500 text-sm mt-1'>{speakingError}</p>
                )}
              </>
            )}
          </div>

          <div className='space-y-2'>
            <Label className='text-md font-semibold text-[#ed7e00] flex items-center'>
              テーマレベル
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className='ml-4 text-orange-600 cursor-pointer'>
                      <Info className='w-4 h-4' />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent
                    side='right'
                    align='start'
                    sideOffset={10}
                    collisionPadding={8}
                  >
                    <p>
                      <strong>Low:</strong> {levelDescriptions.Low}
                    </p>
                    <p>
                      <strong>Middle:</strong> {levelDescriptions.Middle}
                    </p>
                    <p>
                      <strong>High:</strong> {levelDescriptions.High}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <RadioGroup
              value={level}
              onValueChange={setLevel}
              className='flex gap-4'
            >
              {['Low', 'Middle', 'High'].map(lvl => (
                <div key={lvl} className='flex items-center space-x-2'>
                  <RadioGroupItem value={lvl} id={`level-${lvl}`} />
                  <Label htmlFor={`level-${lvl}`}>{lvl}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className='space-y-2'>
            <Label className='text-md font-semibold text-[#ed7e00]'>設定</Label>
            <div className='flex items-center justify-between'>
              <Label
                htmlFor='show-theme'
                className='flex items-center space-x-2'
              >
                <Eye className='w-5 h-5 text-[#ed7e00]' /> テーマの表示
              </Label>
              <Switch
                id='show-theme'
                checked={showTheme}
                onCheckedChange={handleThemeDisplayChange}
              />
            </div>
            <div className='flex items-center justify-between'>
              <Label
                htmlFor='read-theme'
                className='flex items-center space-x-2'
              >
                <Mic className='w-5 h-5 text-[#ed7e00]' /> テーマの読み上げ
              </Label>
              <Switch
                id='read-theme'
                checked={readTheme}
                onCheckedChange={handleReadThemeChange}
              />
            </div>
          </div>

          <Button
            type='submit'
            disabled={isLoading}
            className='w-full bg-[#ed7e00] hover:bg-[#f18e1b] text-white py-2 rounded-md flex justify-center items-center'
          >
            {isLoading ? (
              <>
                <Player
                  autoplay
                  loop
                  src={'/select-loading.json'}
                  style={{ height: '40px', width: '40px' }}
                />
                <span className='ml-2'>読み込み中</span>
              </>
            ) : (
              'セッションを開始'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
