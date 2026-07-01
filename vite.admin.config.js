import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  cacheDir: `.vite-cache-admin/${process.pid}`,
  plugins: [react(), tailwindcss()],
  server: {
    port: 4173,
    open: true,
  },
  root: 'admin-server',
})
