'use client'

import LevelDisplay from '@/components/LevelDisplay'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Evaluation, ThemeLevel } from '@/types/theme.types'
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

  const {
    grammarAccuracy,
    vocabularyAppropriateness,
    relevanceToTheme,
    improvementSuggestions,
    improvedExpressionExamples,
  }: Evaluation = JSON.parse(evaluation)

  const suggestions =
    typeof improvementSuggestions === 'string'
      ? [improvementSuggestions]
      : improvementSuggestions

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
            <div className='text-lg text-gray-700 bg-[#e6ebf0] p-4 rounded-lg border-l-4 border-[#edc700]'>
              <h4 className='font-bold'>文法の正確さ</h4>
              <p>{grammarAccuracy}</p>
              <h4 className='font-bold mt-4'>語彙の適切性</h4>
              <p>{vocabularyAppropriateness}</p>
              <h4 className='font-bold mt-4'>テーマの関連性</h4>
              <p>{relevanceToTheme}</p>
              <h4 className='font-bold mt-4'>改善の提案</h4>
              <ul className='list-disc pl-5'>
                {suggestions.map(suggestion => (
                  <li key={suggestion}>{suggestion}</li>
                ))}
              </ul>
              <h4 className='font-bold mt-4'>改善例</h4>
              <ul className='list-disc pl-5'>
                {improvedExpressionExamples.map(example => (
                  <li key={example}>{example}</li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
