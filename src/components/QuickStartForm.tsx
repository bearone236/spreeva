'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mic } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import useStore from '../provider/store/useStore'

const QuickStartForm = () => {
  const [theme, setThemeInput] = useState('')
  const router = useRouter()
  const { setTheme, setThemeType } = useStore()

  const handleThemeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setTheme(theme || 'random')
    setThemeType('quickstart')
    router.push('/select')
  }

  return (
    <div className='bg-white p-6 rounded-lg shadow-md min-h-[280px] flex flex-col justify-center'>
      <label
        htmlFor='theme-input'
        className='block text-lg font-bold text-[#e67e22] mb-2'
      >
        クイックスタート
      </label>
      <div className='flex flex-col space-y-4'>
        <Button
          className='w-full bg-gradient-to-r from-[#f1c40f] to-[#e67e22] text-white hover:from-[#f39c12] hover:to-[#d35400] py-3 rounded-md'
          size='lg'
          onClick={() => {
            setTheme('random')
            setThemeType('quickstart')
            router.push('/select')
          }}
        >
          <Mic className='mr-2 h-4 w-4' />
          ランダムテーマで始める
        </Button>

        <form onSubmit={handleThemeSubmit} className='pt-5'>
          <label
            htmlFor='theme-input'
            className='block text-lg font-bold text-[#e67e22] mb-2'
          >
            セレクトテーマ
          </label>
          <div className='flex space-x-2'>
            <Input
              id='theme-input'
              type='text'
              placeholder='好きなテーマを入力 (AI, 動物, スポーツ など)'
              value={theme}
              onChange={e => setThemeInput(e.target.value)}
              className='flex-grow border-[#f39c12] focus:border-[#e67e22] focus:ring-[#e67e22] rounded-md'
            />
            <Button
              type='submit'
              disabled={!theme.trim()}
              className={`px-6 py-2 rounded-md text-white ${
                theme.trim()
                  ? 'bg-gradient-to-r from-[#f1c40f] to-[#e67e22] hover:from-[#f39c12] hover:to-[#d35400]'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              開始
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default QuickStartForm
