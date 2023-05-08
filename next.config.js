const isProd = process.env.NODE_ENV === 'production'
/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix: isProd ? '/geocrypt/' : '',
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true
  }
}

const withPWA = require('next-pwa')({
  dest: 'public'
})

module.exports = withPWA(nextConfig)