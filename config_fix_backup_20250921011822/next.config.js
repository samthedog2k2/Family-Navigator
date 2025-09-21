/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    allowedDevOrigins: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://3001-firebase-studio-1758327366090.cluster-kadnvepafzbgiwrf2a46powzly.cloudworkstations.dev"
    ]
  }
};

module.exports = nextConfig;
