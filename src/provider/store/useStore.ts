import type { ThemeLevel } from '@/types/theme.types'
import { create } from 'zustand'

interface AppState {
  theme: string
  themeType: string
  thinkTime: string
  speakTime: string
  level: ThemeLevel
  showTheme: boolean
  readTheme: boolean
  spokenText: string
  evaluation: string
  retryCount: number
  setTheme: (theme: string) => void
  setThemeType: (themeType: string) => void
  setThinkTime: (time: string) => void
  setSpeakTime: (time: string) => void
  setLevel: (level: ThemeLevel) => void
  setShowTheme: (show: boolean) => void
  setReadTheme: (read: boolean) => void
  setSpokenText: (text: string) => void
  setEvaluation: (evaluation: string) => void
  setRetryCount: (count: number) => void
}

const initialState = {
  theme: '',
  themeType: '',
  thinkTime: '30',
  speakTime: '30',
  level: 'Middle' as ThemeLevel,
  showTheme: true,
  readTheme: false,
  spokenText: '',
  evaluation: '',
  retryCount: 0,
}

const useStore = create<AppState>(set => ({
  ...initialState,
  setTheme: theme => set({ theme }),
  setThemeType: themeType => set({ themeType }),
  setThinkTime: time => set({ thinkTime: time }),
  setSpeakTime: time => set({ speakTime: time }),
  setLevel: level => set({ level }),
  setShowTheme: show => set({ showTheme: show }),
  setReadTheme: read => set({ readTheme: read }),
  setSpokenText: text => set({ spokenText: text }),
  setEvaluation: evaluation => set({ evaluation }),
  setRetryCount: count => set({ retryCount: count }),
}))

export default useStore
