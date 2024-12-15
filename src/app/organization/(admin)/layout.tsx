import { auth } from '@/app/api/auth/[...nextauth]/auth'
import { redirect } from 'next/navigation'
import type { FC, ReactNode } from 'react'

const AdminLayout: FC<{ children: ReactNode }> = async ({ children }) => {
  const session = await auth()

  if (
    !session?.user ||
    (session.user as { userType?: string }).userType !== 'admin'
  ) {
    return redirect('/404')
  }

  return <>{children}</>
}

export default AdminLayout
