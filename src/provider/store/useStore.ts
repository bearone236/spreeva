import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type Level = 'Low' | 'Middle' | 'High'

interface AppState {
  theme: string
  themeType: string
  thinkTime: string
  speakTime: string
  level: Level
  showTheme: boolean
  readTheme: boolean
  spokenText: string
  evaluation: string
  setTheme: (theme: string) => void
  setThemeType: (themeType: string) => void
  setThinkTime: (time: string) => void
  setSpeakTime: (time: string) => void
  setLevel: (level: Level) => void
  setShowTheme: (show: boolean) => void
  setReadTheme: (read: boolean) => void
  setSpokenText: (text: string) => void
  setEvaluation: (evaluation: string) => void
}

const useStore = create<AppState>()(
  persist(
    set => ({
      theme: '',
      themeType: '',
      thinkTime: '30',
      speakTime: '60',
      level: 'Middle',
      showTheme: true,
      readTheme: false,
      spokenText: '',
      evaluation: '',
      setTheme: theme => set({ theme }),
      setThemeType: themeType => set({ themeType }),
      setThinkTime: time => set({ thinkTime: time }),
      setSpeakTime: time => set({ speakTime: time }),
      setLevel: level => set({ level }),
      setShowTheme: show => set({ showTheme: show }),
      setReadTheme: read => set({ readTheme: read }),
      setSpokenText: text => set({ spokenText: text }),
      setEvaluation: evaluation => set({ evaluation }),
    }),
    {
      name: 'app-state',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)

export default useStore
