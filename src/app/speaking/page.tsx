import LoadingAnimation from '@/components/Loading'
import { Suspense } from 'react'
import SpeakingContent from './SpeakingContent'

export default function SpeakingPage() {
  return (
    <Suspense fallback={<LoadingAnimation />}>
      <SpeakingContent />
    </Suspense>
  )
}
