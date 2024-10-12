'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type React from 'react'
import { useState } from 'react'

const PDFUploadForm = () => {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [theme, setTheme] = useState('')

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
      setTheme(data.theme)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='bg-white p-6 rounded-lg shadow-md min-h-[340px] flex flex-col justify-center'>
      <h1 className='text-[#e67e22] text-2xl font-bold'>PDFからテーマ生成</h1>
      <div className='flex flex-col space-y-4'>
        <div className='flex flex-col space-y-2'>
          <label
            htmlFor='pdf-upload'
            className='block text-sm font-semibold text-gray-700'
          >
            PDFファイルをアップロード
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
          {loading ? 'アップロード中...' : 'アップロード'}
        </Button>

        {theme && (
          <div className='mt-4'>
            <h3 className='text-xl font-semibold'>生成されたテーマ:</h3>
            <p>{theme}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default PDFUploadForm
