/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true
  },
}

const withPWA = require('next-pwa')({
  dest: 'public'
})

module.exports = withPWA(nextConfig)