import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves this project site from a subpath. Vite prefixes assets
// with `base`; the router prefixes links with `basepath`. Both must agree.
const BASE = '/postack-underflow'

// GitHub Pages' Jekyll step drops files whose names start with an underscore.
// A dynamic route such as lab/$n/ is split into a chunk named `_n`, so strip
// leading underscores from generated file names. validate-build checks this.
const pagesSafe = (name: string) => name.replace(/^_+/, 'r')

export default defineConfig({
  base: `${BASE}/`,
  build: {
    rollupOptions: {
      output: {
        chunkFileNames: (chunk) => `assets/${pagesSafe(chunk.name)}-[hash].js`,
      },
    },
  },
  plugins: [
    tanstackStart({
      router: { basepath: BASE },
      prerender: {
        enabled: true,
        crawlLinks: true,
        autoSubfolderIndex: true,
        failOnError: true,
      },
      pages: [{ path: '/404', prerender: { enabled: true, outputPath: '/404.html' } }],
    }),
    react(),
  ],
})
