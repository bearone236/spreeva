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
      config.externals.push({
        '@lottiefiles/react-lottie-player':
          'commonjs @lottiefiles/react-lottie-player',
      })
    }
    return config
  },
}

export default nextConfig
