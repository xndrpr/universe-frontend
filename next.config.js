/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.openmoviedb.com',
        pathname: '**',
      },
    ],
  }
}

module.exports = nextConfig
