'use client'

import LevelDisplay from '@/components/LevelDisplay'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { Evaluation, ThemeLevel } from '@/types/theme.types'
import { InfoIcon, Percent, Target, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'
import useStore from '../../provider/store/useStore'

export default function EvaluatePage() {
  const {
    theme,
    level: themeLevel,
    thinkTime,
    speakTime,
    evaluation,
    spokenText,
    fastApiEvaluation,
  } = useStore()
  const [isDataLoaded, setIsDataLoaded] = useState(false)

  useEffect(() => {
    if (theme && spokenText && fastApiEvaluation) {
      setIsDataLoaded(true)
    }
  }, [theme, spokenText, fastApiEvaluation])

  const level: ThemeLevel = themeLevel as ThemeLevel
  const defaultEvaluation: Evaluation = {
    grammarAccuracy: '',
    vocabularyAppropriateness: '',
    relevanceToTheme: '',
    improvementSuggestions: [],
    improvedExpressionExamples: [] as string[],
  }

  const parsedEvaluation: Evaluation = evaluation
    ? JSON.parse(evaluation)
    : defaultEvaluation

  const {
    grammarAccuracy,
    vocabularyAppropriateness,
    relevanceToTheme,
    improvementSuggestions,
    improvedExpressionExamples,
  }: Evaluation = parsedEvaluation

  const suggestions =
    typeof improvementSuggestions === 'string'
      ? [improvementSuggestions]
      : improvementSuggestions

  const {
    similarity_score: similarityScore,
    diversity_score: diversityScore,
    overall_score: overallScore,
  } = fastApiEvaluation || {
    similarity_score: 0,
    diversity_score: 0,
    overall_score: 0,
  }

  const getScoreComment = (score: number): { text: string; color: string } => {
    if (score >= 90) {
      return {
        text: '優秀: 非常に高いレベルのパフォーマンスです',
        color: 'text-green-600',
      }
    }
    if (score >= 70) {
      return {
        text: '良い: 安定したパフォーマンスを示しています',
        color: 'text-blue-600',
      }
    }
    if (score >= 40) {
      return {
        text: '普通: 基準を満たしていますが、改善の余地があります',
        color: 'text-yellow-600',
      }
    }
    if (score < 30) {
      return {
        text: '要改善: さらなる練習が必要です',
        color: 'text-red-600',
      }
    }
    return {
      text: 'スコアが無効です',
      color: 'text-gray-600',
    }
  }

  return (
    <div className='flex flex-col items-center justify-center p-3'>
      <Card className='w-full max-w-4xl bg-white border shadow-lg rounded-lg border-[#ed9600]/20'>
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
            {!isDataLoaded ? (
              <Skeleton className='h-16 w-full bg-gray-200 rounded-lg' />
            ) : (
              <p className='text-lg text-gray-700 bg-gray-100 p-4 rounded-lg border border-gray-100'>
                {theme}
              </p>
            )}
            <div className='mt-2 flex justify-between items-center'>
              <div className='text-sm text-gray-600'>
                {!isDataLoaded ? (
                  <Skeleton className='h-6 w-80 bg-gray-200 rounded-lg' />
                ) : (
                  `シンキングタイム: ${thinkTime}秒 | スピーキングタイム: ${speakTime}秒`
                )}
              </div>
              {!isDataLoaded ? (
                <Skeleton className='h-7 w-16 bg-gray-200 rounded-lg' />
              ) : (
                <LevelDisplay level={level} />
              )}
            </div>
          </div>

          <div>
            <h3 className='text-xl font-semibold text-[#ed9600] mb-2'>
              あなたのスピーチ
            </h3>
            {!isDataLoaded ? (
              <Skeleton className='h-16 w-full bg-gray-200 rounded-lg' />
            ) : (
              <p className='text-lg text-gray-700 bg-gray-100 p-4 rounded-lg border border-gray-100'>
                {spokenText}
              </p>
            )}
          </div>
          <div>
            <h3 className='text-xl font-semibold text-[#ed9600] mb-2'>結果</h3>
            <div className='grid grid-cols-1 gap-4'>
              <TooltipProvider>
                <div className=' text-gray-700 bg-gray-100 p-4 rounded-lg border border-gray-100'>
                  <div className='flex items-center gap-2 mb-3'>
                    <Zap className='mr-2 h-5 w-5' />
                    <h4 className='font-bold text-lg'>総合スコア</h4>
                    <Tooltip>
                      <TooltipTrigger>
                        <InfoIcon className='h-4 w-4 text-gray-400' />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>関連性と多様性を総合的に評価したスコアです</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className='space-y-2'>
                    <div className='flex items-center gap-4'>
                      <div className='flex-1'>
                        <Progress
                          value={overallScore * 100}
                          className='h-2 bg-gray-200 [&>div]:bg-[#1a1f36]'
                        />
                      </div>
                      <div className='text-md font-bold w-20 text-right'>
                        {(overallScore * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div className='flex justify-between items-center'>
                      <p
                        className={`${getScoreComment(overallScore * 100).color}`}
                      >
                        {getScoreComment(overallScore * 100).text}
                      </p>
                      <span className='font-bold text-4xl'>
                        {Math.round(overallScore * 100)}
                        <span className='text-base font-normal text-gray-500'>
                          /100
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className='text-gray-700 bg-gray-100 p-4 rounded-lg border border-gray-100'>
                  <div className='flex items-center gap-2 mb-3'>
                    <Target className='mr-2 h-5 w-5' />
                    <h4 className='font-bold text-lg'>関連性スコア</h4>
                    <Tooltip>
                      <TooltipTrigger>
                        <InfoIcon className='h-4 w-4 text-gray-400' />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>テーマに対する回答の関連性を評価します</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className='space-y-2'>
                    <div className='flex items-center gap-4'>
                      <div className='flex-1'>
                        <Progress
                          value={similarityScore * 100}
                          className='h-2 bg-gray-200 [&>div]:bg-[#1a1f36]'
                        />
                      </div>
                      <div className='text-md font-bold w-20 text-right'>
                        {(similarityScore * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div className='flex justify-between items-center'>
                      <p
                        className={`${getScoreComment(similarityScore * 100).color}`}
                      >
                        {getScoreComment(similarityScore * 100).text}
                      </p>
                      <span className='font-bold text-4xl'>
                        {Math.round(similarityScore * 100)}
                        <span className='text-base font-normal text-gray-500'>
                          /100
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className='text-gray-700 bg-gray-100 p-4 rounded-lg border border-gray-100'>
                  <div className='flex items-center gap-2 mb-3'>
                    <Percent className='mr-2 h-5 w-5' />
                    <h4 className='font-bold text-lg'>多様性スコア</h4>
                    <Tooltip>
                      <TooltipTrigger>
                        <InfoIcon className='h-4 w-4 text-gray-400' />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>使用された語彙の多様性を評価します</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className='space-y-2'>
                    <div className='flex items-center gap-4'>
                      <div className='flex-1'>
                        <Progress
                          value={diversityScore * 100}
                          className='h-2 bg-gray-200 [&>div]:bg-[#1a1f36]'
                        />
                      </div>
                      <div className='text-md font-bold w-20 text-right'>
                        {(diversityScore * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div className='flex justify-between items-center'>
                      <p
                        className={`${getScoreComment(diversityScore * 100).color}`}
                      >
                        {getScoreComment(diversityScore * 100).text}
                      </p>
                      <span className='font-bold text-4xl'>
                        {Math.round(diversityScore * 100)}
                        <span className='text-base font-normal text-gray-500'>
                          /100
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </TooltipProvider>
            </div>
          </div>

          <div>
            <h3 className='text-xl font-semibold text-[#ed9600] mb-2'>
              AI評価
            </h3>
            {!isDataLoaded ? (
              <Skeleton className='h-60 w-full bg-gray-200 rounded-lg' />
            ) : (
              <div className='text-lg text-gray-600 bg-gray-100 p-4 rounded-lg border border-gray-100 px-8 py-8'>
                <h4 className='font-bold mt-4 text-[#ed9600]'>文法の正確さ</h4>
                <p className='text-base'>{grammarAccuracy}</p>
                <h4 className='font-bold mt-12 text-[#ed9600]'>語彙の適切性</h4>
                <p className='text-base'>{vocabularyAppropriateness}</p>
                <h4 className='font-bold mt-12 text-[#ed9600]'>
                  テーマの関連性
                </h4>
                <p className='text-base'>{relevanceToTheme}</p>
                <h4 className='font-bold mt-12 text-[#ed9600]'>改善の提案</h4>
                <ul className='list-disc pl-5'>
                  {suggestions.map(suggestion => (
                    <li key={suggestion} className='text-base'>
                      {suggestion}
                    </li>
                  ))}
                </ul>
                <h4 className='font-bold mt-12 text-[#ed9600]'>改善例</h4>
                <ul className='list-disc pl-5'>
                  {improvedExpressionExamples.map(example => (
                    <li key={example} className='text-base'>
                      {example}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
