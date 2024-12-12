/* eslint-disable @typescript-eslint/no-explicit-any */
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
        return true
      }

      if (user.userType === 'member') {
        return true
      }

      return true
    },

    redirect: async ({ baseUrl }) => {
      return baseUrl
    },

    session({ session, token }) {
      if (!token) return session
      const user = {
        id: token.id as string,
        name: token.name,
        email: token.email || '',
        emailVerified:
          token.emailVerified && typeof token.emailVerified === 'string'
            ? new Date(token.emailVerified)
            : null,
        image: token.picture || null,
        userType: token.userType,
      }
      session.user = user
      return session
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.userType = user.userType
      }
      return token
    },
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
})
