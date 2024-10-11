import { SpeechClient, protos } from '@google-cloud/speech'
import { GoogleAuth } from 'google-auth-library'

export class SpeechRepository {
  private client: SpeechClient

  constructor() {
    const auth = new GoogleAuth({
      credentials: JSON.parse(process.env.GCLOUD_CREDENTIALS || '{}'),
      scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    })
    this.client = new SpeechClient({ auth })
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
        : ''

      return transcription
    } catch (error) {
      console.error('Error recognizing speech:', error)
      throw new Error('Failed to recognize speech')
    }
  }
}
