import { Hono } from 'hono'
import { hc } from 'hono/client'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { EvaluationController } from './controllers/evaluationController'
import { SpeechController } from './controllers/speechController'
import { ThemeController } from './controllers/themeController'
import { GoogleVisionOCRRepository } from './repository/googleVisionOCRRepository'
import { SpeechRepository } from './repository/speechRepository'
import { GenerateThemeUseCase } from './usecase/generateTheme'
import { PDFThemeGenerationUsecase } from './usecase/pdfThemeGeneration'
import { RecognizeSpeechUsecase } from './usecase/recognizeSpeech'

const generateThemeUseCase = new GenerateThemeUseCase()
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
const evaluationController = new EvaluationController()
const speechRepository = new SpeechRepository()
const recognizeSpeechUsecase = new RecognizeSpeechUsecase(speechRepository)
const speechController = new SpeechController(recognizeSpeechUsecase)

// CORS設定
app.use('*', cors())
app.use(logger())

app.post('/theme', c => themeController.handleGenerateTheme(c))
app.post('/evaluate', c => evaluationController.handleEvaluateSpeech(c))
app.post('/speech', c => speechController.handleRecognizeSpeech(c))
app.post('/upload-pdf', c => themeController.handleGenerateTheme(c))

type AppType = typeof app

if (!process.env.VERCEL_URL) {
  throw new Error('VERCEL_URL is not defined')
}

export const rpcClient = hc<AppType>(process.env.VERCEL_URL)

export default app
