import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import NextAuthProvider from '@/provider/NextAuth'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Spreeva',
  description:
    'Spreeva is a web application to improving enlgish skill for Japanese students.',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={`${inter.className} bg-orange-50`}>
        <Header />
        <div className='pt-8 px-8'>
          <NextAuthProvider>{children}</NextAuthProvider>
        </div>
      </body>
    </html>
  )
}
