import { Player } from '@lottiefiles/react-lottie-player'
import { Suspense } from 'react'
import SelectContent from './SelectContent'

export default function SelectPage() {
  return (
    <Suspense
      fallback={
        <div className='flex justify-center items-center min-h-screen'>
          <Player
            autoplay
            loop
            src={'/select-loading.json'}
            style={{ height: '80px', width: '80px' }}
          />
        </div>
      }
    >
      <SelectContent />
    </Suspense>
  )
}
