module.exports = {
  images: {
    domains: [
      "localhost",
      "hmn.exu.mybluehost.me",
      "img.discogs.com",
      "books.google.com",
    ],
  },
  async rewrites() {
    return [
      {
        source: "/file/:path*",
        destination: "https://hmn.exu.mybluehost.me/:path*",
      },
    ];
  },
};
