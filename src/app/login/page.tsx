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
import Image from 'next/image'

export default function Login() {
  return (
    <div className='min-h-screen flex justify-center items-center bg-gray-100'>
      <div className='max-w-md mx-auto p-8 bg-white rounded-lg shadow-md'>
        <h1 className='text-4xl font-bold text-center mb-4'>Spreeva</h1>
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
              <CardContent>
                <a href='/auth/google' className='block'>
                  <Image
                    src='/google-login-icon.png'
                    alt='Google Login'
                    className='mx-auto'
                    width={200}
                    height={200}
                  />
                </a>
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
                  <Input id='email' type='email' />
                </div>
                <div className='space-y-1'>
                  <Label htmlFor='password'>パスワード</Label>
                  <Input id='password' type='password' />
                </div>
              </CardContent>
              <CardFooter>
                <Button className='w-full'>ログイン</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
