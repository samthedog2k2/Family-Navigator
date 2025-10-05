/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    allowedDevOrigins: [
      '3000-firebase-studio-1758327366090.cluster-kadnvepafzbgiwrf2a46powzly.cloudworkstations.dev',
      'studio.firebase.google.com',
      '.cloudworkstations.dev'
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*'
          }
        ]
      }
    ]
  }
}

export default nextConfig
