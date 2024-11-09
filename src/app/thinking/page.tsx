import { Suspense } from 'react'
import ThinkingContent from './ThinkingContent'

export default function ThinkingPage() {
  return (
    <Suspense
      fallback={
        <div className='flex justify-center items-center min-h-screen'>
          <div className='text-2xl font-bold text-[#ed7e00]'>Loading...</div>
        </div>
      }
    >
      <ThinkingContent />
    </Suspense>
  )
}
