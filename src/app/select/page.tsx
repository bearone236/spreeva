import LoadingAnimation from '@/components/Loading'
import { Suspense } from 'react'
import SelectContent from './SelectContent'

export default function SelectPage() {
  return (
    <Suspense fallback={<LoadingAnimation />}>
      <SelectContent />
    </Suspense>
  )
}
