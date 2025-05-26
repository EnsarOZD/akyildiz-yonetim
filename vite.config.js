import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],  
  server: {
    proxy: {
      '/api': {
        target: 'https://script.google.com/macros/s/AKfycby1osmY6e7OsxVhBfaSQ-LN1BuByg9jbZroITQVinIwIumR-XBCqPja-5p6vcfutemx/exec',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})