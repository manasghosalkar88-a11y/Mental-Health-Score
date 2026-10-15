import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/predict': {
        target: 'http://127.0.0.1:2200',
        changeOrigin: true,
      },
      '/health': {
        target: 'http://127.0.0.1:2200',
        changeOrigin: true,
      },
      '/openapi.json': {
        target: 'http://127.0.0.1:2200',
        changeOrigin: true,
      },
      '/docs': {
        target: 'http://127.0.0.1:2200',
        changeOrigin: true,
      },
    },
  },
})
