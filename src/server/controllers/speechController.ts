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
        return c.json({ error: 'スピーチの取得に失敗しました' }, 500)
      }
    } else {
      return c.json({ error: 'Invalid file type' }, 400)
    }
  }
}
