import { realpathSync } from 'node:fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const root = realpathSync.native('.')
const backendProxy = {
  target: 'http://localhost:8080',
  changeOrigin: true,
  rewrite: (path: string) => path.replace(/^\/api/, ''),
}

// https://vite.dev/config/
export default defineConfig({
  root,
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      '^/api(/|$)': backendProxy,
    },
  },
  preview: {
    port: 5174,
  },
})
