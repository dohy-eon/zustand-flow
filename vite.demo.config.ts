import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/** Demo app (dev server + static preview). Library build uses vite.config.ts. */
export default defineConfig({
  plugins: [react()],
  root: '.',
  build: {
    outDir: 'dist-demo',
    emptyOutDir: true,
  },
})
