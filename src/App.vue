<template>
  <div :data-theme="authStore.theme" class="min-h-screen">
    <!-- Landing page ve login için farklı layout -->
    <template v-if="route.meta.hideLayout">
      <router-view />
    </template>
    
    <!-- Normal sayfalar için layout -->
    <template v-else>
      <div class="min-h-screen bg-base-200">
        <!-- Header -->
        <Header />
        
        <div class="max-w-6xl mx-auto bg-base-100 shadow-lg rounded-xl overflow-hidden">
          <!-- İçerik -->
          <router-view class="p-6" />
        </div>
      </div>
    </template>

    <!-- Global Hata Bildirimleri -->
    <ErrorNotification />
    
    <!-- Global Bildirimler -->
    <SuccessNotification />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import Header from './components/common/Header.vue'
import ErrorNotification from './components/common/ErrorNotification.vue'
import SuccessNotification from './components/common/SuccessNotification.vue'
import { useAuthStore } from '@/stores/auth'
import { onMounted, watchEffect, watch } from 'vue'

const route = useRoute()
const authStore = useAuthStore()

onMounted(() => {
  authStore.initAuthListener()
})

// Tema değişikliğini izle ve <html> etiketine 'dark' sınıfını ekle/kaldır
watch(() => authStore.theme, (theme) => {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}, { immediate: true })
</script>
