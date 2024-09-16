'use client'

import LevelDisplay from '@/components/LevelDisplay'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

export default function EvaluatePage() {
  const evaluationData = {
    theme:
      'What are some effective ways to reduce stress in daily life, and how have you personally dealt with stressful situations?',
    themeLevel: 'Middle',
    thinkingTime: 30,
    speakingTime: 60,
    speechScore: 85,
    userSpeech:
      "In my experience, effective ways to reduce stress include regular exercise, meditation, and maintaining a healthy work-life balance. Personally, I've found that taking short breaks throughout the day and practicing deep breathing exercises helps me manage stressful situations.",
    aiEvaluation:
      'あなたの回答は質問に適切に答えており、一般的なストレス軽減法と個人的な経験の両方を提供しています。良い語彙の使用と文構造を示しています。ただし、具体的な例をさらに詳しく説明したり、文のパターンをより多様化させる余地があります。',
    aiImprovedText:
      "Effective stress reduction techniques in daily life encompass a range of activities, such as engaging in regular physical exercise, practicing mindfulness meditation, and striving for a balanced work-life dynamic. From my personal experience, I've discovered that incorporating short, periodic breaks throughout my workday and employing deep breathing exercises have been instrumental in managing high-stress situations. Additionally, I've found that maintaining a consistent sleep schedule and limiting caffeine intake have contributed significantly to my overall stress management.",
    grammarAccuracy: 90,
    vocabularyRange: 85,
    pronunciationClarity: 80,
    fluency: 85,
    contentRelevance: 90,
  }

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
              {evaluationData.theme}
            </p>
            <div className='mt-2 flex justify-between items-center'>
              <div className=' flex'>
                <p className='text-[#ed9600] my-auto mr-2 font-semibold'>
                  レベル
                </p>
                <LevelDisplay
                  level={evaluationData.themeLevel as 'Low' | 'Middle' | 'High'}
                />
              </div>
              <div className='text-sm text-gray-600'>
                シンキングタイム: {evaluationData.thinkingTime}秒 |
                スピーキングタイム: {evaluationData.speakingTime}秒
              </div>
            </div>
          </div>

          <div>
            <h3 className='text-xl font-semibold text-[#ed9600] mb-2'>
              あなたのスピーチ
            </h3>
            <p className='text-lg text-gray-700 bg-[#e6ebf0] p-4 rounded-lg border-l-4 border-[#edc700]'>
              {evaluationData.userSpeech}
            </p>
          </div>

          <div>
            <h3 className='text-xl font-semibold text-[#ed9600] mb-2'>
              総合スコア
            </h3>
            <div className='flex items-center'>
              <Progress
                value={evaluationData.speechScore}
                className='w-full mr-4'
              />
              <span className='text-2xl font-bold text-[#ed7e00]'>
                {evaluationData.speechScore}/100
              </span>
            </div>
          </div>

          <div>
            <h3 className='text-xl font-semibold text-[#ed9600] mb-2'>
              詳細フィードバック
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {Object.entries({
                文法の正確さ: evaluationData.grammarAccuracy,
                語彙の範囲: evaluationData.vocabularyRange,
                発音の明瞭さ: evaluationData.pronunciationClarity,
                流暢さ: evaluationData.fluency,
                内容の関連性: evaluationData.contentRelevance,
              }).map(([key, value]) => (
                <div key={key} className='flex flex-col'>
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
              AI評価
            </h3>
            <p className='text-lg text-gray-700 bg-[#e6ebf0] p-4 rounded-lg border-l-4 border-[#edc700]'>
              {evaluationData.aiEvaluation}
            </p>
          </div>

          <div>
            <h3 className='text-xl font-semibold text-[#ed9600] mb-2'>
              改善版
            </h3>
            <p className='text-lg text-gray-700 bg-[#e6ebf0] p-4 rounded-lg border-l-4 border-[#edc700]'>
              {evaluationData.aiImprovedText}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
