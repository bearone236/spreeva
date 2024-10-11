import { SpeechClient, protos } from '@google-cloud/speech'
import { GoogleAuth } from 'google-auth-library'

export class SpeechRepository {
  private client: SpeechClient

  constructor() {
    try {
      if (process.env.NODE_ENV === 'production') {
        const credentials = JSON.parse(process.env.GCLOUD_CREDENTIALS || '{}')
        if (!credentials.client_email) {
          throw new Error('Invalid GCLOUD_CREDENTIALS: client_email is missing')
        }
        const auth = new GoogleAuth({
          credentials,
          scopes: ['https://www.googleapis.com/auth/cloud-platform'],
        })
        this.client = new SpeechClient({ auth })
      } else {
        this.client = new SpeechClient()
      }
    } catch (error) {
      console.error('Error initializing GoogleAuth:', error)
      throw error
    }
  }

  async recognizeSpeech(audioBuffer: Buffer): Promise<string> {
    const base64Audio = audioBuffer.toString('base64')
    const request = {
      audio: { content: base64Audio },
      config: {
        encoding:
          protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding
            .WEBM_OPUS,
        sampleRateHertz: 48000,
        languageCode: 'en-US',
        enableAutomaticPunctuation: true,
      },
    }

    try {
      // 音声データの秒数を計算 (byte数をサンプルレートで割って時間を算出)
      const audioDurationInSeconds = audioBuffer.length / (48000 * 2) // 16-bit (2 bytes per sample)

      if (audioDurationInSeconds > 60) {
        // 1分以上の音声の場合、longRunningRecognizeを使用
        const [operation] = await this.client.longRunningRecognize(request)
        const [response] = await operation.promise()
        const transcription = response.results
          ? response.results
              .map(result => result.alternatives?.[0].transcript)
              .join('\n')
          : 'No transcription available'
        return transcription
      }
      // 1分以内の音声の場合、recognizeを使用
      const [response] = await this.client.recognize(request)
      const transcription = response.results
        ? response.results
            .map(result => result.alternatives?.[0].transcript)
            .join('\n')
        : 'No transcription available'
      return transcription
    } catch (error) {
      console.error('Error recognizing speech:', error)
      throw new Error('Failed to recognize speech')
    }
  }
}
