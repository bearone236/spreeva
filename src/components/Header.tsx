'use client'

import { History, Home, LogOut, User } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { Button } from './ui/button'

export default function Header() {
  const pathname = usePathname()
  const { data: session } = useSession()

  if (pathname === '/login') {
    return null
  }

  return (
    <>
      <header className='bg-[#1a2b3c] py-4 px-6 shadow-md fixed top-0 left-0 w-full z-50'>
        <div className='container mx-auto flex justify-between items-center'>
          <Link href={'/'}>
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
          </Link>

          <nav className='flex items-center space-x-4'>
            <Button
              variant='ghost'
              className='text-white hover:bg-white hover:bg-opacity-90 transition-colors flex items-center'
            >
              <Home className='h-5 w-5 mr-2' />
              <Link href={'/'}>ホーム</Link>
            </Button>

            {session ? (
              <>
                <Button
                  variant='ghost'
                  className='text-white hover:bg-white hover:bg-opacity-90 transition-colors flex items-center'
                >
                  <History className='h-5 w-5 mr-2' />
                  <Link href={'/history'}>履歴</Link>
                </Button>

                {/* <Button
                  variant='ghost'
                  size='icon'
                  className='text-white hover:bg-white hover:bg-opacity-90 transition-colors flex items-center'
                >
                  <User className='h-5 w-5' />
                  <span className='sr-only'>ユーザープロフィール</span>
                </Button> */}

                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt='User Profile'
                    width={40}
                    height={40}
                    className='rounded-full'
                  />
                ) : (
                  <User className='h-5 w-5 text-white' />
                )}

                <Button
                  variant='ghost'
                  className='text-white hover:bg-white hover:bg-opacity-90 transition-colors flex items-center'
                  onClick={() => signOut({ callbackUrl: '/' })}
                >
                  <LogOut className='h-5 w-5 mr-2' />
                  ログアウト
                </Button>
              </>
            ) : (
              <Button
                variant='ghost'
                className='text-white hover:bg-white hover:bg-opacity-90 transition-colors'
              >
                <Link href={'/login'}>ログイン</Link>
              </Button>
            )}
          </nav>
        </div>
      </header>

      <div className='h-16' />
    </>
  )
}
