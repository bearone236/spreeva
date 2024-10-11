// server/controllers/speechController.ts
import type { Context } from 'hono'
import type { RecognizeSpeechUsecase } from '../usecase/recognizeSpeech'

export class SpeechController {
  private recognizeSpeechUsecase: RecognizeSpeechUsecase

  constructor(recognizeSpeechUsecase: RecognizeSpeechUsecase) {
    this.recognizeSpeechUsecase = recognizeSpeechUsecase
  }

  async handleRecognizeSpeech(c: Context) {
    const formData = await c.req.formData()
    const file = formData.get('file')

    if (file instanceof File) {
      const arrayBuffer = await file.arrayBuffer()
      const audioBuffer = Buffer.from(arrayBuffer)

      try {
        const result = await this.recognizeSpeechUsecase.execute(audioBuffer)
        return c.json(result, 200)
      } catch (error) {
        console.error('Error processing audio:', error)
        return c.json({ error: 'Speech recognition failed' }, 500)
      }
    } else {
      console.error('Invalid file type received')
      return c.json({ error: 'Invalid file type' }, 400)
    }
  }
}
