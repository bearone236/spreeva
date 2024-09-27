import { Hono } from 'hono'
import { hc } from 'hono/client'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { EvaluationController } from './controllers/evaluationController'
import { ThemeController } from './controllers/themeController'

const app = new Hono().basePath('/api')
const themeController = new ThemeController()
const evaluationController = new EvaluationController()

// CORS設定
app.use('*', cors())
app.use(logger())

app.post('/theme', c => themeController.handleGenerateTheme(c))
app.post('/evaluate', c => evaluationController.handleEvaluateSpeech(c))

type AppType = typeof app

if (!process.env.VERCEL_URL) {
  throw new Error('VERCEL_URL is not defined')
}

export const rpcClient = hc<AppType>(process.env.VERCEL_URL)

export default app
