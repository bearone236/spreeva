'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { Player } from '@lottiefiles/react-lottie-player'
import { Label } from '@radix-ui/react-label'
import { Clock, Eye, Mic, Volume2 } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function SelectPage() {
  const [thinkingTime, setThinkingTime] = useState('30')
  const [speakingTime, setSpeakingTime] = useState('60')
  const [customThinkingTime, setCustomThinkingTime] = useState('')
  const [customSpeakingTime, setCustomSpeakingTime] = useState('')
  const [themeLevel, setThemeLevel] = useState('Middle')
  const [showTheme, setShowTheme] = useState(true)
  const [readTheme, setReadTheme] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!showTheme && !readTheme) {
      setReadTheme(true)
    }
  }, [showTheme, readTheme])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const theme = searchParams.get('theme') || 'random'

    try {
      const response = await fetch('/api/theme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
        body: JSON.stringify({
          theme,
          themeLevel,
        }),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`)
      }

      const data = await response.json()

      const effectiveThinkTime =
        thinkingTime === 'custom' ? customThinkingTime : thinkingTime
      const effectiveSpeakTime =
        speakingTime === 'custom' ? customSpeakingTime : speakingTime

      const href = `/thinking?theme=${data.message}&thinkTime=${effectiveThinkTime}&speakTime=${effectiveSpeakTime}&level=${themeLevel}&showTheme=${showTheme}&readTheme=${readTheme}`
      router.push(href)
    } catch (error) {
      alert('セッションの開始に失敗しました。もう一度お試しください。')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className='w-full max-w-lg md:max-w-lg lg:max-w-2xl mx-auto my-16 p-6 shadow-lg rounded-lg'>
      <CardHeader>
        <CardTitle className='text-2xl font-bold text-[#333]'>
          クイックスタート設定
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-8'>
          <div className='space-y-2'>
            <Label className='text-md font-semibold text-[#ed7e00] flex items-center'>
              <Clock className='w-5 h-5 mr-2' />
              シンキングタイム
            </Label>
            <RadioGroup
              value={thinkingTime}
              onValueChange={setThinkingTime}
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
            {thinkingTime === 'custom' && (
              <Input
                type='number'
                placeholder='秒数を入力'
                value={customThinkingTime}
                onChange={e => setCustomThinkingTime(e.target.value)}
                className='w-full max-w-[200px]'
              />
            )}
          </div>

          <div className='space-y-2'>
            <Label className='text-md font-semibold text-[#ed7e00] flex items-center'>
              <Volume2 className='w-5 h-5 mr-2' />
              スピーキングタイム
            </Label>
            <RadioGroup
              value={speakingTime}
              onValueChange={setSpeakingTime}
              className='flex flex-wrap gap-4'
            >
              {['30', '60', '90', '120'].map(value => (
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
            {speakingTime === 'custom' && (
              <Input
                type='number'
                placeholder='秒数を入力'
                value={customSpeakingTime}
                onChange={e => setCustomSpeakingTime(e.target.value)}
                className='w-full max-w-[200px]'
              />
            )}
          </div>

          <div className='space-y-2'>
            <Label className='text-md font-semibold text-[#ed7e00]'>
              テーマレベル
            </Label>
            <RadioGroup
              value={themeLevel}
              onValueChange={setThemeLevel}
              className='flex gap-4'
            >
              {['Low', 'Middle', 'High'].map(level => (
                <div key={level} className='flex items-center space-x-2'>
                  <RadioGroupItem value={level} id={`level-${level}`} />
                  <Label htmlFor={`level-${level}`}>{level}</Label>
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
                <Eye className='w-5 h-5 text-[#ed7e00]' />
                <span>テーマの表示</span>
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
                <Mic className='w-5 h-5 text-[#ed7e00]' />
                <span>テーマの読み上げ</span>
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
            disabled={isLoading} // ローディング中はボタンを無効化
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
