// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import path from 'path'
// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const config = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'accounts.google.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [
        ...(config.externals || []),
        '@lottiefiles/react-lottie-player',
      ]
      config.resolve.fallback = { fs: false, path: false }
      return config
    }

    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        child_process: false,
      }
    }

    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
    }
    return config
  },
  serverExternalPackages: ['@google-cloud/vision', '@google-cloud/storage'],
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
}

export default config
