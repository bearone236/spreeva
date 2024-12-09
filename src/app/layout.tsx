import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Suspense } from 'react'
import './globals.css'
import HeaderServer from '@/components/Header/HeaderServer'
import LoadingAnimation from '@/components/Loading'
import AuthProvider from '@/provider/AuthProvider'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Spreeva',
  description:
    'Spreeva is a web application to improving enlgish skill for Japanese students.',
  icons: {
    shortcut: '/icon.ico',
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' className={`${inter.variable} font-sans`}>
      <body className={`${inter.className} bg-orange-50`}>
        <AuthProvider>
          <HeaderServer />
          <div className='pt-20 px-8 '>
            <Suspense fallback={<LoadingAnimation />}>{children}</Suspense>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
