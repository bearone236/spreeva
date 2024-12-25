import { PrismaClient } from '@prisma/client'
import { Hono } from 'hono'
import { hc } from 'hono/client'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

// Controllers import
import { SpeakingEvaluationController } from './controllers/SpeakingEvaluationController'
import { SpeechController } from './controllers/speechController'
import { ThemeController } from './controllers/themeController'

// Repositories import
import { GeminiEvaluationRepository } from './repository/GeminiEvaluationRepository'
import { GeminiThemeRepository } from './repository/GeminiThemeRepository'
import { GoogleVisionOCRRepository } from './repository/GoogleVisionOCRRepository'
import { SpeechRepository } from './repository/speechRepository'

// Use Cases import
import { EvaluateSpeakingUseCase } from './usecase/EvaluateSpeakingUseCase'
import { ThemeUseCase } from './usecase/ThemeUseCase'
import { PDFThemeGenerationUsecase } from './usecase/pdfThemeGeneration'
import { RecognizeSpeechUsecase } from './usecase/recognizeSpeech'

// 環境変数
const GEMINI_API_URL = process.env.GEMINI_API_URL as string
const GEMINI_API_KEY = process.env.GEMINI_API_KEY as string
const VERCEL_URL = process.env.VERCEL_URL as string

if (!GEMINI_API_URL || !GEMINI_API_KEY) {
  throw new Error('GEMINI_API_URL or GEMINI_API_KEY is not defined')
}

if (!VERCEL_URL) {
  throw new Error('VERCEL_URL is not defined')
}

// Prisma client
const prisma = new PrismaClient()

// Repository instances
const themeRepository = new GeminiThemeRepository(
  GEMINI_API_URL,
  GEMINI_API_KEY,
)
const evaluationRepository = new GeminiEvaluationRepository(prisma)
const googleVisionOCRRepository = new GoogleVisionOCRRepository()
const speechRepository = new SpeechRepository()

// Use Case instances
const generateThemeUseCase = new ThemeUseCase(themeRepository)
const evaluateSpeakingUseCase = new EvaluateSpeakingUseCase(
  evaluationRepository,
)
const pdfThemeGenerationUsecase = new PDFThemeGenerationUsecase(
  googleVisionOCRRepository,
)
const recognizeSpeechUsecase = new RecognizeSpeechUsecase(speechRepository)

// Controller instances
const themeController = new ThemeController(
  generateThemeUseCase,
  pdfThemeGenerationUsecase,
)
const evaluationController = new SpeakingEvaluationController(
  evaluateSpeakingUseCase,
)
const speechController = new SpeechController(recognizeSpeechUsecase)

// Hono app
const app = new Hono().basePath('/api')

// Middlewares
app.use('*', cors())
app.use(logger())

// Routes
app.post('/theme', c => themeController.handleThemeGeneration(c))
app.post('/evaluate', c => evaluationController.handleEvaluation(c))
app.post('/speech', c => speechController.handleRecognizeSpeech(c))
app.post('/upload-pdf', c => themeController.handleThemeGeneration(c))

export const rpcClient = hc<typeof app>(VERCEL_URL)
export default app
