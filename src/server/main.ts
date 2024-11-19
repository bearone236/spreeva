import { PrismaClient } from '@prisma/client'
import { GeminiThemeRepository } from './repository/GeminiThemeRepository'
import { GeminiEvaluationRepository } from './repository/GeminiEvaluationRepository'
import { ThemeUseCase } from './usecase/ThemeUseCase'
import { EvaluateSpeakingUseCase } from './usecase/EvaluateSpeakingUseCase'
import { GoogleVisionOcrRepository } from '@/server/repository/GoogleVisionOcrRepository'
import { PDFThemeGenerationUsecase } from './usecase/pdfThemeGeneration'
import { Hono } from 'hono'
import { ThemeController } from './controllers/ThemeController'
import { SpeakingEvaluationController } from './controllers/SpeakingEvaluationController'
import { SpeechRepository } from './repository/speechRepository'
import { RecognizeSpeechUsecase } from './usecase/recognizeSpeech'
import { SpeechController } from './controllers/SpeechController'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { hc } from 'hono/client'

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

const googleVisionOCRRepository = new GoogleVisionOcrRepository()
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
