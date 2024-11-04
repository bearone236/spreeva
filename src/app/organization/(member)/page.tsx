import { auth } from '@/app/api/auth/[...nextauth]/auth'
import { redirect } from 'next/navigation'

export default async function MemberPage() {
  const session = await auth()
  if (!session || session.user?.userType !== 'admin') {
    redirect('/')
  }
  return (
    <div>
      <h1>Member Page</h1>
      <p>Welcome to the Member Page!</p>
    </div>
  )
}
