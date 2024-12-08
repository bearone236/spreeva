'use client'

import type { Session } from 'next-auth'
import { Button } from '../ui/button'
import HeaderUserMenu from './HeaderUserMenu'

export default function HeaderClient({ session }: { session: Session | null }) {
  return (
    <nav className='flex items-center space-x-4'>
      <Button
        variant='ghost'
        className='text-white hover:bg-white hover:bg-opacity-90 transition-colors flex items-center border border-white'
      >
        <a href='/'>ホーム</a>
      </Button>
      {session ? (
        <HeaderUserMenu session={session} />
      ) : (
        <Button
          variant='ghost'
          className='text-white hover:bg-white hover:bg-opacity-90 transition-colors flex items-center border border-white'
        >
          <a href='/login'>ログイン</a>
        </Button>
      )}
    </nav>
  )
}
