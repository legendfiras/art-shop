import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// BASE_PATH is set in CI for GitHub project pages (/art-shop/). Other hosts use /.
export default defineConfig({
  base: process.env.BASE_PATH || '/',
  plugins: [
    react(),
    {
      name: 'spa-fallback',
      apply: 'build',
      closeBundle() {
        const dist = resolve('dist')
        copyFileSync(resolve(dist, 'index.html'), resolve(dist, '404.html'))
      },
    },
  ],
})
