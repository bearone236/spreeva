import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <h2>Hello Kazuya</h2>
      <Button>
        <Link href={'/select'}>Select</Link>
      </Button>
      <Button>
        <Link href={'/login'}>Login</Link>
      </Button>
    </main>
  )
}
