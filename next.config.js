module.exports = {
  images: {
    domains: [
      'localhost',
      'hmn.exu.mybluehost.me',
      'img.discogs.com',
      'i.discogs.com',
      'books.google.com',
    ],
  },
  eslint: {
    dirs: ['components', 'features', 'lib', 'pages', 'views'],
  },
  async rewrites() {
    return [
      {
        source: '/file/:path*',
        destination: 'https://hmn.exu.mybluehost.me/:path*',
      },
    ]
  },
}
