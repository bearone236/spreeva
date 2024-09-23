import type { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    userId: string
    user: {
      id: string
      name: string
      email: string
    } & DefaultSession['user']
  }
}
