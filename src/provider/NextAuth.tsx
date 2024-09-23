import { auth } from '@/app/api/auth/[...nextauth]/auth'
import { SessionProvider } from 'next-auth/react'
import type { ReactNode } from 'react'

const NextAuthProvider = async ({ children }: { children: ReactNode }) => {
  const session = await auth()
  return (
    <>
      <SessionProvider session={session}>{children}</SessionProvider>
    </>
  )
}

export default NextAuthProvider
