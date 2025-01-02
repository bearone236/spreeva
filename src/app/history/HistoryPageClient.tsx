'use client'

import LevelDisplay from '@/components/LevelDisplay'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

type HistoryEntry = {
  id: string
  date: string
  theme: string
  level: 'Low' | 'Middle' | 'High'
  speakTime: number
  thinkTime: number
  spokenText: string
  similarityScore: number | null
  diversityScore: number | null
  overallScore: number | null
  aiEvaluation: string
}

const HistoryCard = ({ entry }: { entry: HistoryEntry }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  let evaluationData = null
  try {
    evaluationData = entry.aiEvaluation ? JSON.parse(entry.aiEvaluation) : null
  } catch (error) {
    evaluationData = null
  }

  const {
    grammarAccuracy = 'No data available',
    vocabularyAppropriateness = 'No data available',
    relevanceToTheme = 'No data available',
    improvementSuggestions = 'No data available',
    improvedExpressionExamples = [],
  } = evaluationData || {}

  return (
    <Card className='mb-4 overflow-hidden shadow-lg border rounded-lg'>
      <CardContent className='p-4'>
        <div className='flex justify-between items-start'>
          <div className='w-full'>
            <p className='text-sm text-gray-500'>{entry.date}</p>
            <h3 className='text-lg font-semibold text-[#ed7e00] mt-1'>
              {entry.theme}
            </h3>
          </div>
          <div className='ml-4'>
            <LevelDisplay level={entry.level} />
          </div>
        </div>
        <div className='text-sm text-gray-600'>
          <div className='text-xs text-gray-500 mt-1'>
            シンキングタイム: {entry.thinkTime}秒 | スピーキングタイム:{' '}
            {entry.speakTime}秒
          </div>
          <div className='grid grid-cols-3 gap-4 mt-5'>
            <div className='p-2 bg-gray-50 rounded border'>
              <span className='font-semibold'>類似スコア:</span>{' '}
              {entry.similarityScore !== null
                ? `${(entry.similarityScore * 100).toFixed(1)}`
                : 'N/A'}
            </div>
            <div className='p-2 bg-gray-50 rounded border'>
              <span className='font-semibold'>多様性スコア:</span>{' '}
              {entry.diversityScore !== null
                ? `${(entry.diversityScore * 100).toFixed(1)}`
                : 'N/A'}
            </div>
            <div className='p-2 bg-gray-50 rounded border'>
              <span className='font-semibold'>総合スコア:</span>{' '}
              {entry.overallScore !== null
                ? `${(entry.overallScore * 100).toFixed(1)}`
                : 'N/A'}
            </div>
          </div>
        </div>
        {isExpanded && (
          <div className='mt-4 text-sm text-gray-600 space-y-4'>
            <div className='border p-2 rounded bg-gray-50'>
              <span className='font-semibold'>あなたの文章:</span>
              <p className='mt-2 whitespace-pre-wrap break-words'>
                {entry.spokenText}
              </p>
            </div>
            <div className='space-y-4 pt-6'>
              <div className='border p-2 rounded bg-gray-50'>
                <span className='font-semibold'>文法の正確さ:</span>
                <p className='mt-2 whitespace-pre-wrap break-words'>
                  {grammarAccuracy}
                </p>
              </div>
              <div className='border p-2 rounded bg-gray-50'>
                <span className='font-semibold'>語彙の適切性:</span>
                <p className='mt-2 whitespace-pre-wrap break-words'>
                  {vocabularyAppropriateness}
                </p>
              </div>
              <div className='border p-2 rounded bg-gray-50'>
                <span className='font-semibold'>テーマの関連性:</span>
                <p className='mt-2 whitespace-pre-wrap break-words'>
                  {relevanceToTheme}
                </p>
              </div>
              <div className='border p-2 rounded bg-gray-50'>
                <span className='font-semibold'>改善の提案:</span>
                <p className='mt-2 whitespace-pre-wrap break-words'>
                  {improvementSuggestions}
                </p>
              </div>
              <div className='border p-2 rounded bg-gray-50'>
                <span className='font-semibold'>改善例:</span>
                <ul className='list-disc pl-5 mt-2'>
                  {improvedExpressionExamples.map((example: string) => (
                    <li key={example}>{example}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
        <Button
          variant='ghost'
          size='sm'
          className='mt-2 w-full text-[#ed9600] flex items-center justify-center'
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <>
              <ChevronUp className='w-4 h-4 mr-2' /> Show Less
            </>
          ) : (
            <>
              <ChevronDown className='w-4 h-4 mr-2' /> Show More
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

export default function HistoryPageClient({
  history,
}: { history: HistoryEntry[] }) {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center p-4'>
      <Card className='w-full max-w-4xl bg-white shadow-lg rounded-lg'>
        <CardHeader>
          <CardTitle className='text-2xl font-bold text-[#ed7e00] text-center py-4'>
            スピーキング履歴
          </CardTitle>
        </CardHeader>
        <CardContent>
          {history.map(entry => (
            <HistoryCard key={entry.id} entry={entry} />
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
