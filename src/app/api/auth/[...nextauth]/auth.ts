import prisma from '@/lib/prisma'
import { signInSchema } from '@/lib/zod'
import type { Adapter } from '@auth/core/adapters'
import { PrismaAdapter } from '@auth/prisma-adapter'
import bcrypt from 'bcryptjs'
import NextAuth, { type NextAuthConfig } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'

const { compare } = bcrypt

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  adapter: PrismaAdapter(prisma) as Adapter,
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      profile(profile: {
        sub: string
        email: string
        name: string
        picture: string
      }) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
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

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            userType: user.userType,
          }
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
    async signIn({ account, user }) {
      if (account?.provider === 'google') {
        return true
      }

      if (user.userType === 'admin' || user.userType === 'member') {
        return true
      }

      return false
    },

    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
        token.userType = user.userType
      }
      return token
    },

    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub || '',
          userType: token.userType || 'user',
        },
      }
    },

    async redirect({ url, baseUrl }) {
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
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)
