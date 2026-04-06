let withBundleAnalyzer
try {
  withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
  })
} catch (e) {
  withBundleAnalyzer = (config) => config
}

module.exports = withBundleAnalyzer({
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'https', hostname: 'ross.syd1.cdn.digitaloceanspaces.com' },
      { protocol: 'https', hostname: 'img.discogs.com' },
      { protocol: 'https', hostname: 'i.discogs.com' },
      { protocol: 'https', hostname: 'books.google.com' },
    ],
  },
  trailingSlash: false,
})