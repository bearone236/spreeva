import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const config = {
  output: 'standalone',
  images: {
    remotePatterns: [
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
    }

    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        child_process: false,
      }
    }

    config.resolve.alias['@'] = path.resolve(__dirname, 'src')
    return config
  },
  experimental: {
    serverComponentsExternalPackages: [
      '@google-cloud/vision',
      '@google-cloud/storage',
    ],
  },
}

export default config
