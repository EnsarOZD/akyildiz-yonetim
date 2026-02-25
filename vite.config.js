import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['favicon.ico', 'logo-default.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Akyıldız İş Merkezi Yönetim Sistemi',
        short_name: 'Akyıldız',
        description: 'Profesyonel apartman ve site yönetim sistemi',
        theme_color: '#0b1220',
        background_color: '#0b1220',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: '/logo-default.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any'
          },
          {
            src: '/logo-default.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any'
          },
          {
            src: '/logo-default.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        navigateFallback: 'index.html',
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.akyildizyonetim\.com\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 // 24 hours
              }
            }
          }
        ]
      }
    })
  ],
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
