'use client'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type React from 'react'
import { useEffect, useMemo, useState } from 'react'

type ContributionGraphProps = {
  contributions: { [key: string]: number }
}

const ContributionGraphClient: React.FC<ContributionGraphProps> = ({
  contributions,
}) => {
  const [year, setYear] = useState<number | null>(null)

  useEffect(() => {
    setYear(new Date().getFullYear())
  }, [])

  const contributionData = useMemo(() => {
    if (!year) return {}

    const data: { [key: string]: number } = {}
    const startDate = new Date(year, 0, 1)
    const endDate = new Date(year, 11, 31)

    for (
      let d = new Date(startDate.getTime());
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      const dateString = d.toISOString().split('T')[0]
      data[dateString] = contributions[dateString] || 0 // DBから取得したデータを利用
    }

    return data
  }, [year, contributions])

  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from({ length: 4 }, (_, i) => currentYear - i)

  const startDate = new Date(Date.UTC(year || currentYear, 0, 1))
  const endDate = new Date(Date.UTC(year || currentYear, 11, 31))

  const getColor = (count: number) => {
    if (count === 0) return 'bg-white'
    if (count <= 3) return 'bg-[#ffeeba]'
    if (count <= 6) return 'bg-[#ffd280]'
    if (count <= 9) return 'bg-[#ffb347]'
    return 'bg-[#ff8c00]'
  }

  const totalContributions = Object.values(contributionData).reduce(
    (acc, count) => acc + count,
    0,
  )

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = Number.parseInt(e.target.value, 10)
    setYear(newYear)
  }

  const firstDayOfYear = startDate.getUTCDay()
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const displayDayLabels = ['', 'Mon', '', 'Wed', '', 'Fri', '']

  const weeks: (Date | null)[][] = []
  let currentWeek: (Date | null)[] = Array(firstDayOfYear).fill(null)

  for (
    let date = new Date(Date.UTC(year || currentYear, 0, 1));
    date <= endDate;
    date.setUTCDate(date.getUTCDate() + 1)
  ) {
    currentWeek.push(new Date(date))

    if (currentWeek.length === 7) {
      weeks.push(currentWeek)
      currentWeek = []
    }
  }

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null)
    }
    weeks.push(currentWeek)
  }

  const monthLabels = [
    { name: 'Jan', index: 0 },
    { name: 'Feb', index: 4 },
    { name: 'Mar', index: 9 },
    { name: 'Apr', index: 13 },
    { name: 'May', index: 17 },
    { name: 'Jun', index: 22 },
    { name: 'Jul', index: 26 },
    { name: 'Aug', index: 30 },
    { name: 'Sep', index: 35 },
    { name: 'Oct', index: 39 },
    { name: 'Nov', index: 43 },
    { name: 'Dec', index: 48 },
  ]

  if (!year) {
    return <div>Loading...</div>
  }

  return (
    <>
      <TooltipProvider>
        <div className='bg-white p-6 rounded-lg shadow-md'>
          <h1 className='text-[#e67e22] text-2xl font-bold'>継続グラフ</h1>
          <div className='flex justify-between items-center mb-4 mt-2'>
            <div className='text-left'>
              <h1 className='text-lg font-semibold'>
                {year} Total Lessons: {totalContributions}
              </h1>
            </div>

            <div>
              <select
                value={year}
                onChange={handleYearChange}
                className='border rounded px-2 py-1'
              >
                {yearOptions.map(yearOption => (
                  <option key={yearOption} value={yearOption}>
                    {yearOption}年
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className='overflow-x-auto'>
            <div className='flex'>
              <div className='flex flex-col mr-2 text-xs text-gray-500 mt-7'>
                {displayDayLabels.map(day => (
                  <span key={day} className='h-[16px]'>
                    {day}
                  </span>
                ))}
              </div>
              <div>
                <div className='flex mb-2 text-xs text-gray-500 justify-center'>
                  {weeks.map((_, weekIndex) => {
                    const label = monthLabels.find(
                      month => month.index === weekIndex,
                    )
                    return (
                      <span
                        key={label ? label.name : `empty-${weekIndex}`}
                        className={`w-[15px] mr-[1px] ${
                          label ? 'text-black' : 'text-transparent'
                        }`}
                      >
                        {label ? label.name : ''}
                      </span>
                    )
                  })}
                </div>
                <div className='flex'>
                  {weeks.map((week, weekIndex) => (
                    <div
                      key={`week-${week.map(date => date?.toISOString()).join('-')}`}
                      className='flex flex-col'
                    >
                      {week.map((date: Date | null, dayOfWeek) => {
                        if (!date || date.getUTCFullYear() !== year) {
                          const emptyDateString = `empty-${weekIndex}-${dayOfWeek}`
                          return (
                            <div
                              key={emptyDateString}
                              className='w-[15px] h-[15px] m-[1px]'
                            />
                          )
                        }
                        const dateString = date.toISOString().split('T')[0]
                        const count = contributionData[dateString] || 0
                        return (
                          <Tooltip key={dateString}>
                            <TooltipTrigger>
                              <div
                                className={`w-[15px] h-[15px] m-[1px] ${getColor(count)} border border-gray-200`}
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              <span>
                                {count} {count === 1 ? 'lesson' : 'lessons'} on
                                {dayLabels[dayOfWeek]} {dateString}
                              </span>
                            </TooltipContent>
                          </Tooltip>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className='flex justify-end mt-4 text-xs text-gray-500'>
            <span className='mr-1'>Less</span>
            <div className='w-3 h-3 bg-white border border-gray-200' />
            <div className='w-3 h-3 bg-[#ffeeba]' />
            <div className='w-3 h-3 bg-[#ffd280]' />
            <div className='w-3 h-3 bg-[#ffb347]' />
            <div className='w-3 h-3 bg-[#ff8c00]' />
            <span className='ml-1'>More</span>
          </div>
        </div>
      </TooltipProvider>
    </>
  )
}

export default ContributionGraphClient
