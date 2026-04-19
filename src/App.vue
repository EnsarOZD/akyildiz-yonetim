<template>
  <div :data-theme="authStore.theme" class="min-h-screen">
    <!-- Hata Durumu (Rendering Crash) -->
    <div v-if="renderError" class="min-h-screen flex flex-col items-center justify-center p-6 bg-base-200 text-center">
      <div class="max-w-md w-full p-8 bg-base-100 rounded-2xl shadow-2xl border-t-4 border-error">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-error mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <h1 class="text-2xl font-bold mb-2">Uygulama Hatası</h1>
        <p class="text-base-content/70 mb-2 italic text-sm">{{ renderError.message }}</p>
        <p class="text-[11px] text-base-content/40 mb-6">Bileşen: {{ renderError.component }}</p>
        
        <div class="space-y-3">
          <button @click="window.location.reload()" class="btn btn-primary btn-block">Sayfayı Yenile</button>
          <button @click="renderError = null" class="btn btn-ghost btn-block btn-sm">Hata Kutusunu Kapat</button>
        </div>
        
        <div class="mt-8 pt-6 border-t border-base-300">
          <p class="text-[10px] text-base-content/40 uppercase tracking-widest font-bold">Sorun Giderme</p>
          <p class="text-xs mt-2 text-base-content/60">Eğer sorun devam ederse, lütfen tarayıcı önbelleğini temizleyin veya farklı bir tarayıcı deneyin.</p>
        </div>
      </div>
    </div>

    <!-- Normal Uygulama Akışı -->
    <template v-else>
      <!-- Landing page ve login için farklı layout -->
      <template v-if="route.meta.hideLayout">
        <router-view key="public-view" />
      </template>
      
      <!-- Normal sayfalar için layout -->
      <template v-else>
        <div class="min-h-screen bg-white dark:bg-[#080b14] text-slate-900 dark:text-[#f1f3f9] transition-colors duration-300">
          <!-- Header -->
          <Header />

          <!-- Bildirim İzni Banner -->
          <NotificationPermissionBanner />

          <div class="w-full max-w-7xl mx-auto mb-20 md:mb-0 px-4 sm:px-6 lg:px-8">
            <!-- İçerik -->
            <router-view key="private-view" />
          </div>
        </div>
        
        <!-- Mobil Alt Navigasyon -->
        <MobileBottomNav v-if="showMobileNav" />
      </template>
    </template>

    <!-- Global Hata Bildirimleri -->
    <ErrorNotification />
    
    <!-- Global Bildirimler -->
    <SuccessNotification />

    <!-- Üste Dön -->
    <ScrollToTop />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import Header from '@/presentation/components/common/Header.vue'
import MobileBottomNav from '@/presentation/components/common/MobileBottomNav.vue'
import NotificationPermissionBanner from '@/presentation/components/notifications/NotificationPermissionBanner.vue'
import ErrorNotification from '@/presentation/components/common/ErrorNotification.vue'
import SuccessNotification from '@/presentation/components/common/SuccessNotification.vue'
import ScrollToTop from '@/presentation/components/common/ScrollToTop.vue'
import { useAuthStore } from '@/application/stores/auth'
import { ref, onMounted, watchEffect, watch, computed, onErrorCaptured } from 'vue'

const route = useRoute()
const authStore = useAuthStore()
const renderError = ref(null);

onErrorCaptured((err, instance, info) => {
  console.error('🔥 Global Render Error Captured:', err, info);
  renderError.value = {
    message: err.message || 'Bileşen yüklenirken bir hata oluştu.',
    info,
    component: instance?.$options?.name || 'Bilinmeyen Bileşen'
  };
  // Bir üst seviyeye hatayı yayma, burada yakaladık
  return false;
});

const showMobileNav = computed(() => {
  return authStore.user && !route.meta.hideLayout;
})

onMounted(() => {
  authStore.initAuthListener()
})

// Sayfa değiştiğinde hata durumunu temizle (SPA navigasyonu çalışsın)
watch(() => route.path, () => {
  renderError.value = null
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
