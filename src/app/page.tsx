import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  return (
    <main className='p-24'>
      <h2>Hello Kazuya</h2>
      <div className='mt-2'>
        <Button className='mr-3'>
          <Link href={'/select'}>Select</Link>
        </Button>
        <Button className='mr-3'>
          <Link href={'/thinking'}>Thinking</Link>
        </Button>
        <Button>
          <Link href={'/login'}>Login</Link>
        </Button>
      </div>
    </main>
  )
}
