'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { signIn, useSession } from 'next-auth/react'

import Image from 'next/image'
import { useState } from 'react'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { data: session } = useSession()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.ok === true) {
      if (session?.user.userType === 'admin') {
        window.location.href = '/organization/dashboard'
      }
      if (session?.user.userType === 'member') {
        window.location.href = '/organization'
      }
    }
  }

  return (
    <div className='pt-20 flex justify-center items-center bg-orange-50 '>
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
                  onClick={() => signIn('google', { callbackUrl: '/' })}
                  type='button'
                  aria-label='Google Login'
                >
                  <Image
                    src='/google-login-icon.png'
                    alt='Google Login'
                    width={150}
                    height={150}
                    style={{
                      width: '100%',
                      height: 'auto',
                    }}
                  />
                </button>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value='school'>
            <Card>
              <CardHeader>
                <CardTitle>学校関係者</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className='space-y-4'>
                  <div>
                    <label htmlFor='email' className='block mb-2'>
                      メールアドレス
                    </label>
                    <input
                      type='email'
                      id='email'
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      className='w-full p-2 border rounded-md'
                    />
                  </div>
                  <div>
                    <label htmlFor='password' className='block mb-2'>
                      パスワード
                    </label>
                    <input
                      type='password'
                      id='password'
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      className='w-full p-2 border rounded-md'
                    />
                  </div>
                  <Button
                    type='submit'
                    className='w-full bg-orange-400 text-white p-2 rounded-md'
                  >
                    ログイン
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
