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
        
        <!-- Bildirim İzni Banner -->
        <NotificationPermissionBanner />
        
        <div class="w-full md:max-w-6xl mx-auto bg-base-100 md:shadow-lg md:rounded-xl overflow-hidden mb-20 md:mb-0">
          <!-- İçerik -->
          <router-view class="p-4 md:p-6" />
        </div>
      </div>
      
      <!-- Mobil Alt Navigasyon -->
      <MobileBottomNav v-if="showMobileNav" />
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
import MobileBottomNav from './components/common/MobileBottomNav.vue'
import NotificationPermissionBanner from './components/notifications/NotificationPermissionBanner.vue'
import ErrorNotification from './components/common/ErrorNotification.vue'
import SuccessNotification from './components/common/SuccessNotification.vue'
import { useAuthStore } from '@/stores/auth'
import { onMounted, watchEffect, watch } from 'vue'

const route = useRoute()
const authStore = useAuthStore()

const showMobileNav = computed(() => {
  return authStore.user && !route.meta.hideLayout;
})

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
