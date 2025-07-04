<template>
  <div v-if="isManagerOrViewer || userRole === 'tenant'" class="p-4 sm:p-6 bg-gray-50 min-h-screen font-sans dark:bg-gray-900">
    <div class="max-w-7xl mx-auto">
      
      <!-- Başlık -->
      <h1 class="text-3xl font-bold text-gray-800 mb-6 dark:text-gray-100">Geciken Ödemeler</h1>

      <!-- Filtreler -->
      <section class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 mb-8">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Filtreler</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text text-gray-700 dark:text-gray-300">Kiracı</span>
            </label>
            <select v-model="filterTenant" class="select select-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
              <option value="">Tüm Kiracılar</option>
              <option v-for="tenant in uniqueTenants" :key="tenant" :value="tenant">{{ tenant }}</option>
            </select>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text text-gray-700 dark:text-gray-300">Tip</span>
            </label>
            <select v-model="filterType" class="select select-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
              <option value="">Tüm Tipler</option>
              <option value="electricity">Elektrik</option>
              <option value="water">Su</option>
              <option value="aidat">Aidat</option>
            </select>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text text-gray-700 dark:text-gray-300">Dönem</span>
            </label>
            <select v-model="filterPeriod" class="select select-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
              <option value="">Tüm Dönemler</option>
              <option v-for="period in uniquePeriods" :key="period" :value="period">{{ period }}</option>
            </select>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text text-gray-700 dark:text-gray-300">Tutar Aralığı</span>
            </label>
            <select v-model="filterAmountRange" class="select select-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
              <option value="">Tüm Tutarlar</option>
              <option value="0-1000">0 - 1.000 ₺</option>
              <option value="1000-5000">1.000 - 5.000 ₺</option>
              <option value="5000-10000">5.000 - 10.000 ₺</option>
              <option value="10000+">10.000 ₺+</option>
            </select>
          </div>
        </div>

        <!-- Filtre Temizleme Butonu -->
        <div class="mt-4 flex justify-end">
          <button 
            @click="clearFilters" 
            class="btn btn-outline btn-sm"
            :disabled="!hasActiveFilters"
          >
            Filtreleri Temizle
          </button>
        </div>
      </section>

      <!-- Özet Bilgi -->
      <section class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 mb-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100">Geciken Ödeme Listesi</h2>
          <div class="flex items-center gap-3">
            <div v-if="hasActiveFilters" class="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
              Filtrelenmiş
            </div>
            <div class="bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 px-3 py-1 rounded-full text-sm font-medium">
              {{ filteredOverdueItems.length }} adet geciken ödeme
            </div>
          </div>
        </div>
        
        <div v-if="filteredOverdueItems.length > 0" class="space-y-3">
          <div 
            v-for="item in filteredOverdueItems" 
            :key="item.id"
            class="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors duration-200"
          >
            <div class="flex items-center gap-4">
              <div class="bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-full p-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p class="font-semibold text-gray-800 dark:text-gray-100">{{ item.company }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ item.unit }} - {{ item.typeLabel }}</p>
                <p class="text-xs text-gray-400 dark:text-gray-500">Dönem: {{ item.period || '-' }}</p>
              </div>
            </div>
            <div class="text-right">
              <div class="flex items-center justify-end gap-2 mb-1">
                <span class="badge" :class="{
                  'badge-success': item.paymentStatus.status === 'paid',
                  'badge-warning': item.paymentStatus.status === 'partial',
                  'badge-error': item.paymentStatus.status === 'unpaid'
                }">
                  {{ item.paymentStatus.label }}
                </span>
              </div>
              <p class="font-bold text-red-600 dark:text-red-400 text-lg">{{ formatCurrency(item.unpaidAmount) }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">Son Ödeme: {{ item.dueDateFormatted }}</p>
              <div class="flex items-center gap-2 text-xs">
                <span class="text-red-500 dark:text-red-400 font-medium">
                  {{ getDaysOverdue(item.dueDate) }} gün gecikmiş
                </span>
                <span v-if="item.paymentStatus.status === 'partial'" class="text-yellow-600 dark:text-yellow-400">
                  ({{ formatCurrency(item.paidAmount) }} ödendi)
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="text-center py-12">
          <div class="bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 rounded-full p-4 w-fit mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
            {{ hasActiveFilters ? 'Filtrelenmiş Sonuç Yok' : 'Geciken Ödeme Yok' }}
          </h3>
          <p class="text-gray-500 dark:text-gray-400">
            {{ hasActiveFilters ? 'Seçilen kriterlere uygun geciken ödeme bulunmuyor.' : 'Tüm ödemeler zamanında yapılmış.' }}
          </p>
        </div>
      </section>

    </div>
  </div>

  <div v-else class="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="text-center">
      <div class="bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-full p-4 w-fit mx-auto mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <p class="text-gray-500 dark:text-gray-400 text-lg">Bu sayfayı görüntüleme yetkiniz bulunmamaktadır.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import apiService from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const overduePayments = ref([])
const tenants = ref([])
const loading = ref(false)
const authStore = useAuthStore()
const userRole = computed(() => authStore.role)
const userId = computed(() => authStore.userId)

// Filtre değişkenleri
const filterTenant = ref('')
const filterType = ref('')
const filterPeriod = ref('')
const filterAmountRange = ref('')

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('tr-TR', { year: 'numeric', month: 'short', day: 'numeric' })
}

