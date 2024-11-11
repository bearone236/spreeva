import { auth } from '@/app/api/auth/[...nextauth]/auth'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const session = await auth()
  if (!session || session.user?.userType !== 'admin') {
    redirect('/')
  }
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome to the Admin Dashboard!</p>
    </div>
  )
}
