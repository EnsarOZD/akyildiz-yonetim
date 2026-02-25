<template>
  <div class="notifications-view pb-20 md:pb-6">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Bildirimler</h1>
      <button 
        v-if="notificationsStore.unreadCount > 0"
        @click="notificationsStore.markAllAsRead"
        class="text-sm text-blue-600 hover:underline font-medium"
      >
        Tümünü okundu yap
      </button>
    </div>

    <!-- Filters -->
    <div class="flex gap-2 mb-6">
      <button 
        @click="unreadOnly = false"
        class="px-4 py-2 rounded-full text-sm font-medium transition"
        :class="!unreadOnly ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'"
      >
        Tümü
      </button>
      <button 
        @click="unreadOnly = true"
        class="px-4 py-2 rounded-full text-sm font-medium transition flex items-center gap-2"
        :class="unreadOnly ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'"
      >
        Okunmamış
        <span v-if="notificationsStore.unreadCount > 0" class="inline-flex items-center justify-center w-5 h-5 bg-red-500 text-white text-[10px] rounded-full font-bold">
          {{ notificationsStore.unreadCount }}
        </span>
      </button>
    </div>

    <!-- List -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div v-if="notificationsStore.loading && notificationsStore.items.length === 0" class="p-12 text-center">
        <span class="loading loading-spinner loading-lg text-blue-600"></span>
        <p class="mt-4 text-gray-500">Bildirimler yükleniyor...</p>
      </div>
      
      <div v-else-if="filteredItems.length === 0" class="p-12 text-center">
        <div class="w-16 h-16 bg-gray-50 dark:bg-gray-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
        </div>
        <p class="text-gray-500">{{ unreadOnly ? 'Okunmamış bildiriminiz bulunmuyor.' : 'Henüz bildirim bulunmuyor.' }}</p>
      </div>

      <div v-else class="divide-y dark:divide-gray-700">
        <div 
          v-for="item in filteredItems" 
          :key="item.id"
          class="p-4 md:p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition cursor-pointer relative"
          :class="{'bg-blue-50/50 dark:bg-blue-900/10': !item.isRead}"
          @click="handleNotificationClick(item)"
        >
          <div class="flex items-start gap-4">
            <!-- Icon -->
            <div class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center" :class="getTypeColor(item.type)">
              <svg v-if="item.type === 'Debt'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-1">
                <h3 class="text-sm font-bold text-gray-900 dark:text-white">{{ item.title }}</h3>
                <span class="text-[10px] text-gray-400">{{ formatDate(item.createdAt) }}</span>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{{ item.message }}</p>
            </div>

            <!-- Read indicator -->
            <div v-if="!item.isRead" class="mt-1 w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Load More -->
    <div v-if="hasMore" class="mt-6 flex justify-center">
      <button 
        @click="notificationsStore.fetchMore"
        class="px-6 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition"
        :disabled="notificationsStore.loading"
      >
        <span v-if="notificationsStore.loading" class="loading loading-spinner loading-xs mr-2"></span>
        Daha Fazla Yükle
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useNotificationsStore } from '@/stores/notificationsStore'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import { useRouter } from 'vue-router'

const notificationsStore = useNotificationsStore()
const router = useRouter()
const unreadOnly = ref(false)

onMounted(() => {
    notificationsStore.refresh()
})

const filteredItems = computed(() => {
    if (unreadOnly.value) {
        return notificationsStore.unreadItems
    }
    return notificationsStore.items
})

const hasMore = computed(() => {
    return notificationsStore.items.length < notificationsStore.totalCount && !unreadOnly.value
})

const getTypeColor = (type) => {
    switch (type) {
        case 'Debt': return 'bg-orange-100 text-orange-600 dark:bg-orange-900/30'
        case 'Payment': return 'bg-green-100 text-green-600 dark:bg-green-900/30'
        default: return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30'
    }
}

const formatDate = (date) => {
    if (!date) return ''
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: tr })
}

const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
        await notificationsStore.markAsRead(notification.id)
    }
    
    // Route mapping
    if (notification.type === 'Debt') {
        router.push('/dashboard')
    }
}
</script>
