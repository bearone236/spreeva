import LoadingAnimation from '@/components/Loading'
import { Suspense } from 'react'
import ThinkingContent from './ThinkingContent'

export default function ThinkingPage() {
  return (
    <Suspense fallback={<LoadingAnimation />}>
      <ThinkingContent />
    </Suspense>
  )
}
