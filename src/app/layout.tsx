import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import { Suspense } from 'react'
import './globals.css'
import HeaderServer from '@/components/Header/HeaderServer'
import LoadingAnimation from '@/components/Loading'
import AuthProvider from '@/provider/AuthProvider'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'

const font = Nunito({
  subsets: ['latin'],
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
    <html lang='en'>
      <body className={`${font.className} bg-orange-50`}>
        <AuthProvider>
          <HeaderServer />
          <div className='pt-20'>
            <Suspense fallback={<LoadingAnimation />}>{children}</Suspense>
            <Analytics />
            <SpeedInsights />
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
