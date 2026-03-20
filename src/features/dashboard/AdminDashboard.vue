<template>
  <div class="p-4 sm:p-6 min-h-screen pb-24 md:pb-6">

    <!-- Sayfa Başlığı -->
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 class="page-title">Yönetim Paneli</h1>
        <p class="page-subtitle">Mal sahipleri ve sistem kullanıcılarını buradan yönetin</p>
      </div>
      <button @click="showAnnouncementModal = true" class="btn btn-sm btn-primary shrink-0">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/>
        </svg>
        Duyuru Yayınla
      </button>
    </div>

    <!-- Özet Kartları -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      <div class="app-card flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
        </div>
        <div class="min-w-0">
          <p class="text-xs text-slate-500 dark:text-slate-400 leading-none mb-1">Kiracılar</p>
          <p class="text-lg font-bold text-slate-800 dark:text-slate-100 leading-none">{{ totalTenants }}</p>
        </div>
      </div>

      <div class="app-card flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
          </svg>
        </div>
        <div class="min-w-0">
          <p class="text-xs text-slate-500 dark:text-slate-400 leading-none mb-1">Mal Sahipleri</p>
          <p class="text-lg font-bold text-slate-800 dark:text-slate-100 leading-none">{{ tabCounts.owners || '—' }}</p>
        </div>
      </div>

      <div class="app-card flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
          </svg>
        </div>
        <div class="min-w-0">
          <p class="text-xs text-slate-500 dark:text-slate-400 leading-none mb-1">Kullanıcılar</p>
          <p class="text-lg font-bold text-slate-800 dark:text-slate-100 leading-none">{{ tabCounts.users || '—' }}</p>
        </div>
      </div>

      <div class="app-card flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
          </svg>
        </div>
        <div class="min-w-0">
          <p class="text-xs text-slate-500 dark:text-slate-400 leading-none mb-1">Duyurular</p>
          <p class="text-lg font-bold text-slate-800 dark:text-slate-100 leading-none">—</p>
        </div>
      </div>
    </div>

    <!-- Sekmeler -->
    <div class="app-card !p-0">
      <!-- Sekme Başlıkları -->
      <div class="flex border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          :class="[
            'flex items-center gap-2 px-5 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors',
            activeTab === tab.key
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          ]"
        >
          <component :is="tab.icon" class="w-4 h-4" />
          {{ tab.label }}
          <span
            v-if="tab.badge"
            class="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
          >
            {{ tab.badge }}
          </span>
        </button>
      </div>

      <!-- Sekme İçeriği -->
      <div class="p-4 sm:p-5">
        <keep-alive v-if="currentComponent">
          <component
            :is="currentComponent"
            :key="activeTab"
            @refresh-stats="fetchStats"
            @stats="updateTabCounts"
          />
        </keep-alive>
      </div>
    </div>

    <!-- Duyuru Modal -->
    <TargetedNotificationModal
      :show="showAnnouncementModal"
      @close="showAnnouncementModal = false"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, defineComponent, h } from 'vue'
import Owners from '../owners/Owners.vue'
import UserManagement from './UserManagement.vue'
import tenantsService from '@/services/tenantsService'
import TargetedNotificationModal from '../notifications/components/TargetedNotificationModal.vue'

const showAnnouncementModal = ref(false)
const activeTab = ref('owners')

const tabCounts = reactive({
  owners: 0,
  users: 0,
})

const tabComponents = {
  owners: Owners,
  users: UserManagement,
}

// SVG icon components for tabs
const OwnersIcon = defineComponent({
  render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '1.75', d: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' })
  ])
})
const UsersIcon = defineComponent({
  render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '1.75', d: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' })
  ])
})

const tabs = computed(() => [
  { key: 'owners', label: 'Mal Sahipleri',      icon: OwnersIcon, badge: tabCounts.owners || null },
  { key: 'users',  label: 'Kullanıcı Yönetimi', icon: UsersIcon,  badge: tabCounts.users || null },
])

const currentComponent = computed(() => tabComponents[activeTab.value] ?? null)

const totalTenants = ref(0)

async function fetchStats() {
  try {
    const tenantStats = await tenantsService.getTenantStats()
    totalTenants.value = tenantStats?.activeCount ?? tenantStats?.totalCount ?? 0
  } catch (e) {
    console.error('İstatistik hatası:', e)
  }
}

function updateTabCounts(payload) {
  if (!payload || typeof payload !== 'object') return
  if ('owners' in payload) tabCounts.owners = Number(payload.owners) || 0
  if ('users'  in payload) tabCounts.users  = Number(payload.users)  || 0
}

onMounted(fetchStats)
</script>
