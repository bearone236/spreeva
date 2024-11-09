import { Suspense } from 'react'
import ResultContent from './ResultContent'

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <div className='flex justify-center items-center min-h-screen'>
          <div className='text-2xl font-bold text-[#ed7e00]'>
            結果を読み込み中...
          </div>
        </div>
      }
    >
      <ResultContent />
    </Suspense>
  )
}
