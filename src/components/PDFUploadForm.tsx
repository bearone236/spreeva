'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import useStore from '../provider/store/useStore'

const Player = dynamic(
  () => import('@lottiefiles/react-lottie-player').then(mod => mod.Player),
  { ssr: false },
)

const PDFUploadForm = () => {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { setTheme, setThemeType } = useStore()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) return
    setLoading(true)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload-pdf', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || '予期しないエラーが発生しました')
      }

      setTheme(data.theme)
      setThemeType('ocr')
      router.push('/select')
    } catch (error) {
      alert('PDFのアップロードに失敗しました。もう一度お試しください。')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='bg-white p-6 rounded-lg shadow-md min-h-[270px] flex flex-col justify-center'>
      <h1 className='text-[#e67e22] text-2xl font-bold xs:text-xl'>
        PDFからテーマ生成
      </h1>
      <div className='flex flex-col space-y-4'>
        <div className='flex flex-col space-y-2 mt-4'>
          <label
            htmlFor='pdf-upload'
            className='block text-sm font-semibold text-gray-700 xs:text-xs'
          >
            PDFファイルをアップロードしてください
          </label>
          <Input
            id='pdf-upload'
            type='file'
            accept='application/pdf'
            onChange={handleFileChange}
            className='w-full border-[#f39c12] focus:border-[#e67e22] focus:ring-[#e67e22] rounded-md hover:cursor-pointer'
          />
        </div>

        <Button
          onClick={handleUpload}
          disabled={loading || !file}
          className={`w-full py-3 rounded-md text-white ${
            file
              ? 'bg-gradient-to-r from-[#f1c40f] to-[#e67e22] hover:from-[#f39c12] hover:to-[#d35400]'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          {loading ? (
            <>
              <Player
                autoplay
                loop
                src={'/select-loading.json'}
                style={{ height: '40px', width: '40px' }}
              />
              <span className='ml-2'>アップロード中</span>
            </>
          ) : (
            'アップロード'
          )}
        </Button>
      </div>
    </div>
  )
}

export default PDFUploadForm
