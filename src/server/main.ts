import { PrismaClient } from '@prisma/client'
import { Hono } from 'hono'
import { hc } from 'hono/client'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { SpeakingEvaluationController } from './controllers/SpeakingEvaluationController'
import { ThemeController } from './controllers/ThemeController'
import { SpeechController } from './controllers/speechController'
import { GeminiEvaluationRepository } from './repository/GeminiEvaluationRepository'
import { GeminiThemeRepository } from './repository/GeminiThemeRepository'
import { GoogleVisionOCRRepository } from './repository/googleVisionOCRRepository'
import { SpeechRepository } from './repository/speechRepository'
import { EvaluateSpeakingUseCase } from './usecase/EvaluateSpeakingUseCase'
import { GenerateThemeUseCase } from './usecase/GenerateThemeUseCase'
import { PDFThemeGenerationUsecase } from './usecase/pdfThemeGeneration'
import { RecognizeSpeechUsecase } from './usecase/recognizeSpeech'

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

const generateThemeUseCase = new GenerateThemeUseCase(themeRepository)
const evaluateSpeakingUseCase = new EvaluateSpeakingUseCase(
  evaluationRepository,
)

const googleVisionOCRRepository = new GoogleVisionOCRRepository()
const pdfThemeGenerationUsecase = new PDFThemeGenerationUsecase(
  googleVisionOCRRepository,
)

const app = new Hono().basePath('/api')

// ThemeControllerのインスタンスに引数を渡して作成
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

// CORS設定
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
