import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import AuthProvider from '@/provider/AuthProvider'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
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
      <body className={`${inter.className} bg-orange-50`}>
        <AuthProvider>
          <Header />
          <div className='pt-8 px-8'>{children}</div>
        </AuthProvider>
      </body>
    </html>
  )
}
