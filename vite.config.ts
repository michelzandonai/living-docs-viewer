import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  if (mode === 'development') {
    return {
      plugins: [react()],
      root: 'dev',
      resolve: {
        alias: { '@': resolve(__dirname, 'src') },
      },
      server: {
        port: 3333,
        proxy: {
          '/docs': {
            target: 'http://localhost:3334',
            changeOrigin: true,
          },
        },
      },
    }
  }

  return {
    plugins: [
      react(),
      dts({
        include: ['src'],
        outDir: 'dist',
        rollupTypes: true,
      }),
    ],
    resolve: {
      alias: { '@': resolve(__dirname, 'src') },
    },
    build: {
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: 'LivingDocsViewer',
        formats: ['es', 'cjs'],
        fileName: (format) => `index.${format}.js`,
      },
      rollupOptions: {
        external: ['react', 'react-dom', 'react/jsx-runtime'],
        output: {
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
          },
        },
      },
      cssCodeSplit: false,
    },
  }
})
