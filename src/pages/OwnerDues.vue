<template>
  <div class="p-4 sm:p-6 bg-gray-50 min-h-screen font-sans dark:bg-gray-900">
    <div class="max-w-7xl mx-auto">
      
      <!-- Başlık -->
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-100">Mal Sahibi Aidatları</h1>
        <div class="flex items-center gap-4">
          <div class="bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 px-3 py-1 rounded-full text-sm">
            Toplam: {{ formatCurrency(totalDues) }}
          </div>
          <div class="bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 px-3 py-1 rounded-full text-sm">
            Ödenen: {{ formatCurrency(paidDues) }}
          </div>
          <div class="bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 px-3 py-1 rounded-full text-sm">
            Geciken: {{ formatCurrency(overdueDues) }}
          </div>
        </div>
      </div>

      <!-- Filtreler -->
      <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="label">Arama</label>
            <input 
              v-model="search" 
              type="text" 
              placeholder="Mal sahibi adı veya kat ara..." 
              class="input input-bordered w-full"
            />
          </div>
          <div>
            <label class="label">Durum</label>
            <select v-model="statusFilter" class="select select-bordered w-full">
              <option value="">Tümü</option>
              <option value="paid">Ödenmiş</option>
              <option value="unpaid">Ödenmemiş</option>
              <option value="overdue">Geciken</option>
            </select>
          </div>
          <div>
            <label class="label">Yıl</label>
            <select v-model="yearFilter" class="select select-bordered w-full">
              <option value="">Tümü</option>
              <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
            </select>
          </div>
          <div>
            <label class="label">Ay</label>
            <select v-model="monthFilter" class="select select-bordered w-full">
              <option value="">Tümü</option>
              <option v-for="month in months" :key="month.value" :value="month.value">{{ month.label }}</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Tablo -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="table w-full">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="text-left p-4">Mal Sahibi</th>
                <th class="text-left p-4">Kat</th>
                <th class="text-left p-4">Dönem</th>
                <th class="text-left p-4">Tutar</th>
                <th class="text-left p-4">Son Ödeme</th>
                <th class="text-left p-4">Durum</th>
                <th class="text-left p-4">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="due in filteredDues" :key="due.id" class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td class="p-4">
                  <div>
                    <p class="font-medium text-gray-800 dark:text-gray-100">{{ due.ownerName }}</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ due.ownerEmail }}</p>
                  </div>
                </td>
                <td class="p-4 text-gray-800 dark:text-gray-100">{{ due.unit }}</td>
                <td class="p-4 text-gray-800 dark:text-gray-100">{{ due.period }}</td>
                <td class="p-4">
                  <span class="font-semibold text-gray-800 dark:text-gray-100">{{ formatCurrency(due.amount) }}</span>
                </td>
                <td class="p-4 text-gray-800 dark:text-gray-100">{{ formatDate(due.dueDate) }}</td>
                <td class="p-4">
                  <span 
                    :class="{
                      'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400': due.status === 'paid',
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400': due.status !== 'paid' && !due.isOverdue,
                      'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400': due.isOverdue
                    }"
                    class="px-2 py-1 rounded-full text-xs font-medium"
                  >
                    {{ getStatusText(due) }}
                  </span>
                </td>
                <td class="p-4">
                  <div class="flex items-center gap-2">
                    <button 
                      v-if="due.status !== 'paid'"
                      @click="markAsPaid(due.id)"
                      class="btn btn-sm btn-success"
                    >
                      Ödendi
                    </button>
                    <button 
                      @click="viewDetails(due)"
                      class="btn btn-sm btn-outline"
                    >
                      Detay
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Boş durum -->
        <div v-if="filteredDues.length === 0" class="text-center py-12">
          <div class="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-full p-3 w-fit mx-auto mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p class="text-gray-500 dark:text-gray-400">Arama kriterlerinize uygun aidat kaydı bulunamadı.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import apiService from '@/services/api'

const ownerDues = ref([])
const owners = ref([])
const search = ref('')
const statusFilter = ref('')
const yearFilter = ref('')
const monthFilter = ref('')
const loading = ref(false)

