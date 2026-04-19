<template>
  <div class="p-4 sm:p-6 min-h-screen dark:bg-base-200">
    <div class="max-w-7xl mx-auto">
      
      <!-- Başlık -->
      <PageHeader title="Mal Sahibi Ödemeleri" subtitle="Mal sahipleri tarafından gerçekleştirilen tüm ödeme kayıtlarını listeleyin">
        <template #icon>
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </template>
        <template #actions>
          <div class="flex items-center gap-3">
            <div class="flex flex-col items-end">
              <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Toplam Tahsilat</span>
              <span class="text-sm font-bold text-slate-700 dark:text-[#f1f3f9]">{{ formatCurrency(totalAmount) }}</span>
            </div>
            <div class="w-px h-8 bg-slate-200 dark:bg-[#1c2238] mx-1"></div>
            <div class="flex flex-col items-end">
              <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Bu Ay</span>
              <span class="text-sm font-bold text-emerald-500">{{ formatCurrency(thisMonthPayments) }}</span>
            </div>
          </div>
        </template>
      </PageHeader>

      <!-- Filtreler -->
      <div class="bg-white dark:bg-[#0f1322] p-6 rounded-xl shadow-md border border-gray-200 dark:border-white/[0.07] mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="label">Arama</label>
            <input 
              v-model="searchTerm" 
              type="text" 
              placeholder="Mal sahibi adı veya açıklama ara..." 
              class="input input-bordered w-full"
            />
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
            <label class="label">Yıl</label>
            <select v-model="filterYear" class="select select-bordered w-full">
              <option value="">Tümü</option>
              <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
            </select>
          </div>
          <div>
            <label class="label">Ay</label>
            <select v-model="filterMonth" class="select select-bordered w-full">
              <option value="">Tümü</option>
              <option v-for="month in months" :key="month.value" :value="month.value">{{ month.label }}</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Tablo -->
      <div class="bg-white dark:bg-[#0f1322] rounded-xl shadow-md border border-gray-200 dark:border-white/[0.07] overflow-hidden">
        <div class="overflow-x-auto">
          <table class="table w-full">
            <thead class="bg-slate-50 dark:bg-[#1c2238]">
              <tr>
                <th scope="col" class="text-left p-4">Mal Sahibi</th>
                <th scope="col" class="text-left p-4">Kat</th>
                <th scope="col" class="text-left p-4">Ödeme Türü</th>
                <th scope="col" class="text-left p-4">Açıklama</th>
                <th scope="col" class="text-left p-4">Tutar</th>
                <th scope="col" class="text-left p-4">Ödeme Tarihi</th>
                <th scope="col" class="text-left p-4">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="payment in filteredPayments" :key="payment.id" class="border-b border-gray-200 dark:border-white/[0.07] hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td class="p-4">
                  <div>
                    <p class="font-medium text-gray-800 dark:text-[#f1f3f9]">{{ payment.ownerName }}</p>
                    <p class="text-sm text-gray-500 dark:text-[#9aa0b4]">{{ payment.ownerEmail }}</p>
                  </div>
                </td>
                <td class="p-4 text-gray-800 dark:text-[#f1f3f9]">{{ payment.unit }}</td>
                <td class="p-4">
                  <span 
                    :class="{
                      'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-400': payment.type === 'aidat',
                      'bg-brand-100 text-brand-700 dark:bg-blue-900/50 dark:text-brand-400': payment.type === 'su',
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400': payment.type === 'elektrik',
                      'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-[#9aa0b4]': payment.type === 'diger'
                    }"
                    class="px-2 py-1 rounded-full text-xs font-medium"
                  >
                    {{ getPaymentTypeText(payment.type) }}
                  </span>
                </td>
                <td class="p-4 text-gray-800 dark:text-[#f1f3f9]">{{ payment.description || '-' }}</td>
                <td class="p-4">
                  <span class="font-semibold text-green-600 dark:text-green-400">{{ formatCurrency(payment.amount) }}</span>
                </td>
                <td class="p-4 text-gray-800 dark:text-[#f1f3f9]">{{ formatDate(payment.date) }}</td>
                <td class="p-4">
                  <div class="flex items-center gap-2">
                    <button 
                      @click="viewDetails(payment)"
                      class="btn btn-sm btn-outline"
                    >
                      Detay
                    </button>
                    <button 
                      @click="editPayment(payment)"
                      class="btn btn-sm btn-primary"
                    >
                      Düzenle
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Boş durum -->
        <div v-if="filteredPayments.length === 0" class="text-center py-12">
          <div class="bg-gray-100 dark:bg-[#1c2238] text-gray-500 dark:text-[#9aa0b4] rounded-full p-3 w-fit mx-auto mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p class="text-gray-500 dark:text-[#9aa0b4]">Arama kriterlerinize uygun ödeme kaydı bulunamadı.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import PageHeader from '@/presentation/components/ui/PageHeader.vue'
import { useNotify } from '@/application/composables/useNotify'
import apiService from '@/infrastructure/services/api'

const payments = ref([])
const owners = ref([])

const filterYear = ref('')
const filterMonth = ref('')
const searchTerm = ref('')

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

const fetchPayments = async () => {
  try {
    const response = await apiService.get('/owner-payments')
    payments.value = (response || []).map(payment => {
      const owner = owners.value.find(o => o.id === payment.ownerId)
      return {
        ...payment,
        ownerName: owner?.name || 'Bilinmiyor'
      }
    })
  } catch (error) {
    console.error('Ödemeler yüklenirken hata:', error)
    payments.value = []
  }
}

const filteredPayments = computed(() => {
  return payments.value.filter(payment => {
    const matchesYear = !filterYear.value || payment.date?.startsWith(filterYear.value)
    const matchesMonth = !filterMonth.value || payment.date?.startsWith(filterMonth.value)
    const matchesSearch = !searchTerm.value || 
      payment.ownerName?.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      payment.description?.toLowerCase().includes(searchTerm.value.toLowerCase())
    return matchesYear && matchesMonth && matchesSearch
  })
})

const totalAmount = computed(() => {
  return filteredPayments.value.reduce((sum, payment) => sum + Number(payment.amount || 0), 0)
})

const thisMonthPayments = computed(() => {
  const today = new Date()
  const currentMonth = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0')
  
  return payments.value
    .filter(payment => payment.date && payment.date.startsWith(currentMonth))
    .reduce((sum, payment) => sum + Number(payment.amount || 0), 0)
})

const paymentsCount = computed(() => {
  return payments.value.length
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

const viewDetails = (payment) => {
  // Detay modalı veya sayfası açılabilir
  console.log('Detaylar:', payment)
}

const editPayment = (payment) => {
  // Düzenleme modalı veya sayfası açılabilir
  console.log('Düzenle:', payment)
}

const availableYears = computed(() => {
  const years = new Set(payments.value.map(payment => {
    const date = new Date(payment.date)
    return date.getFullYear()
  }))
  return Array.from(years).sort((a, b) => b - a)
})

onMounted(() => {
  fetchOwners().then(() => fetchPayments())
})
</script> 