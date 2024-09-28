'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { signIn } from 'next-auth/react'
import Image from 'next/image'

export default function LoginForm() {
  return (
    <div className='min-h-screen flex justify-center items-center bg-orange-50'>
      <div className='max-w-md mx-auto p-8 bg-white rounded-lg shadow-md'>
        <div className='flex justify-center'>
          <Image
            src='/spreeva-icon.png'
            alt='Spreeva Icon'
            className='text-4xl font-bold text-center mb-4'
            width={250}
            height={250}
          />
        </div>
        <p className='text-center mb-6'>
          一般ユーザーまたは学校関係者にてログイン
        </p>
        <Tabs defaultValue='user' className='w-full'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='user'>一般ユーザー</TabsTrigger>
            <TabsTrigger value='school'>学校関係者</TabsTrigger>
          </TabsList>
          <TabsContent value='user'>
            <Card>
              <CardHeader>
                <CardTitle>一般ユーザー</CardTitle>
              </CardHeader>
              <CardContent className='text-center'>
                <button
                  onClick={() => signIn('google')}
                  type='button'
                  aria-label='Google Login'
                >
                  <Image
                    src='/google-login-icon.png'
                    alt='Google Login'
                    width={200}
                    height={200}
                  />
                </button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
