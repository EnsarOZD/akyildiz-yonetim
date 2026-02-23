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
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import AidatPanel from '../expenses/AidatPanel.vue'
import OwnerDuesPanel from '../expenses/OwnerDuesPanel.vue'
import Owners from '../owners/Owners.vue'
import UserManagement from './UserManagement.vue'
import tenantsService from '@/services/tenantsService'

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
