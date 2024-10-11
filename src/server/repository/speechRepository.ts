import { SpeechClient, protos } from '@google-cloud/speech'
import { Storage } from '@google-cloud/storage'
import { GoogleAuth } from 'google-auth-library'

export class SpeechRepository {
  private client: SpeechClient
  private storage: Storage

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
      this.storage = new Storage()
    } catch (error) {
      console.error('Error initializing GoogleAuth:', error)
      throw error
    }
  }

  async uploadToGCS(audioBuffer: Buffer, filename: string): Promise<string> {
    const bucketName = process.env.GCS_BUCKET_NAME || 'default-bucket'
    const file = this.storage.bucket(bucketName).file(filename)
    await file.save(audioBuffer, {
      contentType: 'audio/webm',
    })
    return `gs://${bucketName}/${filename}`
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
      const audioDurationInSeconds = audioBuffer.length / (48000 * 2)

      if (audioDurationInSeconds > 60) {
        const gcsUri = await this.uploadToGCS(
          audioBuffer,
          `long_audio_${Date.now()}.webm`,
        )
        const longRequest = {
          audio: { uri: gcsUri },
          config: request.config,
        }
        const [operation] = await this.client.longRunningRecognize(longRequest)
        const [response] = await operation.promise()
        const transcription = response.results
          ? response.results
              .map(result => result.alternatives?.[0].transcript)
              .join('\n')
          : 'No transcription available'
        return transcription
      }

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
