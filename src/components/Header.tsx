'use client'

import { User } from 'lucide-react'
import type { Session } from 'next-auth'
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
                width={120}
                height={50}
                style={{
                  width: '100%',
                  height: 'auto',
                }}
                className='mr-2'
                priority={true}
              />
              <span className='sr-only'>Spreeva</span>
            </div>
          </Link>

          <nav className='flex items-center space-x-4'>
            <Button
              variant='ghost'
              className='text-white hover:bg-white hover:bg-opacity-90 transition-colors flex items-center border border-white'
            >
              <Link href={'/'}>ホーム</Link>
            </Button>

            {session ? (
              <>
                <Button
                  variant='ghost'
                  className='text-white hover:bg-white hover:bg-opacity-90 transition-colors flex items-center border border-white'
                >
                  <Link href={'/history'}>履歴</Link>
                </Button>

                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt='User Profile'
                    width={40}
                    height={40}
                    className='rounded-full'
                  />
                ) : (
                  <div className='flex text-white'>
                    <User />
                    <p className='pl-1'>
                      {(session as Session & { userType?: string }).userType ===
                      'admin'
                        ? '管理者'
                        : 'ユーザー'}
                    </p>
                  </div>
                )}

                <Button
                  variant='ghost'
                  className='text-white hover:bg-white hover:bg-opacity-90 transition-colors flex items-center border border-white'
                  onClick={() => signOut({ callbackUrl: '/' })}
                >
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
