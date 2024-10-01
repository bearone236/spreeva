import { redirect } from 'next/navigation'
import { auth } from '../api/auth/[...nextauth]/auth'
import LoginForm from './LoginForm'

export default async function LoginPage() {
  const session = await auth()

  if (session) {
    redirect('/')
  }

  return <LoginForm />
}
