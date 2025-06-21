<template>
  <div :data-theme="authStore.theme" class="min-h-screen bg-base-200">
    <!-- Header artık dışarıda ve sticky çalışacak -->
    <Header v-if="!route.meta.hideLayout" />
    
    <div class="max-w-6xl mx-auto bg-base-100 shadow-lg rounded-xl overflow-hidden">
      <!-- İçerik -->
      <router-view class="p-6" />
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import Header from './components/common/Header.vue'
import { useAuthStore } from '@/stores/auth'
import { onMounted, watchEffect } from 'vue'

const route = useRoute()
const authStore = useAuthStore()

onMounted(() => {
  authStore.initAuthListener()
})

// Tema değişikliğini izle ve <html> etiketine 'dark' sınıfını ekle/kaldır
watchEffect(() => {
  const theme = document.documentElement.getAttribute('data-theme');
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
});
</script>
