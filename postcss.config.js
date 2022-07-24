module.exports = {
  plugins: {
    'postcss-import': {},
    'tailwindcss/nesting': 'postcss-nesting',
    tailwindcss: { config: './tailwind.config.js' },
    autoprefixer: {},
  },
}
