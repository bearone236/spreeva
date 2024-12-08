import { auth } from '@/app/api/auth/[...nextauth]/auth'
import { redirect } from 'next/navigation'
import type { FC, ReactNode } from 'react'

const AdminLayout: FC<{ children: ReactNode }> = async ({ children }) => {
  const session = await auth()

  console.log('organization/layout.tsx Session', session)

  if (
    !session?.user ||
    (session.user as { userType?: string }).userType !== 'admin'
  ) {
    redirect('/login')
  }

  return <>{children}</>
}

export default AdminLayout