const months = [
  { value: '01', label: 'Ocak' },
  { value: '02', label: 'Şubat' },
  { value: '03', label: 'Mart' },
  { value: '04', label: 'Nisan' },
  { value: '05', label: 'Mayıs' },
  { value: '06', label: 'Haziran' },
  { value: '07', label: 'Temmuz' },
  { value: '08', label: 'Ağustos' },
  { value: '09', label: 'Eylül' },
  { value: '10', label: 'Ekim' },
  { value: '11', label: 'Kasım' },
  { value: '12', label: 'Aralık' }
]

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('tr-TR', { year: 'numeric', month: 'short', day: 'numeric' })
}

const formatCurrency = (value) => {
  if (value === undefined || value === null || isNaN(value)) return '₺0.00'
  return Number(value).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })
}

const fetchOwners = async () => {
  try {
    const response = await apiService.get('/owners')
    owners.value = response || []
  } catch (error) {
    console.error('Mal sahipleri yüklenirken hata:', error)
    owners.value = []
  }
}

const fetchOwnerDues = async () => {
  loading.value = true
  try {
    const response = await apiService.get('/owner-dues')
    ownerDues.value = (response || []).map(due => {
      const owner = owners.value.find(o => o.id === due.ownerId)
      const dueDate = new Date(due.dueDate)
      const now = new Date()
      const isOverdue = dueDate < now && !due.status === 'paid'
      
      return {
        ...due,
        ownerName: owner?.name || 'Bilinmiyor',
        ownerEmail: owner?.email || '',
        isOverdue
      }
    })
  } catch (error) {
    console.error('Mal sahibi aidatları yüklenirken hata:', error)
    ownerDues.value = []
  } finally {
    loading.value = false
  }
}

const availableYears = computed(() => {
  const years = new Set(ownerDues.value.map(due => due.period?.slice(0, 4)))
  return Array.from(years).filter(Boolean).sort((a, b) => b - a)
})

const filteredDues = computed(() => {
  let filtered = ownerDues.value

  // Arama filtresi
  if (search.value) {
    const searchTerm = search.value.toLowerCase()
    filtered = filtered.filter(due => 
      due.ownerName.toLowerCase().includes(searchTerm) ||
      due.unit.toLowerCase().includes(searchTerm)
    )
  }

  // Durum filtresi
  if (statusFilter.value) {
    if (statusFilter.value === 'paid') {
      filtered = filtered.filter(due => due.status === 'paid')
    } else if (statusFilter.value === 'unpaid') {
      filtered = filtered.filter(due => due.status !== 'paid' && !due.isOverdue)
    } else if (statusFilter.value === 'overdue') {
      filtered = filtered.filter(due => due.isOverdue)
    }
  }

  // Yıl filtresi
  if (yearFilter.value) {
    filtered = filtered.filter(due => due.period?.slice(0, 4) === yearFilter.value)
  }

  // Ay filtresi
  if (monthFilter.value) {
    filtered = filtered.filter(due => due.period?.slice(5, 7) === monthFilter.value)
  }

  return filtered.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate))
})

const totalDues = computed(() => {
  return ownerDues.value.reduce((sum, due) => sum + Number(due.amount || 0), 0)
})

const paidDues = computed(() => {
  return ownerDues.value.filter(due => due.status === 'paid')
})

const overdueDues = computed(() => {
  return ownerDues.value
    .filter(due => due.isOverdue)
    .reduce((sum, due) => sum + Number(due.amount || 0), 0)
})

const getStatusText = (due) => {
  if (due.status === 'paid') return 'Ödendi'
  if (due.isOverdue) return 'Geciken'
  return 'Bekliyor'
}

const markAsPaid = async (dueId) => {
  try {
    await apiService.put(`/owner-dues/${dueId}`, { status: 'paid' })
    await fetchOwnerDues()
  } catch (error) {
    console.error('Aidat durumu güncellenirken hata:', error)
  }
}

const viewDetails = (due) => {
  // Detay modalı veya sayfası açılabilir
  console.log('Detaylar:', due)
}

onMounted(() => {
  fetchOwners().then(() => fetchOwnerDues())
})
</script> 