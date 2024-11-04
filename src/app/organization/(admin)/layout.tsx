import { auth } from '@/app/api/auth/[...nextauth]/auth'
import type { FC, ReactNode } from 'react'

const AdminLayout: FC<{ children: ReactNode }> = async ({ children }) => {
  const session = await auth()

  if (!session || session.userType !== 'admin') {
    return <div>アクセス権限がありません。</div>
  }

  return <>{children}</>
}

export default AdminLayout
