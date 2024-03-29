const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  swcMinify: true,
  images: {
    domains: [
      'localhost',
      'hmn.exu.mybluehost.me',
      'https://ross.syd1.cdn.digitaloceanspaces.com',
      'img.discogs.com',
      'i.discogs.com',
      'books.google.com',
    ],
  },
  eslint: {
    dirs: ['components', 'features', 'lib', 'pages', 'views'],
  },
  // async rewrites() {
  //   return [
  //     {
  //       source: '/file/:path*',
  //       destination: 'https://hmn.exu.mybluehost.me/:path*',
  //     },
  //   ]
  // },
  trailingSlash: false,
})
