'use client'

import LevelDisplay from '@/components/LevelDisplay'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useSearchParams } from 'next/navigation'
import ReactMarkdown from 'react-markdown'

type ThemeLevel = 'Low' | 'Middle' | 'High'

export default function EvaluateContent() {
  const searchParams = useSearchParams()

  const theme = searchParams.get('theme') || 'No theme provided.'
  const themeLevel = (searchParams.get('level') || 'Middle') as ThemeLevel
  const thinkingTime = searchParams.get('thinkTime') || '30'
  const speakingTime = searchParams.get('speakTime') || '60'
  const aiEvaluation =
    searchParams.get('evaluation') || 'No evaluation available.'

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
                シンキングタイム: {thinkingTime}秒 | スピーキングタイム:{' '}
                {speakingTime}秒
              </div>
              <LevelDisplay level={themeLevel} />
            </div>
          </div>

          <div>
            <h3 className='text-xl font-semibold text-[#ed9600] mb-2'>
              AI評価
            </h3>
            <div className='overflow-auto max-h-80 text-lg text-gray-700 bg-[#e6ebf0] p-4 rounded-lg border-l-4 border-[#edc700]'>
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className='mb-4'>{children}</p>,
                  ul: ({ children }) => (
                    <ul className='list-disc pl-6 mb-4'>{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className='list-decimal pl-6 mb-4'>{children}</ol>
                  ),
                  li: ({ children }) => <li className='mb-2'>{children}</li>,
                }}
              >
                {aiEvaluation}
              </ReactMarkdown>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
