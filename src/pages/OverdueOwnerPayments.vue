<template>
  <div class="p-4 sm:p-6 bg-gray-50 min-h-screen font-sans dark:bg-gray-900">
    <div class="max-w-7xl mx-auto">
      
      <!-- Başlık -->
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-100">Geciken Mal Sahibi Ödemeleri</h1>
        <div class="flex items-center gap-4">
          <div class="bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 px-3 py-1 rounded-full text-sm">
            Toplam: {{ formatCurrency(totalOverdue) }}
          </div>
          <div class="bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400 px-3 py-1 rounded-full text-sm">
            {{ overdueCount }} geciken ödeme
          </div>
          <div class="bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400 px-3 py-1 rounded-full text-sm">
            Ortalama: {{ formatCurrency(averageOverdue) }}
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
            <label class="label">Gecikme Süresi</label>
            <select v-model="overdueFilter" class="select select-bordered w-full">
              <option value="">Tümü</option>
              <option value="7">7 günden fazla</option>
              <option value="15">15 günden fazla</option>
              <option value="30">30 günden fazla</option>
              <option value="60">60 günden fazla</option>
            </select>
          </div>
          <div>
            <label class="label">Ödeme Türü</label>
            <select v-model="paymentTypeFilter" class="select select-bordered w-full">
              <option value="">Tümü</option>
              <option value="aidat">Aidat</option>
              <option value="su">Su</option>
              <option value="elektrik">Elektrik</option>
              <option value="diger">Diğer</option>
            </select>
          </div>
          <div>
            <label class="label">Sıralama</label>
            <select v-model="sortBy" class="select select-bordered w-full">
              <option value="dueDate">Son Ödeme Tarihi</option>
              <option value="amount">Tutar</option>
              <option value="overdueDays">Gecikme Günü</option>
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
                <th class="text-left p-4">Ödeme Türü</th>
                <th class="text-left p-4">Tutar</th>
                <th class="text-left p-4">Son Ödeme</th>
                <th class="text-left p-4">Gecikme</th>
                <th class="text-left p-4">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="overdue in filteredOverdue" :key="overdue.id" class="border-b border-gray-200 dark:border-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20">
                <td class="p-4">
                  <div>
                    <p class="font-medium text-gray-800 dark:text-gray-100">{{ overdue.ownerName }}</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ overdue.ownerEmail }}</p>
                  </div>
                </td>
                <td class="p-4 text-gray-800 dark:text-gray-100">{{ overdue.unit }}</td>
                <td class="p-4">
                  <span 
                    :class="{
                      'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-400': overdue.type === 'aidat',
                      'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400': overdue.type === 'su',
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400': overdue.type === 'elektrik',
                      'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-400': overdue.type === 'diger'
                    }"
                    class="px-2 py-1 rounded-full text-xs font-medium"
                  >
                    {{ getPaymentTypeText(overdue.type) }}
                  </span>
                </td>
                <td class="p-4">
                  <span class="font-semibold text-red-600 dark:text-red-400">{{ formatCurrency(overdue.amount) }}</span>
                </td>
                <td class="p-4 text-gray-800 dark:text-gray-100">{{ formatDate(overdue.dueDate) }}</td>
                <td class="p-4">
                  <span 
                    :class="{
                      'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400': overdue.overdueDays > 30,
                      'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-400': overdue.overdueDays > 15 && overdue.overdueDays <= 30,
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400': overdue.overdueDays <= 15
                    }"
                    class="px-2 py-1 rounded-full text-xs font-medium"
                  >
                    {{ overdue.overdueDays }} gün
                  </span>
                </td>
                <td class="p-4">
                  <div class="flex items-center gap-2">
                    <button 
                      @click="markAsPaid(overdue.id)"
                      class="btn btn-sm btn-success"
                    >
                      Ödendi
                    </button>
                    <button 
                      @click="sendReminder(overdue)"
                      class="btn btn-sm btn-warning"
                    >
                      Hatırlat
                    </button>
                    <button 
                      @click="viewDetails(overdue)"
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
        <div v-if="filteredOverdue.length === 0" class="text-center py-12">
          <div class="bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 rounded-full p-3 w-fit mx-auto mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p class="text-gray-500 dark:text-gray-400">Geciken ödeme bulunmuyor.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import apiService from '@/services/api'

const overduePayments = ref([])
const owners = ref([])
const loading = ref(false)
const search = ref('')
const overdueFilter = ref('')
const paymentTypeFilter = ref('')
const sortBy = ref('dueDate')

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

const fetchOverduePayments = async () => {
  loading.value = true
  try {
    const response = await apiService.get('/owner-payments/overdue')
    overduePayments.value = (response || []).map(payment => {
      const owner = owners.value.find(o => o.id === payment.ownerId)
      return {
        ...payment,
        ownerName: owner?.name || 'Bilinmiyor'
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
    await apiService.put(`/owner-payments/${paymentId}`, { status: 'paid' })
    await fetchOverduePayments()
  } catch (error) {
    console.error('Ödeme durumu güncellenirken hata:', error)
  }
}

const totalOverdueAmount = computed(() => {
  return overduePayments.value.reduce((sum, payment) => sum + Number(payment.amount || 0), 0)
})

const overdueCount = computed(() => {
  return overduePayments.value.length
})

const averageOverdue = computed(() => {
  if (overdueCount.value === 0) return 0
  return totalOverdueAmount.value / overdueCount.value
})

const getPaymentTypeText = (type) => {
  const types = {
    'aidat': 'Aidat',
    'su': 'Su',
    'elektrik': 'Elektrik',
    'diger': 'Diğer'
  }
  return types[type] || 'Bilinmiyor'
}

const sendReminder = (overdue) => {
  // Hatırlatma gönderme işlemi
  alert(`${overdue.ownerName} için hatırlatma gönderildi.`)
}

const viewDetails = (overdue) => {
  // Detay modalı veya sayfası açılabilir
  console.log('Detaylar:', overdue)
}

const filteredOverdue = computed(() => {
  let filtered = overduePayments.value

  // Arama filtresi
  if (search.value) {
    const searchTerm = search.value.toLowerCase()
    filtered = filtered.filter(due => 
      due.ownerName.toLowerCase().includes(searchTerm) ||
      due.unit.toLowerCase().includes(searchTerm)
    )
  }

  // Gecikme süresi filtresi
  if (overdueFilter.value) {
    const days = parseInt(overdueFilter.value)
    filtered = filtered.filter(due => due.overdueDays >= days)
  }

  // Ödeme türü filtresi
  if (paymentTypeFilter.value) {
    filtered = filtered.filter(due => due.type === paymentTypeFilter.value)
  }

  // Sıralama
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'amount':
        return b.amount - a.amount
      case 'overdueDays':
        return b.overdueDays - a.overdueDays
      case 'dueDate':
      default:
        return new Date(a.dueDate) - new Date(b.dueDate)
    }
  })

  return filtered
})

onMounted(() => {
  fetchOwners().then(() => fetchOverduePayments())
})
</script> 