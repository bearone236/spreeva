/** @type {import('next').NextConfig} */
const nextConfig = {
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
        {
          '@lottiefiles/react-lottie-player':
            'commonjs @lottiefiles/react-lottie-player',
        },
      ]
    }

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
      }
    }

    return config
  },
  experimental: {
    serverComponentsExternalPackages: [
      '@google-cloud/vision',
      '@google-cloud/storage',
    ],
  },
}

export default nextConfig
