type Level = 'Low' | 'Middle' | 'High'

interface LevelDisplayProps {
  level: Level
}

const LevelDisplay: React.FC<LevelDisplayProps> = ({ level }) => {
  const getLevelColor = (level: Level) => {
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
      className={`text-center py-1 rounded-md text-white w-20 ${getLevelColor(level)}`}
    >
      {level}
    </div>
  )
}

export default LevelDisplay
