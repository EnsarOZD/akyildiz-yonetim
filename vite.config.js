import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Bundle size uyarı limitini artır
    chunkSizeWarningLimit: 1000,
    
    // Code splitting için manual chunks
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          'utils-vendor': ['xlsx', 'date-fns']
        }
      }
    },
    
    // Asset optimization
    assetsInlineLimit: 4096, // 4KB altındaki dosyaları inline et
    
    // CSS optimization
    cssCodeSplit: true,
    
    // Source maps (production'da kapalı)
    sourcemap: false,
    
    // Minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // console.log'ları kaldır
        drop_debugger: true
      }
    }
  },
  
  // Development optimizations
  server: {
    port: 3000,
    host: true
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      'pinia',
      'xlsx',
      'date-fns'
    ]
  }
})
