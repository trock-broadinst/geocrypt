const isProd = process.env.NODE_ENV === 'production'
/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix: isProd ? '/geocrypt/' : '',
  reactStrictMode: true,
  images: {
    unoptimized: true
  }
}

if(!isProd){
   nextConfig['output']='export';
}

const withPWA = require('next-pwa')({
  dest: 'public'
})

module.exports = withPWA(nextConfig)