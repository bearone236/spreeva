import { SpeechClient, protos } from '@google-cloud/speech'
import { GoogleAuth } from 'google-auth-library'

export class SpeechRepository {
  private client: SpeechClient

  constructor() {
    try {
      if (process.env.NODE_ENV === 'production') {
        if (!process.env.GCLOUD_CREDENTIALS) {
          throw new Error('GCLOUD_CREDENTIALS is not set in production')
        }

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
        if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
          throw new Error(
            'GOOGLE_APPLICATION_CREDENTIALS is not set in development',
          )
        }

        this.client = new SpeechClient()
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error initializing GoogleAuth:', error.message)
      } else {
        console.error('Error initializing GoogleAuth:', error)
      }
      throw error
    }
  }

  async recognizeSpeech(audioBuffer: Buffer): Promise<string> {
    const request = {
      audio: { content: audioBuffer.toString('base64') },
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
      const responses = await this.client.recognize(request)
      const response = responses[0]
      const transcription = response.results
        ? response.results
            .map(result => result.alternatives?.[0].transcript)
            .join('\n')
        : 'No transcription available'

      return transcription
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error recognizing speech:', error.message)
      } else {
        console.error('Error recognizing speech:', error)
      }
      throw new Error('Failed to recognize speech')
    }
  }
}
