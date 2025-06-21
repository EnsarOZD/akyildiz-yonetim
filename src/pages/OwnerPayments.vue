<template>
  <div class="p-4 sm:p-6 bg-gray-50 min-h-screen font-sans dark:bg-gray-900">
    <div class="max-w-7xl mx-auto">
      
      <!-- Başlık -->
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-100">Mal Sahibi Ödemeleri</h1>
        <div class="flex items-center gap-4">
          <div class="bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400 px-3 py-1 rounded-full text-sm">
            Toplam: {{ formatCurrency(totalPayments) }}
          </div>
          <div class="bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 px-3 py-1 rounded-full text-sm">
            Bu Ay: {{ formatCurrency(thisMonthPayments) }}
          </div>
          <div class="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-sm">
            {{ paymentsCount }} ödeme
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
                <th class="text-left p-4">Ödeme Türü</th>
                <th class="text-left p-4">Açıklama</th>
                <th class="text-left p-4">Tutar</th>
                <th class="text-left p-4">Ödeme Tarihi</th>
                <th class="text-left p-4">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="payment in filteredPayments" :key="payment.id" class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td class="p-4">
                  <div>
                    <p class="font-medium text-gray-800 dark:text-gray-100">{{ payment.ownerName }}</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ payment.ownerEmail }}</p>
                  </div>
                </td>
                <td class="p-4 text-gray-800 dark:text-gray-100">{{ payment.unit }}</td>
                <td class="p-4">
                  <span 
                    :class="{
                      'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-400': payment.type === 'aidat',
                      'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400': payment.type === 'su',
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400': payment.type === 'elektrik',
                      'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-400': payment.type === 'diger'
                    }"
                    class="px-2 py-1 rounded-full text-xs font-medium"
                  >
                    {{ getPaymentTypeText(payment.type) }}
                  </span>
                </td>
                <td class="p-4 text-gray-800 dark:text-gray-100">{{ payment.description || '-' }}</td>
                <td class="p-4">
                  <span class="font-semibold text-green-600 dark:text-green-400">{{ formatCurrency(payment.amount) }}</span>
                </td>
                <td class="p-4 text-gray-800 dark:text-gray-100">{{ formatDate(payment.date) }}</td>
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
          <div class="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-full p-3 w-fit mx-auto mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p class="text-gray-500 dark:text-gray-400">Arama kriterlerinize uygun ödeme kaydı bulunamadı.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { db } from '../firebase'
import { collection, getDocs } from 'firebase/firestore'

const ownerPayments = ref([])
const owners = ref([])
const search = ref('')
const paymentTypeFilter = ref('')
const yearFilter = ref('')
const monthFilter = ref('')

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

const fetchOwnerPayments = async () => {
  const snapshot = await getDocs(collection(db, 'ownerPayments'))
  const payments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  
  // Mal sahibi bilgilerini ekle
  ownerPayments.value = payments.map(payment => {
    const owner = owners.value.find(o => o.id === payment.ownerId)
    return {
      ...payment,
      ownerName: owner?.name || 'Bilinmiyor',
      ownerEmail: owner?.email || ''
    }
  })
}

const fetchOwners = async () => {
  const snapshot = await getDocs(collection(db, 'owners'))
  owners.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

const availableYears = computed(() => {
  const years = new Set(ownerPayments.value.map(payment => {
    const date = new Date(payment.date)
    return date.getFullYear()
  }))
  return Array.from(years).sort((a, b) => b - a)
})

const filteredPayments = computed(() => {
  let filtered = ownerPayments.value

  // Arama filtresi
  if (search.value) {
    const searchTerm = search.value.toLowerCase()
    filtered = filtered.filter(payment => 
      payment.ownerName.toLowerCase().includes(searchTerm) ||
      (payment.description && payment.description.toLowerCase().includes(searchTerm))
    )
  }

  // Ödeme türü filtresi
  if (paymentTypeFilter.value) {
    filtered = filtered.filter(payment => payment.type === paymentTypeFilter.value)
  }

  // Yıl filtresi
  if (yearFilter.value) {
    filtered = filtered.filter(payment => {
      const date = new Date(payment.date)
      return date.getFullYear() == yearFilter.value
    })
  }

  // Ay filtresi
  if (monthFilter.value) {
    filtered = filtered.filter(payment => {
      const date = new Date(payment.date)
      return String(date.getMonth() + 1).padStart(2, '0') === monthFilter.value
    })
  }

  return filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
})

const totalPayments = computed(() => {
  return ownerPayments.value.reduce((sum, payment) => sum + Number(payment.amount || 0), 0)
})

const thisMonthPayments = computed(() => {
  const today = new Date()
  const currentMonth = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0')
  
  return ownerPayments.value
    .filter(payment => payment.date && payment.date.startsWith(currentMonth))
    .reduce((sum, payment) => sum + Number(payment.amount || 0), 0)
})

const paymentsCount = computed(() => {
  return ownerPayments.value.length
})

const formatCurrency = (value) => {
  if (value === undefined || value === null || isNaN(value)) return '₺0.00'
  return Number(value).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('tr-TR')
}

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

onMounted(async () => {
  await fetchOwners()
  await fetchOwnerPayments()
})
</script> 