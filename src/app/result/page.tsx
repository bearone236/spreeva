import LoadingAnimation from '@/components/Loading'
import { Suspense } from 'react'
import ResultContent from './ResultContent'

export default function ResultPage() {
  return (
    <Suspense fallback={<LoadingAnimation />}>
      <ResultContent />
    </Suspense>
  )
}
