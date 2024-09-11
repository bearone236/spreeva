import serverApp from '@/server/main'
import { handle } from 'hono/vercel'

export const GET = handle(serverApp)
export const POST = handle(serverApp)
export const PUT = handle(serverApp)
export const DELETE = handle(serverApp)
