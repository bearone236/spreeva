import { create } from 'zustand'

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
  retryCount: number
  setTheme: (theme: string) => void
  setThemeType: (themeType: string) => void
  setThinkTime: (time: string) => void
  setSpeakTime: (time: string) => void
  setLevel: (level: Level) => void
  setShowTheme: (show: boolean) => void
  setReadTheme: (read: boolean) => void
  setSpokenText: (text: string) => void
  setEvaluation: (evaluation: string) => void
  incrementRetryCount: () => void
  resetRetryCount: () => void
  resetState: () => void
}

const initialState = {
  theme: '',
  themeType: '',
  thinkTime: '30',
  speakTime: '0',
  level: 'Middle' as Level,
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
  incrementRetryCount: () =>
    set(state => ({ retryCount: state.retryCount + 1 })),
  resetRetryCount: () => set({ retryCount: 0 }),
  resetState: () => set(initialState),
}))

export default useStore