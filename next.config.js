module.exports = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: [
      'localhost',
      'hmn.exu.mybluehost.me',
      'img.discogs.com',
      'i.discogs.com',
      'books.google.com',
    ],
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
