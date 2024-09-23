import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Flame, Trophy } from 'lucide-react'
import { Progress } from './ui/progress'

interface GamificationCardProps {
  streak: number
  level: number
  points: number
  nextReward: number
}

const GamificationCard: React.FC<GamificationCardProps> = ({
  streak,
  level,
  points,
  nextReward,
}) => (
  <>
    <Card className='bg-white p-4 rounded-md shadow-md min-h-[340px] '>
      <CardHeader>
        <CardTitle className='text-[#ed7e00] text-2xl font-bold'>
          学習の継続
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex justify-between items-center mb-4'>
          <div className='flex items-center'>
            <Flame className='h-6 w-6 text-red-500 mr-2' />
            <span className='text-lg font-semibold'>
              {streak}日連続ストリーク
            </span>
          </div>
          {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
          <button className='border-2 border-[#ed7e00] text-[#ed7e00] px-4 py-2 rounded-md hover:bg-[#edc700] hover:text-white flex items-center transition-colors'>
            <Trophy className='h-4 w-4 mr-2' />
            報酬を受け取る
          </button>
        </div>
        <Progress value={points % 100} className='mb-2' />
        <div className='flex justify-between text-sm text-gray-600'>
          <span>レベル {level}</span>
          <span>{points % 100} / 100 XP</span>
        </div>
        <div className='mt-4 space-y-2'>
          <h4 className='font-semibold text-[#ed9600]'>次のマイルストーン</h4>
          <ul className='space-y-1 text-sm'>
            <li className='flex items-center'>
              <Calendar className='h-4 w-4 text-[#edae00] mr-2' />
              {nextReward}日連続ストリーク達成まであと{nextReward - streak}日
            </li>
            <li className='flex items-center'>
              <Trophy className='h-4 w-4 text-[#edc700] mr-2' />
              レベル{level + 1}まであと{100 - (points % 100)}XP
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  </>
)

export default GamificationCard
