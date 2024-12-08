'use client'

import { User } from 'lucide-react'
import type { Session } from 'next-auth'
import { signOut } from 'next-auth/react'
import Image from 'next/image'
import { Button } from '../ui/button'

export default function HeaderUserMenu({ session }: { session: Session }) {
  return (
    <>
      {session.user.image ? (
        <Image
          src={session.user.image}
          alt='User Profile'
          width={40}
          height={40}
          className='rounded-full'
          priority
        />
      ) : session.user.userType ? (
        <div className='flex items-center text-white'>
          <User />
          <p className='pl-1'>
            {session.user.userType === 'admin' ? '管理者' : 'メンバー'}
          </p>
        </div>
      ) : (
        <div className='text-white'>プロフィール未設定</div>
      )}
      <Button
        variant='ghost'
        className='text-white hover:bg-white hover:bg-opacity-90 transition-colors flex items-center border border-white'
        onClick={() => signOut({ callbackUrl: '/' })}
      >
        ログアウト
      </Button>
    </>
  )
}
