'use client'

import { History, Home, LogIn } from 'lucide-react'
import type { Session } from 'next-auth'
import Link from 'next/link'
import { Button } from '../ui/button'
import HeaderUserMenu from './HeaderUserMenu'

export default function HeaderClient({ session }: { session: Session | null }) {
  return (
    <nav className='flex items-center space-x-4'>
      <Button variant='ghost' size='sm' asChild>
        <Link
          href='/'
          className='text-white hover:text-[#1a2b3c] hover:bg-white'
        >
          <Home className='mr-2 h-4 w-4' />
          ホーム
        </Link>
      </Button>
      <Button variant='ghost' size='sm' asChild>
        <Link
          href='/history'
          className='text-white hover:text-[#1a2b3c] hover:bg-white'
        >
          <History className='mr-2 h-4 w-4' />
          履歴
        </Link>
      </Button>
      {session ? (
        <>
          <HeaderUserMenu session={session} />
        </>
      ) : (
        <Button variant='ghost' size='sm' asChild>
          <Link
            href='/login'
            className='text-white hover:text-[#1a2b3c] hover:bg-white'
          >
            <LogIn className='mr-2 h-4 w-4' />
            ログイン
          </Link>
        </Button>
      )}
    </nav>
  )
}
