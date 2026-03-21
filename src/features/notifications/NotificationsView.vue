<template>
  <div class="p-4 sm:p-6 min-h-screen pb-24 md:pb-6">

    <!-- Sayfa Başlığı -->
    <div class="mb-5 flex items-center justify-between gap-3">
      <div>
        <h1 class="page-title">Bildirimler</h1>
        <p class="page-subtitle">Tüm bildirimleriniz ve duyurular</p>
      </div>
      <button
        v-if="canBroadcast"
        @click="showAnnouncementModal = true"
        class="btn btn-sm btn-primary shrink-0"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/>
        </svg>
        Duyuru Yayınla
      </button>
    </div>

    <!-- Filtreler + Tümünü Oku -->
    <div class="flex items-center justify-between gap-2 mb-4">
      <div class="flex gap-1.5">
        <button
          @click="unreadOnly = false"
          :class="['btn btn-xs rounded-full', !unreadOnly ? 'btn-primary' : 'btn-ghost']"
        >
          Tümü
        </button>
        <button
          @click="unreadOnly = true"
          :class="['btn btn-xs rounded-full gap-1.5', unreadOnly ? 'btn-primary' : 'btn-ghost']"
        >
          Okunmamış
          <span v-if="notificationsStore.unreadCount > 0"
            class="inline-flex items-center justify-center w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold">
            {{ notificationsStore.unreadCount > 9 ? '9+' : notificationsStore.unreadCount }}
          </span>
        </button>
      </div>
      <button
        v-if="notificationsStore.unreadCount > 0"
        @click="notificationsStore.markAllAsRead"
        class="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
      >
        Tümünü okundu yap
      </button>
    </div>

    <!-- Liste Kartı -->
    <div class="app-card !p-0">

      <!-- Yükleniyor -->
      <div v-if="notificationsStore.loading && notificationsStore.items.length === 0" class="py-16 flex flex-col items-center gap-3">
        <span class="loading loading-spinner loading-md text-blue-500"></span>
        <p class="text-sm text-slate-400">Bildirimler yükleniyor…</p>
      </div>

      <!-- Boş -->
      <div v-else-if="filteredItems.length === 0" class="py-16 text-center px-4">
        <div class="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-3">
          <svg class="w-7 h-7 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"/>
          </svg>
        </div>
        <p class="text-sm font-medium text-slate-500 dark:text-slate-400">
          {{ unreadOnly ? 'Okunmamış bildirim yok' : 'Henüz bildirim yok' }}
        </p>
        <p class="text-xs text-slate-400 mt-1">
          {{ unreadOnly ? 'Tüm bildirimlerinizi okudunuz.' : 'Yeni borç, tahsilat ve duyurular burada görünür.' }}
        </p>
      </div>

      <!-- Bildirim Listesi -->
      <div v-else class="divide-y divide-slate-100 dark:divide-slate-700/50">
        <div
          v-for="item in filteredItems"
          :key="item.id"
          @click="handleNotificationClick(item)"
          class="relative flex items-start gap-3 px-4 py-3.5 cursor-pointer transition-colors table-row-hover"
          :class="!item.isRead ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''"
        >
          <!-- Okunmamış nokta -->
          <span
            v-if="!item.isRead"
            class="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"
          />

          <!-- Tip İkonu -->
          <div class="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center mt-0.5" :class="getTypeBg(item.type)">
            <!-- Debt -->
            <svg v-if="item.type === 'Debt'" class="w-4 h-4" :class="getTypeColor(item.type)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"/>
            </svg>
            <!-- Payment -->
            <svg v-else-if="item.type === 'Payment' || item.type === 'PaymentCreated'" class="w-4 h-4" :class="getTypeColor(item.type)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <!-- Announcement -->
            <svg v-else-if="item.type === 'Announcement'" class="w-4 h-4" :class="getTypeColor(item.type)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/>
            </svg>
            <!-- Default bell -->
            <svg v-else class="w-4 h-4" :class="getTypeColor(item.type)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
          </div>

          <!-- İçerik -->
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-2">
              <p class="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-tight" :class="!item.isRead ? 'text-slate-900 dark:text-white' : ''">
                {{ item.title }}
              </p>
              <span class="text-[10px] text-slate-400 shrink-0 mt-0.5">{{ formatDate(item.createdAt) }}</span>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed line-clamp-2">
              {{ item.message }}
            </p>
            <!-- Tıklanabilir hint -->
            <div v-if="item.type === 'Debt'" class="flex items-center gap-1 mt-1">
              <span class="text-[10px] text-blue-500 font-medium">Dashboard'a git</span>
              <svg class="w-2.5 h-2.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Daha Fazla Yükle -->
      <div v-if="hasMore" class="border-t border-slate-100 dark:border-slate-700/50">
        <button
          @click="notificationsStore.fetchMore"
          :disabled="notificationsStore.loading"
          class="w-full py-3 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
        >
          <span v-if="notificationsStore.loading" class="loading loading-spinner loading-xs mr-2"></span>
          Daha Fazla Yükle
        </button>
      </div>
    </div>

    <!-- Duyuru Modalı -->
    <TargetedNotificationModal
      :show="showAnnouncementModal"
      @close="showAnnouncementModal = false"
      @success="notificationsStore.refresh()"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useNotificationsStore } from '@/stores/notificationsStore'
import { useAuthStore } from '@/stores/auth'
import TargetedNotificationModal from './components/TargetedNotificationModal.vue'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import { useRouter } from 'vue-router'

const notificationsStore = useNotificationsStore()
const authStore = useAuthStore()
const router = useRouter()
const unreadOnly = ref(false)
const showAnnouncementModal = ref(false)

const canBroadcast = computed(() => {
    const role = authStore.role?.toLowerCase()
    return role === 'admin' || role === 'manager'
})

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

const getTypeBg = (type) => {
    switch (type) {
        case 'Debt':           return 'bg-red-100 dark:bg-red-900/30'
        case 'Payment':
        case 'PaymentCreated': return 'bg-emerald-100 dark:bg-emerald-900/30'
        case 'Announcement':   return 'bg-amber-100 dark:bg-amber-900/30'
        default:               return 'bg-blue-100 dark:bg-blue-900/30'
    }
}

const getTypeColor = (type) => {
    switch (type) {
        case 'Debt':           return 'text-red-600 dark:text-red-400'
        case 'Payment':
        case 'PaymentCreated': return 'text-emerald-600 dark:text-emerald-400'
        case 'Announcement':   return 'text-amber-600 dark:text-amber-400'
        default:               return 'text-blue-600 dark:text-blue-400'
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
