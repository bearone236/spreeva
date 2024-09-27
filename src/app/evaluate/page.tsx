'use client'

import LevelDisplay from '@/components/LevelDisplay'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useSearchParams } from 'next/navigation'
import ReactMarkdown from 'react-markdown'

export default function EvaluatePage() {
  const searchParams = useSearchParams()

  const theme = searchParams.get('theme') || 'No theme provided.'
  const themeLevel = searchParams.get('level') || 'Middle'
  const thinkingTime = searchParams.get('thinkTime') || '30'
  const speakingTime = searchParams.get('speakTime') || '60'
  const aiEvaluation =
    searchParams.get('evaluation') || 'No evaluation available.'
  const speechScore = Number.parseInt(
    searchParams.get('speechScore') || '0',
    10,
  )
  const aiImprovedText =
    searchParams.get('aiImprovedText') || 'No improved text available.'
  const grammarAccuracy = Number.parseInt(
    searchParams.get('grammarAccuracy') || '0',
    10,
  )
  const vocabularyRange = Number.parseInt(
    searchParams.get('vocabularyRange') || '0',
    10,
  )
  const pronunciationClarity = Number.parseInt(
    searchParams.get('pronunciationClarity') || '0',
    10,
  )
  const fluency = Number.parseInt(searchParams.get('fluency') || '0', 10)

  return (
    <div className='min-h-screen flex flex-col items-center justify-center p-4'>
      <Card className='w-full max-w-4xl bg-white shadow-lg border-t-4 border-[#ed9600]'>
        <CardHeader>
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
              <div className='flex'>
                <p className='text-[#ed9600] my-auto mr-2 font-semibold'>
                  レベル
                </p>
                <LevelDisplay level={themeLevel as 'Low' | 'Middle' | 'High'} />
              </div>
              <div className='text-sm text-gray-600'>
                シンキングタイム: {thinkingTime}秒 | スピーキングタイム:{' '}
                {speakingTime}秒
              </div>
            </div>
          </div>

          <div>
            <h3 className='text-xl font-semibold text-[#ed9600] mb-2'>
              AI評価
            </h3>
            <div className='overflow-auto max-h-96 text-lg text-gray-700 bg-[#e6ebf0] p-4 rounded-lg border-l-4 border-[#edc700]'>
              <ReactMarkdown>{aiEvaluation}</ReactMarkdown>
            </div>
          </div>

          <div>
            <h3 className='text-xl font-semibold text-[#ed9600] mb-2'>
              総合スコア
            </h3>
            <div className='flex items-center'>
              <Progress value={speechScore} className='w-full mr-4' />
              <span className='text-2xl font-bold text-[#ed7e00]'>
                {speechScore}/100
              </span>
            </div>
          </div>

          <div>
            <h3 className='text-xl font-semibold text-[#ed9600] mb-2'>
              詳細フィードバック
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {Object.entries({
                文法の正確さ: grammarAccuracy,
                語彙の範囲: vocabularyRange,
                発音の明瞭さ: pronunciationClarity,
                流暢さ: fluency,
              }).map(([key, value]) => (
                <div key={`${key}-${value}`} className='flex flex-col'>
                  <span className='text-sm text-gray-600'>{key}</span>
                  <div className='flex items-center'>
                    <Progress value={value} className='w-full mr-2' />
                    <span className='text-sm font-semibold'>{value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className='text-xl font-semibold text-[#ed9600] mb-2'>
              改善版
            </h3>
            <p className='text-lg text-gray-700 bg-[#e6ebf0] p-4 rounded-lg border-l-4 border-[#edc700]'>
              {aiImprovedText}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
