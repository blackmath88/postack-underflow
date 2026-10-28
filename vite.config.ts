import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves this project site from a subpath. Vite prefixes assets
// with `base`; the router prefixes links with `basepath`. Both must agree.
const BASE = '/postack-underflow'

export default defineConfig({
  base: `${BASE}/`,
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
