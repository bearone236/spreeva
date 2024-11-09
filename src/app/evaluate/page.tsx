import { Suspense } from 'react'
import EvaluateContent from './EvaluateContent'

export default function EvaluatePage() {
  return (
    <Suspense
      fallback={
        <div className='flex justify-center items-center min-h-screen'>
          <div className='text-2xl font-bold text-[#ed7e00]'>
            評価結果を読み込み中...
          </div>
        </div>
      }
    >
      <EvaluateContent />
    </Suspense>
  )
}
