<template>
  <!-- Mobil: bottom sheet; Masaüstü: üst banner -->
  <transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0 translate-y-4"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-4"
  >
    <div
      v-if="showBanner"
      class="fixed z-[45] inset-x-0 bottom-[4.5rem] md:bottom-auto md:top-14 px-3 md:px-0"
    >
      <!-- Mobil: kart; Masaüstü: tam genişlik banner -->
      <div class="md:hidden">
        <div class="app-card !p-0 shadow-xl border-blue-300 dark:border-blue-700 overflow-hidden">
          <!-- Renk çizgisi -->
          <div class="h-1 bg-gradient-to-r from-blue-500 to-violet-500" />
          <div class="p-4">
            <div class="flex items-start gap-3">
              <!-- İkon -->
              <div class="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"
                    d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
              </div>
              <!-- Metin -->
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {{ deniedState ? 'Bildirimler Engellendi' : 'Bildirimleri Etkinleştir' }}
                </p>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                  {{ deniedState
                    ? 'Tarayıcı ayarlarından bu site için bildirimlere izin verin.'
                    : 'Borç, tahsilat ve duyurular için anlık bildirim alın.' }}
                </p>
              </div>
              <!-- Kapat -->
              <button @click="dismiss" class="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 shrink-0">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Butonlar -->
            <div v-if="!deniedState" class="flex gap-2 mt-3">
              <button
                @click="subscribe"
                :disabled="loading"
                class="flex-1 btn btn-sm btn-primary"
              >
                <span v-if="loading" class="loading loading-spinner loading-xs"></span>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                Bildirimleri Aç
              </button>
              <button @click="dismiss" :disabled="loading" class="btn btn-sm btn-ghost">
                Şimdi Değil
              </button>
            </div>

            <!-- Denied mesajı -->
            <div v-else class="mt-3 flex items-start gap-2 p-2.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
              <svg class="w-4 h-4 text-amber-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-xs text-amber-700 dark:text-amber-300">
                Tarayıcı URL çubuğundaki kilit ikonuna tıklayıp <strong>Bildirimler → İzin Ver</strong> seçeneğini kullanın.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Masaüstü banner -->
      <div class="hidden md:flex items-center justify-between gap-4 bg-blue-600 text-white px-6 py-3 shadow-md text-sm">
        <div class="flex items-center gap-3">
          <div class="p-1.5 bg-white/20 rounded-full shrink-0">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"
                d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
          </div>
          <span class="font-medium">
            {{ deniedState
              ? 'Bildirimler engellenmiş. Tarayıcı ayarlarından bu site için bildirimlere izin verin.'
              : 'Bildirimleri açmak ister misiniz? Borç, tahsilat ve duyurular için anlık bildirim alın.' }}
          </span>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <button v-if="!deniedState"
            @click="subscribe"
            :disabled="loading"
            class="px-3 py-1.5 bg-white text-blue-600 font-semibold rounded-lg text-xs hover:bg-blue-50 transition disabled:opacity-50"
          >
            <span v-if="loading" class="loading loading-spinner loading-xs mr-1"></span>
            Bildirimleri Aç
          </button>
          <button @click="dismiss" class="p-1 hover:bg-white/10 rounded-lg transition" aria-label="Kapat">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { pushNotificationService } from '@/infrastructure/services/pushNotificationService'
import { useAuthStore } from '@/application/stores/auth'
import { useRoute } from 'vue-router'

const authStore = useAuthStore()
const route     = useRoute()

const showBanner  = ref(false)
const loading     = ref(false)
const deniedState = ref(false)

const DISMISS_KEY   = 'notif_prompt_dismissed_at'
const COOLDOWN_DAYS = 7

let permissionWatcher = null

onMounted(async () => {
    await checkVisibility()

    // Watch for permission changes (works in Chrome/Firefox)
    if ('permissions' in navigator) {
        try {
            permissionWatcher = await navigator.permissions.query({ name: 'notifications' })
            permissionWatcher.addEventListener('change', checkVisibility)
        } catch { /* some browsers throw */ }
    }
})

onUnmounted(() => {
    if (permissionWatcher) {
        permissionWatcher.removeEventListener('change', checkVisibility)
    }
})

const checkVisibility = async () => {
    if (!authStore.user) { showBanner.value = false; return }
    if (route.path === '/login' || route.path === '/landing') { showBanner.value = false; return }
    if (!pushNotificationService.isSupported()) return

    const permission = pushNotificationService.getPermission()

    if (permission === 'granted') {
        // Make sure we're actually subscribed
        const subscribed = await pushNotificationService.isSubscribed()
        if (!subscribed) {
            // Permission granted but not subscribed — silently subscribe
            try { await pushNotificationService.subscribeUser() } catch { /* ignore */ }
        }
        showBanner.value = false
        deniedState.value = false
        return
    }

    if (permission === 'denied') {
        // Show the banner with instructions (no dismiss cooldown for denied state)
        deniedState.value = true
        const dismissedAt = localStorage.getItem(DISMISS_KEY + '_denied')
        if (dismissedAt) {
            const diff = Date.now() - parseInt(dismissedAt)
            if (diff < COOLDOWN_DAYS * 24 * 60 * 60 * 1000) return
        }
        showBanner.value = true
        return
    }

    // permission === 'default' — show opt-in prompt
    deniedState.value = false
    const dismissedAt = localStorage.getItem(DISMISS_KEY)
    if (dismissedAt) {
        const diff = Date.now() - parseInt(dismissedAt)
        if (diff < COOLDOWN_DAYS * 24 * 60 * 60 * 1000) return
    }

    const subscribed = await pushNotificationService.isSubscribed()
    if (!subscribed) showBanner.value = true
}

const subscribe = async () => {
    loading.value = true
    try {
        const permission = await pushNotificationService.requestPermission()
        if (permission === 'granted') {
            await pushNotificationService.subscribeUser()
            showBanner.value = false
        } else if (permission === 'denied') {
            deniedState.value = true
        }
    } catch (err) {
        console.error('Subscription failed:', err)
        setTimeout(() => { showBanner.value = false }, 3000)
    } finally {
        loading.value = false
    }
}

const dismiss = () => {
    const key = deniedState.value ? DISMISS_KEY + '_denied' : DISMISS_KEY
    localStorage.setItem(key, Date.now().toString())
    showBanner.value = false
}
</script>
