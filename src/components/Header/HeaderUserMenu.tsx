'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LogOut, User, UserCog } from 'lucide-react'
import type { Session } from 'next-auth'
import { signOut } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'
import { Button } from '../ui/button'
import { Skeleton } from '../ui/skeleton'

export default function HeaderUserMenu({
  session,
}: {
  session: Session
}) {
  const userType = session.user.userType
  const renderIcon = () => {
    if (userType === 'admin') return <UserCog className='w-6 mx-auto h-auto ' />
    if (userType === 'member') return <User className='w-6 mx-auto h-auto' />
    return session.user.image ? (
      <Image
        src={session.user.image}
        alt='User Profile'
        width={40}
        height={40}
        className='rounded-full'
        priority
      />
    ) : (
      <AvatarFallback>{session.user.name?.charAt(0)}</AvatarFallback>
    )
  }

  return (
    <div className='ml-4 pl-4 flex items-center'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className='relative h-9 w-9 rounded-full transform hover:scale-105 transition-transform duration-300'>
            <Avatar className='h-9 w-9'>
              <Suspense fallback={<Skeleton className='rounded-full' />}>
                {renderIcon()}
              </Suspense>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56' align='end' forceMount>
          <DropdownMenuLabel>
            <div className='flex flex-col space-y-1'>
              <p className='text-sm font-medium leading-none'>
                {session.user.name}
              </p>
              <p className='text-xs leading-none text-muted-foreground'>
                {session.user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>🚧プロフィール設定🚧</DropdownMenuItem>
          <DropdownMenuItem>🚧アカウント設定🚧</DropdownMenuItem>
          <DropdownMenuItem>
            <Link
              href={process.env.NEXT_PUBLIC_SURVEY_URL || '#'}
              target='_blank'
              rel='noopener noreferrer'
              className='text-orange-500'
            >
              📝 Spreeva改善フォーム 📝
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className='text-red-600'
            onClick={() => signOut({ callbackUrl: '/' })}
          >
            <LogOut className='mr-2 h-4 w-4' />
            ログアウト
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
