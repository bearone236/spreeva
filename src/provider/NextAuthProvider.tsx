import dynamic from 'next/dynamic'
import type { ReactNode } from 'react'
import React from 'react'

const ClientSessionProvider = dynamic(() => import('./ClientSessionProvider'), {
  ssr: false,
})

const NextAuthProvider = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <ClientSessionProvider>{children}</ClientSessionProvider>
    </>
  )
}

export default NextAuthProvider
