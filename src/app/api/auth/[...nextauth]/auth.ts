import prisma from '@/lib/prisma'
import { signInSchema } from '@/lib/zod'
import { PrismaAdapter } from '@auth/prisma-adapter'
import bcrypt from 'bcryptjs'
import NextAuth, { type User, type Session } from 'next-auth'
import type { JWT } from 'next-auth/jwt'
import CredentialsProvider from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'

const { compare } = bcrypt

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      profile(profile) {
        return {
          id: profile.sub,
          email: profile.email,
          name: profile.name,
          image: profile.picture,
          userType: 'user',
        }
      },
    }),

    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const parsedCredentials = signInSchema.safeParse(credentials)

          if (!parsedCredentials.success) {
            throw new Error('Invalid credentials')
          }

          const { email, password } = parsedCredentials.data

          const user = await prisma.organizationUser.findUnique({
            where: { email: email.toLowerCase() },
          })

          if (!user) {
            throw new Error('No user found')
          }

          const isValid = await compare(password, user.password)
          if (!isValid) {
            throw new Error('Invalid password')
          }

          return user
        } catch (error) {
          if (error instanceof Error) {
            throw new Error(error.message || 'Invalid credentials')
          }
          throw new Error('Invalid credentials')
        }
      },
    }),
  ],

  callbacks: {
    async signIn({
      account,
      user,
    }: { account: Record<string, unknown>; user: User }) {
      if (account?.provider === 'google') {
        return true
      }

      if (user?.userType === 'admin' || user?.userType === 'member') {
        return true
      }

      return false
    },

    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.sub = user.id
        token.userType = user.userType
      }
      return token
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      session.id = token.sub || ''
      session.userType = token.userType as string
      return session
    },

    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      if (url.includes('callback') && url.includes('google')) {
        return baseUrl
      }

      const user = await prisma.organizationUser.findFirst({
        where: { userType: { in: ['admin', 'member'] } },
      })

      const userType = user?.userType

      if (url.includes('credentials')) {
        switch (userType) {
          case 'admin':
            return `${baseUrl}/organization/dashboard`
          case 'member':
            return `${baseUrl}/organization`
          default:
            return baseUrl
        }
      }
      return baseUrl
    },
  },

  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60,
    updateAge: 1 * 60 * 60,
  },
})