const formatCurrency = (value) => {
  if (value === undefined || value === null || isNaN(value)) return '₺0.00'
  return Number(value).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })
}

const getDaysOverdue = (dueDate) => {
  if (!dueDate) return 0
  const now = new Date()
  const due = new Date(dueDate)
  const diffTime = now - due
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays > 0 ? diffDays : 0
}

// Filtreleme mantığı
const filteredOverdueItems = computed(() => {
  return overduePayments.value.filter(item => {
    // Kiracı filtresi
    const matchesTenant = !filterTenant.value || item.company === filterTenant.value
    
    // Tip filtresi
    const matchesType = !filterType.value || item.type === filterType.value
    
    // Dönem filtresi
    const matchesPeriod = !filterPeriod.value || item.period === filterPeriod.value
    
    // Tutar aralığı filtresi
    const amount = Number(item.amount || 0)
    let matchesAmount = true
    if (filterAmountRange.value) {
      switch (filterAmountRange.value) {
        case '0-1000':
          matchesAmount = amount >= 0 && amount <= 1000
          break
        case '1000-5000':
          matchesAmount = amount > 1000 && amount <= 5000
          break
        case '5000-10000':
          matchesAmount = amount > 5000 && amount <= 10000
          break
        case '10000+':
          matchesAmount = amount > 10000
          break
      }
    }
    
    return matchesTenant && matchesType && matchesPeriod && matchesAmount
  })
})

// Aktif filtre kontrolü
const hasActiveFilters = computed(() => {
  return filterTenant.value || filterType.value || filterPeriod.value || filterAmountRange.value
})

// Filtre temizleme
const clearFilters = () => {
  filterTenant.value = ''
  filterType.value = ''
  filterPeriod.value = ''
  filterAmountRange.value = ''
}

// Benzersiz değerler için computed'lar
const uniqueTenants = computed(() => {
  const tenants = [...new Set(overduePayments.value.map(item => item.company))]
  return tenants.filter(tenant => tenant && tenant !== 'Bilinmiyor').sort()
})

const uniquePeriods = computed(() => {
  const periods = [...new Set(overduePayments.value.map(item => item.period))]
  return periods.filter(period => period).sort().reverse()
})

const fetchTenants = async () => {
  try {
    const response = await apiService.get('/tenants')
    tenants.value = response || []
  } catch (error) {
    console.error('Kiracılar yüklenirken hata:', error)
    tenants.value = []
  }
}

const fetchOverduePayments = async () => {
  loading.value = true
  try {
    const response = await apiService.get('/payments/overdue')
    overduePayments.value = (response || []).map(payment => {
      const tenant = tenants.value.find(t => t.id === payment.tenantId)
      return {
        ...payment,
        tenantName: tenant?.company || 'Bilinmiyor'
      }
    })
  } catch (error) {
    console.error('Geciken ödemeler yüklenirken hata:', error)
    overduePayments.value = []
  } finally {
    loading.value = false
  }
}

const markAsPaid = async (paymentId) => {
  try {
    await apiService.put(`/payments/${paymentId}`, { status: 'paid' })
    await fetchOverduePayments()
  } catch (error) {
    console.error('Ödeme durumu güncellenirken hata:', error)
  }
}

const totalOverdueAmount = computed(() => {
  return overduePayments.value.reduce((sum, payment) => sum + Number(payment.amount || 0), 0)
})

const isManagerOrViewer = computed(() =>
  ['admin', 'manager', 'viewer'].includes(userRole.value)
)

onMounted(() => {
  fetchTenants().then(() => fetchOverduePayments())
})
</script>
