import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    hmr: {
      clientPort: 443,
    },
  },
  optimizeDeps: {
    force: true,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})
