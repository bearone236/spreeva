import { SpeakingEvaluationController } from '@/server/controllers/SpeakingEvaluationController'
import { SpeechController } from '@/server/controllers/SpeechController'
import { ThemeController } from '@/server/controllers/ThemeController'
import { GeminiEvaluationRepository } from '@/server/repository/GeminiEvaluationRepository'
import { GeminiThemeRepository } from '@/server/repository/GeminiThemeRepository'
import { GoogleVisionOCRRepository } from '@/server/repository/GoogleVisionOCRRepository'
import { SpeechRepository } from '@/server/repository/speechRepository'
import { EvaluateSpeakingUseCase } from '@/server/usecase/EvaluateSpeakingUseCase'
import { ThemeUseCase } from '@/server/usecase/ThemeUseCase'
import { PDFThemeGenerationUsecase } from '@/server/usecase/pdfThemeGeneration'
import { RecognizeSpeechUsecase } from '@/server/usecase/recognizeSpeech'
import { PrismaClient } from '@prisma/client'
import { Hono } from 'hono'
import { hc } from 'hono/client'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

const GEMINI_API_URL = process.env.GEMINI_API_URL as string
const GEMINI_API_KEY = process.env.GEMINI_API_KEY as string

const prisma = new PrismaClient()

if (!GEMINI_API_URL || !GEMINI_API_KEY) {
  throw new Error('GEMINI_API_URL or GEMINI_API_KEY is not defined')
}

const themeRepository = new GeminiThemeRepository(
  GEMINI_API_URL,
  GEMINI_API_KEY,
)

const evaluationRepository = new GeminiEvaluationRepository(
  prisma,
  GEMINI_API_URL,
  GEMINI_API_KEY,
)

const generateThemeUseCase = new ThemeUseCase(themeRepository)
const evaluateSpeakingUseCase = new EvaluateSpeakingUseCase(
  evaluationRepository,
)

const googleVisionOCRRepository = new GoogleVisionOCRRepository()
const pdfThemeGenerationUsecase = new PDFThemeGenerationUsecase(
  googleVisionOCRRepository,
)

const app = new Hono().basePath('/api')

const themeController = new ThemeController(
  generateThemeUseCase,
  pdfThemeGenerationUsecase,
)
const evaluationController = new SpeakingEvaluationController(
  evaluateSpeakingUseCase,
)
const speechRepository = new SpeechRepository()
const recognizeSpeechUsecase = new RecognizeSpeechUsecase(speechRepository)
const speechController = new SpeechController(recognizeSpeechUsecase)

app.use('*', cors())
app.use(logger())

app.post('/theme', c => themeController.handleThemeGeneration(c))
app.post('/evaluate', c => evaluationController.handleEvaluation(c))
app.post('/speech', c => speechController.handleRecognizeSpeech(c))
app.post('/upload-pdf', c => themeController.handleThemeGeneration(c))

type AppType = typeof app

if (!process.env.VERCEL_URL) {
  throw new Error('VERCEL_URL is not defined')
}

export const rpcClient = hc<AppType>(process.env.VERCEL_URL)

export default app
