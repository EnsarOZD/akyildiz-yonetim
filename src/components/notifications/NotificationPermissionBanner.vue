<template>
  <transition
    enter-active-class="transform transition ease-out duration-300"
    enter-from-class="-translate-y-full opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transform transition ease-in duration-200"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="-translate-y-full opacity-0"
  >
    <div 
      v-if="showBanner"
      class="bg-blue-600 text-white py-3 px-4 shadow-lg sticky top-16 z-40 flex flex-col md:flex-row items-center justify-between gap-3 text-sm"
    >
      <div class="flex items-center gap-2">
        <div class="p-1.5 bg-white/20 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
        </div>
        <p class="font-medium text-center md:text-left">
          Bildirimleri açmak ister misiniz? Yeni borç, tahsilat ve duyurular için anlık bildirim alın.
        </p>
      </div>
      
      <div class="flex items-center gap-2 w-full md:w-auto">
        <button 
          @click="subscribe"
          class="flex-1 md:flex-none px-4 py-2 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition active:scale-95 disabled:opacity-50"
          :disabled="loading"
        >
          <span v-if="loading" class="loading loading-spinner loading-xs mr-1"></span>
          Bildirimleri Aç
        </button>
        <button 
          @click="dismiss"
          class="flex-1 md:flex-none px-4 py-2 bg-transparent text-white border border-white/30 font-medium rounded-lg hover:bg-white/10 transition"
          :disabled="loading"
        >
          Şimdi Değil
        </button>
      </div>

      <div v-if="permissionDenied" class="absolute inset-x-0 -bottom-8 bg-amber-100 text-amber-800 text-[10px] text-center py-1 font-medium md:static md:bg-transparent md:text-white/80 md:w-full md:text-center animate-pulse">
        Lütfen tarayıcı ayarlarından bildirim iznini aktif hale getirin.
      </div>

      <!-- Close Button -->
      <button 
        @click="dismiss" 
        class="absolute right-2 top-2 p-1 hover:bg-white/10 rounded-full md:static"
        aria-label="Kapat"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { pushNotificationService } from '@/services/pushNotificationService'
import { useAuthStore } from '@/stores/auth'
import { useRoute } from 'vue-router'

const authStore = useAuthStore()
const route = useRoute()

const showBanner = ref(false)
const loading = ref(false)
const permissionDenied = ref(false)

const DISMISS_KEY = 'notif_prompt_dismissed_at'
const COOLDOWN_DAYS = 7

onMounted(async () => {
    checkVisibility()
})

const checkVisibility = async () => {
    // Basic checks
    if (!authStore.user || route.path === '/login' || route.path === '/landing') {
        showBanner.value = false
        return
    }

    if (!pushNotificationService.isSupported()) return

    // Permission check
    const permission = pushNotificationService.getPermission()
    if (permission === 'granted') {
        showBanner.value = false
        return
    }
    
    if (permission === 'denied') {
        // Technically we can't show prompt, but we can show the banner to explain how to fix it
        // User didn't ask for this specifically, so let's hide for now to avoid annoyance
        return
    }

    // Cooldown check
    const dismissedAt = localStorage.getItem(DISMISS_KEY)
    if (dismissedAt) {
        const lastDismiss = new Date(parseInt(dismissedAt))
        const diff = Date.now() - lastDismiss.getTime()
        if (diff < COOLDOWN_DAYS * 24 * 60 * 60 * 1000) {
            return
        }
    }

    // Subscription check
    const subscribed = await pushNotificationService.isSubscribed()
    if (!subscribed) {
        showBanner.value = true
    }
}

const subscribe = async () => {
    loading.value = true
    try {
        const permission = await pushNotificationService.requestPermission()
        if (permission === 'granted') {
            await pushNotificationService.subscribeUser()
            showBanner.value = false
        } else if (permission === 'denied') {
            permissionDenied.value = true
            setTimeout(() => { showBanner.value = false }, 5000)
        }
    } catch (error) {
        console.error('Subscription failed:', error)
        // Ensure it doesn't get stuck open on error
        setTimeout(() => { showBanner.value = false }, 3000)
    } finally {
        loading.value = false
    }
}

const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, Date.now().toString())
    showBanner.value = false
}
</script>
