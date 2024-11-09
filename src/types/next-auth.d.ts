import type { DefaultSession, DefaultUser } from 'next-auth'
import type { AdapterUser as NextAuthAdapterUser } from 'next-auth/adapters'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      userType: string
    } & DefaultSession['user']
  }

  interface User extends DefaultUser {
    id: string
    userType: string
  }
}

declare module 'next-auth/adapters' {
  interface AdapterUser extends NextAuthAdapterUser {
    userType: string
  }
}
