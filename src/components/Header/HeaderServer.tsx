import { auth } from '@/app/api/auth/[...nextauth]/auth'
import Image from 'next/image'
import Link from 'next/link'
import HeaderClient from './HeaderClient'

export default async function HeaderServer() {
  const session = await auth()
  return (
    <header className='bg-[#1a2b3c] py-4 px-6 shadow-md fixed top-0 left-0 w-full z-50'>
      <div className='container mx-auto flex justify-between items-center'>
        <Link href='/'>
          <div className='flex items-center'>
            <Image
              src='/spreeva-icon.png'
              alt='Spreeva'
              width={120}
              height={50}
              style={{ width: '100%', height: 'auto' }}
              priority={true}
            />
            <span className='sr-only'>Spreeva</span>
          </div>
        </Link>
        <HeaderClient session={session} />
      </div>
    </header>
  )
}
