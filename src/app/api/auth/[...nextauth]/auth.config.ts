import { signInSchema } from '@/lib/zod'
import bcrypt from 'bcryptjs'
import type { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'

export default {
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
    Credentials({
      async authorize(credentials: Record<string, unknown>) {
        if (!credentials) return null

        const { email, password } = credentials as {
          email: string
          password: string
        }
        const validatedFields = signInSchema.safeParse({
          email,
          password,
        })

        if (validatedFields.success) {
          const { email, password } = validatedFields.data

          const user = await prisma?.organizationUser.findUnique({
            where: { email: email },
            include: { organization: true },
          })
          if (!user || !user.password) return null

          const passwordsMatch = await bcrypt.compare(password, user.password)

          if (passwordsMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              organization: user.organization,
              userType: user.userType,
            }
          }
        }
        return null
      },
    }),
  ],
} satisfies NextAuthConfig
