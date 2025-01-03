import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function SkeletonHistoryCard() {
  return (
    <Card className='mb-4 overflow-hidden shadow-lg border rounded-lg'>
      <CardContent className='p-4'>
        <div className='flex justify-between items-start'>
          <div className='w-full'>
            <Skeleton className='h-4 w-1/4 mb-2' />
            <Skeleton className='h-6 w-3/4' />
          </div>
          <Skeleton className='h-8 w-16 ml-4 rounded' />
        </div>
        <div className='text-sm text-gray-600 mt-4'>
          <Skeleton className='h-4 w-1/3 mb-2' />
          <div className='grid lg:grid-cols-3 gap-4 mt-5 xs:grid-cols-1'>
            <Skeleton className='h-12 w-full rounded border' />
            <Skeleton className='h-12 w-full rounded border' />
            <Skeleton className='h-12 w-full rounded border' />
          </div>
        </div>
        <div className='flex justify-center mt-4'>
          <Skeleton className='h-4 w-1/4' />
        </div>
      </CardContent>
    </Card>
  )
}
