<template>
  <div class="p-4 sm:p-10 min-h-screen pb-24 md:pb-10 transition-all duration-500">
    <div class="max-w-6xl mx-auto space-y-8">

      <!-- ─── Row 1: Page Header ─── -->
      <PageHeader
        title="Yönetim Paneli"
        subtitle="Mal sahipleri ve sistem kullanıcılarını buradan yönetin"
      >
        <template #icon>
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.094c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.894.15c.542.09.94.56.94 1.109v1.094c0 .55-.398 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738a1.125 1.125 0 01-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527a1.125 1.125 0 01-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15a1.125 1.125 0 01-.94-1.11v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 01.12-1.45l.774-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
        </template>
        <template #actions>
          <button @click="showAnnouncementModal = true" 
            class="btn btn-sm btn-primary gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 0 1 -3.417 .592l-2.147-6.15M18 13a3 3 0 1 0 0-6M5.436 13.683A4.001 4.001 0 0 1 7 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 0 1 -1.564 -.317z"/></svg>
            <span>Duyuru</span>
          </button>
        </template>
      </PageHeader>

      <!-- ─── Row 2: Premium Stats Row ─── -->
      <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up">
        <div class="app-card border-none bg-slate-50 dark:bg-white/[0.02] p-5 flex items-center gap-4 group">
          <div class="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          </div>
          <div>
            <p class="text-premium-label mb-1">Kiracılar</p>
            <p class="text-2xl font-black text-slate-800 dark:text-white">{{ totalTenants }}</p>
          </div>
        </div>

        <div class="app-card border-none bg-slate-50 dark:bg-white/[0.02] p-5 flex items-center gap-4 group">
          <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
          </div>
          <div>
            <p class="text-premium-label mb-1">Mal Sahipleri</p>
            <p class="text-2xl font-black text-slate-800 dark:text-white">{{ tabCounts.owners || '0' }}</p>
          </div>
        </div>

        <div class="app-card border-none bg-slate-50 dark:bg-white/[0.02] p-5 flex items-center gap-4 group">
          <div class="w-12 h-12 rounded-2xl bg-violet-500/10 text-violet-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
          </div>
          <div>
            <p class="text-premium-label mb-1">Kullanıcılar</p>
            <p class="text-2xl font-black text-slate-800 dark:text-white">{{ tabCounts.users || '0' }}</p>
          </div>
        </div>

        <div class="app-card-premium p-5 flex items-center gap-4 border-none bg-brand-gradient shadow-brand-500/20 group">
          <div class="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center shrink-0 group-hover:rotate-12 transition-transform">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
          </div>
          <div>
            <p class="text-[10px] font-black text-white/70 uppercase tracking-widest mb-1">Aktif Duyuru</p>
            <p class="text-2xl font-black text-white">4</p>
          </div>
        </div>
      </section>

      <!-- ─── Row 3: Tabbed Content ─── -->
      <section class="app-card animate-slide-up !p-0 overflow-hidden shadow-2xl shadow-slate-200 dark:shadow-none">
        <!-- Modern Tab Switcher -->
        <div class="flex items-center gap-2 p-3 bg-slate-50 dark:bg-white/[0.02] border-b border-slate-100 dark:border-white/[0.05]">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            @click="activeTab = tab.key"
            :class="[
              'flex items-center gap-3 px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300',
              activeTab === tab.key
                ? 'bg-white dark:bg-[#1c2238] text-brand-500 shadow-sm border border-slate-200 dark:border-white/[0.1] scale-105'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            ]"
          >
            <component :is="tab.icon" class="w-4 h-4" />
            {{ tab.label }}
            <span v-if="tab.badge" 
              class="flex items-center justify-center w-5 h-5 bg-brand-500/10 text-brand-500 rounded-lg text-[9px] font-black">
              {{ tab.badge }}
            </span>
          </button>
        </div>

        <div class="p-6 transition-all duration-500">
          <transition name="fade-slide" mode="out-in">
            <keep-alive v-if="currentComponent">
              <component
                :is="currentComponent"
                :key="activeTab"
                hideHeader
                @refresh-stats="fetchStats"
                @stats="updateTabCounts"
              />
            </keep-alive>
          </transition>
        </div>
      </section>

    </div>

    <!-- Duyuru Modal -->
    <TargetedNotificationModal
      v-if="showAnnouncementModal"
      :show="showAnnouncementModal"
      @close="showAnnouncementModal = false"
    />
  </div>
</template>


<script setup>
import { ref, reactive, computed, onMounted, defineComponent, h } from 'vue'
import PageHeader from '@/presentation/components/ui/PageHeader.vue'
import Owners from '../owners/Owners.vue'
import UserManagement from './UserManagement.vue'
import { useTenantsStore } from '@/application/stores/tenants'
import TargetedNotificationModal from '../notifications/components/TargetedNotificationModal.vue'

const showAnnouncementModal = ref(false)
const activeTab = ref('owners')
const tenantsStore = useTenantsStore()

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
    const tenantStats = await tenantsStore.fetchStats()
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
