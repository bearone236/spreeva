import { auth } from '@/app/api/auth/[...nextauth]/auth'
import type { Session } from 'next-auth'
import type { FC, ReactNode } from 'react'

const MemberLayout: FC<{ children: ReactNode }> = async ({ children }) => {
  const session = await auth()

  if (
    !session ||
    (session as Session & { userType?: string }).userType !== 'admin'
  ) {
    return <div>Member権限がありません。</div>
  }

  return <>{children}</>
}

export default MemberLayout
