import { auth } from '@/app/api/auth/[...nextauth]/auth'
import type { FC, ReactNode } from 'react'

const MemberLayout: FC<{ children: ReactNode }> = async ({ children }) => {
  const session = await auth()

  if (!session || session.userType !== 'member') {
    return <div>Member権限がありません。</div>
  }

  return <>{children}</>
}

export default MemberLayout
