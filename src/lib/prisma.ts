/* eslint-disable no-var */
import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}

// biome-ignore lint/suspicious/noRedeclare: <explanation>
let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  })
} else {
  if (!globalThis.prisma) {
    globalThis.prisma = new PrismaClient()
  }

  prisma = globalThis.prisma
}

export default prisma
