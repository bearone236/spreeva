import prisma from '@/lib/prisma'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import NextAuth, { type User, type Session } from 'next-auth'
import type { JWT } from 'next-auth/jwt'
import Google from 'next-auth/providers/google'

export const { handlers, auth, signIn } = NextAuth({
  pages: {
    signIn: '/login',
  },
  adapter: PrismaAdapter(prisma),
  secret: process.env.AUTH_SECRET,

  providers: [
    Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ account }) {
      if (account?.provider === 'google') {
        return true
      }
      return false
    },
    async redirect({ baseUrl }) {
      return baseUrl
    },
    async session({
      session,
      token,
    }: { session: Session & { id?: string }; token: JWT; user: User }) {
      session.id = token.sub
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
      }
      return token
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
})