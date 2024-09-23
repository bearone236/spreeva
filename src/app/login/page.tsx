'use client'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import { useState } from 'react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleEmailLogin = async () => {
    await signIn('credentials', {
      redirect: true,
      email,
      password,
      callbackUrl: window.location.origin,
    })
  }

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
                <CardDescription>
                  Googleアカウントでログインしてください
                </CardDescription>
              </CardHeader>
              <CardContent className='text-center'>
                <button
                  onClick={() => {
                    signIn('google')
                  }}
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
          <TabsContent value='school'>
            <Card>
              <CardHeader>
                <CardTitle>学校関係者</CardTitle>
                <CardDescription>
                  メールアドレスとパスワードでログインしてください
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-2'>
                <div className='space-y-1'>
                  <Label htmlFor='email'>メールアドレス</Label>
                  <Input
                    id='email'
                    type='email'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
                <div className='space-y-1'>
                  <Label htmlFor='password'>パスワード</Label>
                  <Input
                    id='password'
                    type='password'
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button className='w-full' onClick={handleEmailLogin}>
                  ログイン
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
