import svelte from 'rollup-plugin-svelte'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import livereload from 'rollup-plugin-livereload'
import { terser } from 'rollup-plugin-terser'
import css from 'rollup-plugin-css-only'
import postcss from 'rollup-plugin-postcss'
import sveltePreprocess from 'svelte-preprocess'

const production = !process.env.ROLLUP_WATCH

function serve () {
  let server

  function toExit () {
    if (server) server.kill(0)
  }

  return {
    writeBundle () {
      if (server) return
      server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
        stdio: ['ignore', 'inherit', 'inherit'],
        shell: true
      })

      process.on('SIGTERM', toExit)
      process.on('exit', toExit)
    }
  }
}

export default {
  input: 'src/main.js',
  output: {
    sourcemap: true,
    name: 'app',
    dir: 'public/build/',
    entryFileNames: 'bundle.js',
    chunkFileNames: '[name].js'
  },
  manualChunks: {
    '3d': ['three', 'vanta']
  },
  plugins: [
    svelte({
      preprocess: sveltePreprocess({
        postcss: true
      }),
      compilerOptions: {
        // enable run-time checks when not in production
        dev: !production,
        css: css => { css.write('bundle.css') }
      },
      emitCss: false
    }),
    // we'll extract any component CSS out into
    // a separate file - better for performance
    production
      ? postcss({ extract: true, minimize: true })
      : css({ output: 'bundle.css' }),
    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration -
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    resolve({
      browser: true,
      dedupe: ['svelte']
    }),
    commonjs(),

    // In dev mode, call `npm run start` once
    // the bundle has been generated
    !production && serve(),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload(),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser()
  ],
  watch: {
    clearScreen: false
  }
}
