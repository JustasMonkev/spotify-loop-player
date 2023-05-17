import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { ghPages } from 'vite-plugin-gh-pages'

const base =
  process.env.NODE_ENV === 'production' ? '/spotify-loop-player/' : '/'

export default defineConfig({
  base,
  plugins: [react(), ghPages()],
  build: {
    outDir: 'dist',
  },
  publicDir: 'public',
})
