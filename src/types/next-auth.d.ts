import type { type DefaultSession, type DefaultUser } from 'next-auth'
import type { AdapterUser as NextAuthAdapterUser } from 'next-auth/adapters'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      userType: string
    } & DefaultSession['user']
  }

  interface User extends DefaultUser {
    id: string | undefined
    userType: string
  }

  interface Account {
    provider: string
    type: string
    providerAccountId: string
    refresh_token?: string
    access_token?: string
    expires_at?: number
    token_type?: string
    scope?: string
    id_token?: string
    session_state?: string
  }
}

declare module 'next-auth/adapters' {
  interface AdapterUser extends NextAuthAdapterUser {
    userType: string
  }
}
