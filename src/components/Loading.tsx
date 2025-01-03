'use client'

import dynamic from 'next/dynamic'

const Player = dynamic(
  () => import('@lottiefiles/react-lottie-player').then(mod => mod.Player),
  {
    ssr: false,
    loading: () => <div style={{ height: '250px', width: '250px' }} />,
  },
)

export default function LoadingAnimation() {
  return (
    <div className='flex flex-col justify-center items-center min-h-screen'>
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
