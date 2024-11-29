const createNextIntlPlugin = require('next-intl/plugin')

const withNextIntl = createNextIntlPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'lh3.googleusercontent.com', // Google 프로필 이미지 도메인
      'graph.facebook.com', // Facebook 프로필 이미지 도메인
      'dgalywyr863hv.cloudfront.net' // Strava 프로필 이미지 도메인
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dgalywyr863hv.cloudfront.net',
        pathname: '/pictures/athletes/**'
      }
    ]
  },
  async headers() {
    return [
      {
        source: '/.well-known/apple-app-site-association',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/json'
          }
        ]
      }
    ]
  }
}

module.exports = withNextIntl(nextConfig)
