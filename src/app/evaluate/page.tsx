import LoadingAnimation from '@/components/Loading'
import { Suspense } from 'react'
import EvaluateContent from './EvaluateContent'

export default function EvaluatePage() {
  return (
    <Suspense fallback={<LoadingAnimation />}>
      <EvaluateContent />
    </Suspense>
  )
}
