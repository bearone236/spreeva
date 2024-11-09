import { Player } from '@lottiefiles/react-lottie-player'
import { Suspense } from 'react'
import SpeakingContent from './SpeakingContent'

export default function SpeakingPage() {
  return (
    <Suspense
      fallback={
        <div className='flex justify-center items-center min-h-screen'>
          <Player
            autoplay
            loop
            src={'/loading.json'}
            style={{ height: '250px', width: '250px' }}
          />
          <p className='mt-32 text-lg text-center font-bold'>読み込み中...</p>
        </div>
      }
    >
      <SpeakingContent />
    </Suspense>
  )
}
