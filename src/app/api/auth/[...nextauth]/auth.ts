import prisma from '@/lib/prisma'
import type { Adapter } from '@auth/core/adapters'
import { PrismaAdapter } from '@auth/prisma-adapter'
import NextAuth from 'next-auth'
import authConfig from './auth.config'

export const { auth, handlers, signOut } = NextAuth({
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  adapter: PrismaAdapter(prisma) as Adapter,
  secret: process.env.NEXTAUTH_SECRET,

  ...authConfig,
  callbacks: {
    async signIn({ account, user }) {
      if (account?.provider === 'google') {
        return true
      }

      if (user.userType === 'admin') {
        return '/organization/dashboard'
      }

      if (user.userType === 'member') {
        return '/organization'
      }

      return '/login'
    },

    session({ session }) {
      if (!session.user) return session
      const user = {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        emailVerified: session.user.emailVerified,
        image: session.user.image,
        userType: session.user.userType,
      }
      session.user = user
      console.log('session', session)
      return session
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.userType = user.userType
      }
      console.log('jwt', token)
      return token
    },
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
})
