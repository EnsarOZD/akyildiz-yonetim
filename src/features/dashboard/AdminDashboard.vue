<template>
  <div class="p-4 sm:p-6 lg:p-8 space-y-6 bg-base-200 min-h-screen">
    <!-- Üst İstatistikler -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div class="stat bg-base-100 shadow rounded-box">
        <div class="stat-title">Toplam Kiracı</div>
        <div class="stat-value text-secondary">{{ totalTenants }}</div>
        <div class="stat-desc">Sistemdeki aktif kiracılar</div>
      </div>
      <div class="stat bg-base-100 shadow rounded-box">
        <div class="stat-title">Toplam Mal Sahibi</div>
        <div class="stat-value text-accent">{{ totalOwners }}</div>
        <div class="stat-desc">Sistemdeki mülk sahipleri</div>
      </div>
      <div class="bg-base-100 shadow rounded-box flex items-center justify-center p-4">
        <button 
          @click="showAnnouncementModal = true"
          class="btn btn-primary btn-block shadow-lg shadow-primary/20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
          Duyuru Yayınla
        </button>
      </div>
    </div>

    <!-- Sekmeler -->
    <div role="tablist" class="tabs tabs-bordered tabs-lg">
      <a
        v-for="tab in tabs"
        :key="tab.key"
        role="tab"
        :class="['tab', { 'tab-active': activeTab === tab.key }]"
        @click="activeTab = tab.key"
      >
        {{ tab.icon }} {{ tab.label }}
        <span v-if="tab.badge !== undefined" class="badge badge-ghost ml-2">
          {{ tab.badge }}
        </span>
      </a>
    </div>

    <!-- İçerik -->
    <div class="mt-6">
<!-- AdminDashboard.vue (yalnızca içerik bloğu) -->
<div class="card bg-base-100 shadow-xl">
  <div class="card-body">
    <!-- KeepAlive tam olarak 1 child görmek ister -->
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
    </div>

    <!-- Hedefli Bildirim Modal -->
    <TargetedNotificationModal 
      :show="showAnnouncementModal" 
      @close="showAnnouncementModal = false"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import AidatPanel from '../expenses/AidatPanel.vue'
import OwnerDuesPanel from '../expenses/OwnerDuesPanel.vue'
import Owners from '../owners/Owners.vue'
import UserManagement from './UserManagement.vue'
import tenantsService from '@/services/tenantsService'
import TargetedNotificationModal from '../notifications/components/TargetedNotificationModal.vue'

const showAnnouncementModal = ref(false)

const activeTab = ref('dues')

/** 🔐 HER ZAMAN VAR: undefined hatasını keser */
const tabCounts = reactive({
  dues: 0,
  ownerDues: 0,
  owners: 0,
  users: 0,
})

const tabComponents = {
  dues: AidatPanel,
  ownerDues: OwnerDuesPanel,
  owners: Owners,
  users: UserManagement,
}

/** Sekme tanımları (badge’ler null-safe) */
const tabs = computed(() => [
  { key: 'dues',      label: 'Aidat Tanımlama',    icon: '📆', badge: tabCounts.dues },
  { key: 'ownerDues', label: 'Mal Sahibi Aidatları', icon: '🏠', badge: tabCounts.ownerDues },
  { key: 'users',     label: 'Kullanıcı Yönetimi', icon: '👥',  badge: tabCounts.users },
])

const currentComponent = computed(() => tabComponents[activeTab.value] ?? null)




/** Üst istatistikler */
const totalTenants = ref(0)
const totalOwners = ref(0)

async function fetchStats () {
  try {
    const tenantStats = await tenantsService.getTenantStats()
    totalTenants.value = tenantStats?.activeCount ?? tenantStats?.totalCount ?? 0
    // totalOwners değerini ileride ownersService ile doldurursun
  } catch (e) {
    console.error('İstatistik hatası:', e)
  }
}

/** Çocuk bileşenlerden sayıları almak için küçük bir protokol:
 *  child: emit('stats', { dues: X }) gibi yollasın.
 */
function updateTabCounts(payload) {
  if (!payload || typeof payload !== 'object') return
  if ('dues' in payload) tabCounts.dues = Number(payload.dues) || 0
  if ('ownerDues' in payload) tabCounts.ownerDues = Number(payload.ownerDues) || 0
  if ('owners' in payload) tabCounts.owners = Number(payload.owners) || 0
  if ('users' in payload) tabCounts.users = Number(payload.users) || 0
}

onMounted(fetchStats)
</script>
