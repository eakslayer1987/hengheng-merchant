/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'your-s3-bucket.s3.amazonaws.com'],
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig
