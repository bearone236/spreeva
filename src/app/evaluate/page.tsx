'use client'

import LevelDisplay from '@/components/LevelDisplay'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ThemeLevel } from '@/types/theme.types'
import ReactMarkdown from 'react-markdown'
import useStore from '../../provider/store/useStore'

export default function EvaluatePage() {
  const {
    theme,
    level: themeLevel,
    thinkTime,
    speakTime,
    evaluation,
  } = useStore()
  const level: ThemeLevel = themeLevel as ThemeLevel

  return (
    <div className='flex flex-col items-center justify-center p-3'>
      <Card className='w-full max-w-4xl bg-white shadow-lg border-t-4 border-[#ed9600]'>
        <CardHeader className='flex justify-between'>
          <CardTitle className='text-2xl font-bold text-[#ed7e00]'>
            評価結果
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div>
            <h3 className='text-xl font-semibold text-[#ed9600] mb-2'>
              テーマ
            </h3>
            <p className='text-lg text-gray-700 bg-[#e6ebf0] p-4 rounded-lg border-l-4 border-[#edc700]'>
              {theme}
            </p>
            <div className='mt-2 flex justify-between items-center'>
              <div className='text-sm text-gray-600'>
                シンキングタイム: {thinkTime}秒 | スピーキングタイム:{' '}
                {speakTime}秒
              </div>
              <LevelDisplay level={level} />
            </div>
          </div>

          <div>
            <h3 className='text-xl font-semibold text-[#ed9600] mb-2'>
              AI評価
            </h3>
            <div className='overflow-auto max-h-80 text-lg text-gray-700 bg-[#e6ebf0] p-4 rounded-lg border-l-4 border-[#edc700]'>
              <ReactMarkdown>{evaluation}</ReactMarkdown>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
