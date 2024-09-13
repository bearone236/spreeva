import { History, Home, User } from 'lucide-react'
import Image from 'next/image'
import { Button } from './ui/button'

export default function Header() {
  return (
    <>
      <header className='bg-[#1a2b3c] py-4 px-6 shadow-md fixed top-0 left-0 w-full z-50'>
        <div className='container mx-auto flex justify-between items-center'>
          <div className='flex items-center'>
            <Image
              src='/spreeva-icon.png'
              alt='Spreeva'
              width={130}
              height={50}
              className='mr-2'
            />
            <span className='sr-only'>Spreeva</span>
          </div>

          <nav className='flex items-center space-x-4'>
            <Button
              variant='ghost'
              className='text-white hover:bg-white hover:bg-opacity-10 transition-colors flex items-center'
            >
              <Home className='h-5 w-5 mr-2' />
              <span>ホーム</span>
            </Button>

            <Button
              variant='ghost'
              className='text-white hover:bg-white hover:bg-opacity-10 transition-colors flex items-center'
            >
              <History className='h-5 w-5 mr-2' />
              <span>履歴</span>
            </Button>

            <Button
              variant='ghost'
              size='icon'
              className='text-white hover:bg-white hover:bg-opacity-10 transition-colors flex items-center'
            >
              <User className='h-5 w-5' />
              <span className='sr-only'>ユーザープロフィール</span>
            </Button>
          </nav>
        </div>
      </header>

      <div className='h-16' />
    </>
  )
}
