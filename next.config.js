const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: "3000"
      },
      {
        protocol: 'https',
        hostname: 'hmn.exu.mybluehost.me',
      },
      {
        protocol: 'https',
        hostname: 'ross.syd1.cdn.digitaloceanspaces.com',
      },
      {
        protocol: 'https',
        hostname: 'img.discogs.com',
      },
      {
        protocol: 'https',
        hostname: 'i.discogs.com',
      },
      {
        protocol: 'https',
        hostname: 'books.google.com',
      },
    ],
  },
  trailingSlash: false,
})