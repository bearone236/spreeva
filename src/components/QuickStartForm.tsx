'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mic } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const QuickStartForm = () => {
  const [theme, setTheme] = useState('')
  const router = useRouter()

  const handleThemeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/select?theme=${theme || 'random'}`)
  }

  return (
    <>
      <div className='bg-white p-6 rounded-lg shadow-md min-h-[340px] flex flex-col justify-center'>
        <h1 className='text-[#e67e22] text-2xl font-bold'>クイックスタート</h1>
        <div className='flex flex-col space-y-4'>
          <Button
            className='w-full bg-gradient-to-r from-[#f1c40f] to-[#e67e22] text-white hover:from-[#f39c12] hover:to-[#d35400] py-3 rounded-md'
            size='lg'
            onClick={() => router.push('/select?theme=random')}
          >
            <Mic className='mr-2 h-4 w-4' />
            ランダムテーマで始める
          </Button>

          <form onSubmit={handleThemeSubmit}>
            <label
              htmlFor='theme-input'
              className='block text-sm font-semibold text-gray-700 mb-2'
            >
              セレクトテーマ
            </label>
            <div className='flex space-x-2'>
              <Input
                id='theme-input'
                type='text'
                placeholder='テーマを入力'
                value={theme}
                onChange={e => setTheme(e.target.value)}
                className='flex-grow border-[#f39c12] focus:border-[#e67e22] focus:ring-[#e67e22] rounded-md'
              />
              <Button
                type='submit'
                className='bg-gradient-to-r from-[#f1c40f] to-[#e67e22] hover:from-[#f39c12] hover:to-[#d35400] text-white px-6 py-2 rounded-md'
              >
                開始
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default QuickStartForm
