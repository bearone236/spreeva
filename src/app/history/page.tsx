'use client'

import LevelDisplay from '@/components/LevelDisplay'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChevronDown, ChevronUp, Star } from 'lucide-react'
import { useState } from 'react'

const mockHistory: HistoryEntry[] = [
  {
    id: 1,
    date: '2024-09-14',
    theme: 'Effective ways to reduce stress',
    level: 'Middle',
    score: 85,
    duration: 60,
  },
  {
    id: 2,
    date: '2024-09-13',
    theme: 'The importance of sustainable living',
    level: 'High',
    score: 92,
    duration: 90,
  },
  {
    id: 3,
    date: '2024-09-12',
    theme: 'Benefits of learning a new language',
    level: 'Low',
    score: 78,
    duration: 45,
  },
  {
    id: 4,
    date: '2024-09-11',
    theme: 'The impact of social media on society',
    level: 'Middle',
    score: 88,
    duration: 60,
  },
  {
    id: 5,
    date: '2024-09-10',
    theme: 'Advantages and disadvantages of remote work',
    level: 'High',
    score: 95,
    duration: 90,
  },
]

type HistoryEntry = {
  id: number
  date: string
  theme: string
  level: 'Low' | 'Middle' | 'High'
  score: number
  duration: number
}

const HistoryCard = ({ entry }: { entry: HistoryEntry }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card className='mb-4 overflow-hidden'>
      <CardContent className='p-4'>
        <div className='flex justify-between items-center'>
          <div>
            <p className='text-sm text-gray-500'>{entry.date}</p>
            <h3 className='text-lg font-semibold text-[#ed7e00] mt-1'>
              {entry.theme}
            </h3>
          </div>
          <div className='flex items-center space-x-2'>
            <LevelDisplay level={entry.level} />
            <div className='flex items-center'>
              <Star className='w-4 h-4 text-yellow-400 mr-1' />
              <span className='font-bold'>{entry.score}</span>
            </div>
          </div>
        </div>
        {isExpanded && (
          <div className='mt-4 text-sm text-gray-600'>
            <p>Duration: {entry.duration} seconds</p>
          </div>
        )}
        <Button
          variant='ghost'
          size='sm'
          className='mt-2 w-full text-[#ed9600]'
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <>
              <ChevronUp className='w-4 h-4 mr-2' /> Show Less
            </>
          ) : (
            <>
              <ChevronDown className='w-4 h-4 mr-2' /> Show More
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

export default function HistoryPage() {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center p-4'>
      <Card className='w-full max-w-3xl bg-white shadow-lg border-t-4 border-[#ed9600]'>
        <CardHeader>
          <CardTitle className='text-2xl font-bold text-[#ed7e00]'>
            スピーキング履歴
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className='h-[600px] pr-4'>
            {mockHistory.map(entry => (
              <HistoryCard key={entry.id} entry={entry} />
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
