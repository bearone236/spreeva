import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  return (
    <main>
      <h2>Hello, Kazuya</h2>
      <div className='mt-2'>
        <Button className='mr-3'>
          <Link href={'/login'}>Login</Link>
        </Button>
        <Button className='mr-3'>
          <Link href={'/select'}>Select</Link>
        </Button>
        <Button className='mr-3'>
          <Link href={'/thinking'}>Thinking</Link>
        </Button>
        <Button className='mr-3'>
          <Link href={'/speaking'}>Speaking</Link>
        </Button>
        <Button className='mr-3'>
          <Link href={'/result'}>Result</Link>
        </Button>
        <Button className='mr-3'>
          <Link href={'/evaluate'}>Evaluate</Link>
        </Button>
        <Button className='mr-3'>
          <Link href={'/history'}>History</Link>
        </Button>
      </div>
    </main>
  )
}
