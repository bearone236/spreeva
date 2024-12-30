import type { ThemeLevel } from '@/types/theme.types'

interface LevelDisplayProps {
  level: ThemeLevel
}

const LevelDisplay: React.FC<LevelDisplayProps> = ({ level }) => {
  const getLevelColor = (level: ThemeLevel) => {
    switch (level) {
      case 'Low':
        return 'bg-green-600'
      case 'Middle':
        return 'bg-orange-500'
      case 'High':
        return 'bg-red-600'
      default:
        return 'bg-gray-600'
    }
  }

  return (
    <div
      className={`text-center py-0.5 rounded-md text-white w-16 ${getLevelColor(level)}`}
    >
      {level}
    </div>
  )
}

export default LevelDisplay
