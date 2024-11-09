import type { AdapterUser as BaseAdapterUser } from '@auth/core/adapters'
import type { DefaultSession, DefaultUser } from 'next-auth'
import type { JWT as DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session extends DefaultSession {
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

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    userType: string
  }
}

declare module '@auth/core/adapters' {
  interface AdapterUser extends BaseAdapterUser {
    userType: string
  }
}
