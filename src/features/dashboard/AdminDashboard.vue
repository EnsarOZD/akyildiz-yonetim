<template>
  <div class="p-4 sm:p-6 lg:p-8 space-y-6 bg-base-200 min-h-screen">
    
    <!-- Üst İstatistikler -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <!-- Toplam Kiracı -->
      <div class="stat bg-base-100 shadow rounded-box">
        <div class="stat-figure text-secondary">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a3.004 3.004 0 01-2.732 2.732M11 16V7a3 3 0 013-3h2M11 16h2m-4.5-4.5H7.571a3 3 0 00-2.732 2.732" /></svg>
        </div>
        <div class="stat-title">Toplam Kiracı</div>
        <div class="stat-value text-secondary">{{ totalTenants }}</div>
        <div class="stat-desc">Sistemdeki aktif kiracılar</div>
      </div>

      <!-- Toplam Mal Sahibi -->
      <div class="stat bg-base-100 shadow rounded-box">
        <div class="stat-figure text-accent">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <div class="stat-title">Toplam Mal Sahibi</div>
        <div class="stat-value text-accent">{{ totalOwners }}</div>
        <div class="stat-desc">Sistemdeki mülk sahipleri</div>
      </div>
    </div>

    <!-- Sekmeler -->
    <div role="tablist" class="tabs tabs-bordered tabs-lg">
      <a v-for="tab in tabs" :key="tab.key" role="tab"
         :class="['tab', { 'tab-active': activeTab === tab.key }]"
         @click="activeTab = tab.key">
        {{ tab.icon }} {{ tab.label }}
      </a>
    </div>

    <!-- Sekme İçerikleri -->
    <div class="mt-6">
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <keep-alive>
            <div>
              <!-- Aidat Tanımlama -->
              <div v-if="activeTab === 'dues'">
                <AidatPanel />
              </div>
  
              <!-- Mal Sahibi Aidatları -->
              <div v-if="activeTab === 'ownerDues'">
                <OwnerDuesPanel />
              </div>

              <!-- Mal Sahipleri -->
              <div v-if="activeTab === 'owners'">
                <Owners />
              </div>
  
              <!-- Kullanıcı Yönetimi -->
              <div v-if="activeTab === 'users'">
                <UserManagement />
              </div>
            </div>
          </keep-alive>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AidatPanel from '../expenses/AidatPanel.vue'
import UserManagement from './UserManagement.vue'
import OwnerDuesPanel from '../expenses/OwnerDuesPanel.vue'
import Owners from '../owners/Owners.vue'
import tenantsService from '@/services/tenantsService'
// Eğer varsa ownersService ve usersService de eklenmeli
// import ownersService from '@/services/ownersService'
// import usersService from '@/services/usersService'

const activeTab = ref('dues')
const tabs = [
  { key: 'dues', label: 'Aidat Tanımlama', icon: '📆' },
  { key: 'ownerDues', label: 'Mal Sahibi Aidatları', icon: '🏠' },
  { key: 'owners', label: 'Mal Sahipleri', icon: '🧑‍💼' },
  { key: 'users', label: 'Kullanıcı Yönetimi', icon: '👥' }
]

const totalTenants = ref(0)
const totalOwners = ref(0)
const totalUsers = ref(0)

const fetchStats = async () => {
  try {
    // Kiracı istatistikleri
    const tenantStats = await tenantsService.getTenantStats()
    totalTenants.value = tenantStats?.activeCount || tenantStats?.totalCount || 0

    // Mal sahibi ve kullanıcı istatistikleri için benzer şekilde eklenebilir
    // const ownerStats = await ownersService.getOwnerStats()
    // totalOwners.value = ownerStats?.totalCount || 0
    // const userStats = await usersService.getUserStats()
    // totalUsers.value = userStats?.totalCount || 0
  } catch (error) {
    console.error('İstatistikleri çekerken hata oluştu:', error)
  }
}

onMounted(fetchStats)
</script>
