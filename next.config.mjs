// eslint-disable-next-line import/no-anonymous-default-export
export default {
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

    return config
  },
  experimental: {
    serverComponentsExternalPackages: [
      '@google-cloud/vision',
      '@google-cloud/storage',
    ],
  },
}
