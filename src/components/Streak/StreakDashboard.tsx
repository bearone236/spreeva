'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Calendar, Flame, Trophy } from 'lucide-react'

interface StreakDashboardProps {
  currentStreak: number
  longestStreak: number
  totalSessions: number
  activeDays: number
}

export default function StreakDashboard({
  currentStreak,
  longestStreak,
  totalSessions,
  activeDays,
}: StreakDashboardProps) {
  return (
    <div className='bg-white p-3 rounded-lg shadow-md w-full'>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 auto-rows-fr'>
        <Card className='relative'>
          <CardHeader className='space-y-0 pb-4'>
            <CardTitle className='text-base font-medium text-muted-foreground'>
              現在のストリーク
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <div className='flex items-start space-x-4'>
              <div className='p-2 bg-orange-100 rounded-lg'>
                <Flame className='h-5 w-5 text-orange-500' />
              </div>
              <div className='space-y-1'>
                <div className='flex items-baseline space-x-1'>
                  <span className='text-3xl font-bold tracking-tight'>
                    {currentStreak}
                  </span>
                  <span className='text-sm font-medium text-muted-foreground'>
                    日
                  </span>
                </div>
                <p className='text-xs text-muted-foreground'>
                  最長記録まで残り{longestStreak - currentStreak}日
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='space-y-0 pb-4'>
            <CardTitle className='text-base font-medium text-muted-foreground'>
              最長ストリーク
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex items-start space-x-4'>
              <div className='p-2 bg-yellow-100 rounded-lg'>
                <Trophy className='h-5 w-5 text-yellow-500' />
              </div>
              <div className='flex items-baseline space-x-1'>
                <span className='text-3xl font-bold tracking-tight'>
                  {longestStreak}
                </span>
                <span className='text-sm font-medium text-muted-foreground'>
                  日
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='space-y-0 pb-4'>
            <CardTitle className='text-base font-medium text-muted-foreground'>
              累計セッション数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex items-start space-x-4'>
              <div className='p-2 bg-blue-100 rounded-lg'>
                <BarChart className='h-5 w-5 text-blue-500' />
              </div>
              <div className='flex items-baseline space-x-1'>
                <span className='text-3xl font-bold tracking-tight'>
                  {totalSessions}
                </span>
                <span className='text-sm font-medium text-muted-foreground'>
                  回
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='space-y-0 pb-4'>
            <CardTitle className='text-base font-medium text-muted-foreground'>
              直近1週間のアクティブ日数
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <div className='flex items-start space-x-4'>
              <div className='p-2 bg-green-100 rounded-lg'>
                <Calendar className='h-5 w-5 text-green-500' />
              </div>
              <div className='space-y-1'>
                <div className='flex items-baseline space-x-1'>
                  <span className='text-3xl font-bold tracking-tight'>
                    {activeDays}
                  </span>
                  <span className='text-sm font-medium text-muted-foreground'>
                    日
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
