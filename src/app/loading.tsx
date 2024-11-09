'use client'

import { Player } from '@lottiefiles/react-lottie-player'

export default function Loading() {
  return (
    <div className='flex justify-center items-center min-h-screen'>
      <Player
        autoplay
        loop
        src='/loading.json'
        style={{ height: '250px', width: '250px' }}
      />
      <p className='text-lg font-bold text-[#ed7e00] mt-4'>読み込み中...</p>
    </div>
  )
}
