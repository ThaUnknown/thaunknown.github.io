const purgecss = require('@fullhuman/postcss-purgecss')({
  content: ['./**/**/*.html', './**/**/*.svelte'],
  whitelistPatterns: [/svelte-/],
  defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
})

const isProduction = !process.env.ROLLUP_WATCH && !process.env.LIVERELOAD

module.exports = {
  plugins: [
    ...(isProduction ? [purgecss] : [])
  ]
}
