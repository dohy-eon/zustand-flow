import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

const rootDir = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [
    react(),
    dts({
      tsconfigPath: './tsconfig.build.json',
      outDir: 'dist',
      include: ['src/index.ts', 'src/devtools.tsx', 'src/lib/**/*.ts', 'src/react/**/*.ts', 'src/react/**/*.tsx'],
      rollupTypes: true,
    }),
  ],
  build: {
    lib: {
      entry: {
        index: resolve(rootDir, 'src/index.ts'),
        devtools: resolve(rootDir, 'src/devtools.tsx'),
      },
      formats: ['es', 'cjs'],
      fileName(format, entryName) {
        return format === 'es' ? `${entryName}.js` : `${entryName}.cjs`
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      external: (id) =>
        id === 'react' ||
        id === 'react-dom' ||
        id === 'react/jsx-runtime' ||
        id === 'zustand' ||
        id.startsWith('react/'),
    },
  },
})
