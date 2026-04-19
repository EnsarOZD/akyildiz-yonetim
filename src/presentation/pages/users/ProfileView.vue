<template>
  <div class="profile-view max-w-4xl mx-auto pb-20 md:pb-6">
    <PageHeader title="Profil Ayarları" subtitle="Kişisel bilgilerinizi ve uygulama tercihlerinizi yönetin">
      <template #icon>
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </template>
    </PageHeader>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- User Info Card -->
      <div class="md:col-span-1">
        <div class="bg-white dark:bg-[#0f1322] rounded-xl shadow-sm border border-gray-100 dark:border-white/[0.07] p-6 text-center">
          <div class="w-24 h-24 bg-brand-100 dark:bg-brand-500/[0.12] rounded-full flex items-center justify-center mx-auto mb-4 text-brand-600 dark:text-brand-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 class="text-lg font-bold text-gray-900 dark:text-white">{{ authStore.fullName || 'Kullanıcı' }}</h2>
          <p class="text-sm text-gray-500 mb-4">{{ authStore.email }}</p>
          <span class="px-3 py-1 bg-gray-100 dark:bg-[#1c2238] text-gray-600 dark:text-[#f1f3f9] rounded-full text-xs font-semibold uppercase tracking-wider">
            {{ formatRole(authStore.role) }}
          </span>
        </div>
      </div>

      <!-- Settings -->
      <div class="md:col-span-2 space-y-6">
        <!-- Notifications Card -->
        <div class="bg-white dark:bg-[#0f1322] rounded-xl shadow-sm border border-gray-100 dark:border-white/[0.07] overflow-hidden">
          <div class="px-6 py-4 border-b dark:border-white/[0.07] dark:bg-gray-900/50">
            <h3 class="font-bold text-gray-900 dark:text-white">Bildirim Ayarları</h3>
          </div>
          <div class="p-6">
            <div class="flex items-center justify-between">
              <div>
                <h4 class="text-sm font-semibold text-gray-900 dark:text-white">Anlık Bildirimler</h4>
                <p class="text-xs text-gray-500 mt-1">Borç, tahsilat ve duyurular hakkında tarayıcı bildirimi al.</p>
              </div>
              <div class="flex items-center">
                <button 
                  @click="togglePushNotifications"
                  :disabled="toggling"
                  class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                  :class="isSubscribed ? 'bg-brand-500' : 'bg-gray-200 dark:bg-[#1c2238]'"
                >
                  <span 
                    class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                    :class="isSubscribed ? 'translate-x-6' : 'translate-x-1'"
                  />
                </button>
              </div>
            </div>

            <div v-if="permissionStatus === 'denied'" class="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 rounded-lg flex gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p class="text-xs text-red-700 dark:text-red-400">
                Tarayıcı bildirim izni reddedilmiş. Bildirim almak için tarayıcı ayarlarından izni "İzin Ver" olarak değiştirmeniz gerekmektedir.
              </p>
            </div>
          </div>
        </div>

        <!-- Security Card (Placeholder) -->
        <div class="bg-white dark:bg-[#0f1322] rounded-xl shadow-sm border border-gray-100 dark:border-white/[0.07] overflow-hidden">
          <div class="px-6 py-4 border-b dark:border-white/[0.07] dark:bg-gray-900/50">
            <h3 class="font-bold text-gray-900 dark:text-white">Güvenlik</h3>
          </div>
          <div class="p-6">
            <button class="w-full md:w-auto px-4 py-2 bg-gray-100 dark:bg-[#1c2238] text-gray-700 dark:text-[#f1f3f9] rounded-lg text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition">
              Şifre Değiştir
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import PageHeader from '@/presentation/components/ui/PageHeader.vue'
import { useAuthStore } from '@/application/stores/auth'
import { pushNotificationService } from '@/infrastructure/services/pushNotificationService'

const authStore = useAuthStore()

const isSubscribed = ref(false)
const toggling = ref(false)
const permissionStatus = ref('default')

onMounted(async () => {
  permissionStatus.value = pushNotificationService.getPermission()
  isSubscribed.value = await pushNotificationService.isSubscribed()
})

const togglePushNotifications = async () => {
  if (toggling.value) return
  toggling.value = true
  
  try {
    if (isSubscribed.value) {
      await pushNotificationService.unsubscribeUser()
      isSubscribed.value = false
    } else {
      const permission = await pushNotificationService.requestPermission()
      permissionStatus.value = permission
      
      if (permission === 'granted') {
        await pushNotificationService.subscribeUser()
        isSubscribed.value = true
      }
    }
  } catch (error) {
    console.error('Failed to toggle push notifications:', error)
  } finally {
    toggling.value = false
  }
}

const formatRole = (role) => {
  if (!role) return ''
  const roles = {
    'admin': 'Yönetici',
    'manager': 'Müdür',
    'tenant': 'Kiracı',
    'owner': 'Mal Sahibi',
    'observer': 'Gözlemci',
    'dataentry': 'Veri Girişi'
  }
  return roles[role.toLowerCase()] || role
}
</script>
