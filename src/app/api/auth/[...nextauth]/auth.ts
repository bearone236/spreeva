import prisma from '@/lib/prisma'
import { signInSchema } from '@/lib/zod'
import { PrismaAdapter } from '@auth/prisma-adapter'
import bcrypt from 'bcryptjs'
import NextAuth, { type User, type Session, type Account } from 'next-auth'
import type { JWT } from 'next-auth/jwt'
import CredentialsProvider from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'

const { compare } = bcrypt

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  adapter: PrismaAdapter(prisma) as any,
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
    async signIn({ account, user }: { account: Account | null; user: User }) {
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
      if (session.user) {
        session.user.id = token.sub || ''
        session.user.userType = token.userType as string
      }
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
