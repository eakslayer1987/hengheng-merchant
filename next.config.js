/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'xn--72ca9ib1gc.xn--72cac8e8ec.com',
      },
      {
        protocol: 'https',
        hostname: 'api.meeprungmerchant.com',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Authorization, Content-Type' },
        ],
      },
    ]
  },
  async rewrites() {
    return [
      // proxy /php-api/* → PHP backend (ข้ามปัญหา CORS ในกรณี dev)
      {
        source: '/php-api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
      },
    ]
  },
}

module.exports = nextConfig
