<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
    <!-- Header area -->
    <div class="p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="p-2 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h2 class="text-xl font-bold text-gray-800 dark:text-gray-100">Genel Borç Durumu</h2>
      </div>
      
      <div class="relative max-w-xs w-full">
        <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
          </svg>
        </span>
        <input 
          v-model="search" 
          type="text" 
          placeholder="Ara: Kiracı, Mal Sahibi veya Ünite..." 
          class="input input-bordered input-sm w-full pl-10 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
        >
      </div>
    </div>

    <!-- Table content -->
    <div class="overflow-x-auto">
      <table class="table w-full">
        <thead class="bg-gray-50/50 dark:bg-gray-700/50">
          <tr class="text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
            <th class="font-semibold text-xs uppercase tracking-wider py-4">AD SOYAD/FİRMA</th>
            <th class="font-semibold text-xs uppercase tracking-wider py-4 text-center">TİP</th>
            <th class="font-semibold text-xs uppercase tracking-wider py-4 text-center">BLOK/NO</th>
            <th @click="sortBy('aidatDebt')" class="font-semibold text-xs uppercase tracking-wider py-4 text-right cursor-pointer hover:text-blue-500">
              AİDAT <span v-if="sortKey === 'aidatDebt'">{{ sortOrder === 1 ? '↑' : '↓' }}</span>
            </th>
            <th @click="sortBy('electricityDebt')" class="font-semibold text-xs uppercase tracking-wider py-4 text-right cursor-pointer hover:text-blue-500">
              ELEKTRİK <span v-if="sortKey === 'electricityDebt'">{{ sortOrder === 1 ? '↑' : '↓' }}</span>
            </th>
            <th @click="sortBy('waterDebt')" class="font-semibold text-xs uppercase tracking-wider py-4 text-right cursor-pointer hover:text-blue-500">
              SU <span v-if="sortKey === 'waterDebt'">{{ sortOrder === 1 ? '↑' : '↓' }}</span>
            </th>
            <th @click="sortBy('totalDebt')" class="font-semibold text-xs uppercase tracking-wider py-4 text-right cursor-pointer hover:text-blue-500 text-orange-600 dark:text-orange-400">
              TOPLAM <span v-if="sortKey === 'totalDebt'">{{ sortOrder === 1 ? '↑' : '↓' }}</span>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
          <tr v-if="loading" v-for="i in 3" :key="i" class="animate-pulse">
            <td colspan="7" class="py-4 px-6"><div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div></td>
          </tr>
          <tr v-else-if="filteredDebts.length === 0" class="text-center py-12">
            <td colspan="7" class="py-12 text-gray-400 italic">Kayıt bulunamadı.</td>
          </tr>
          <tr 
            v-else 
            v-for="item in filteredDebts" 
            :key="item.entityId"
            class="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
          >
            <td class="py-4">
              <div class="font-medium text-gray-800 dark:text-gray-100">{{ item.displayName }}</div>
            </td>
            <td class="py-4 text-center">
              <span 
                class="px-2 py-1 rounded text-[10px] font-bold uppercase transition-all duration-300"
                :class="item.entityType === 'Tenant' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'"
              >
                {{ item.entityType === 'Tenant' ? 'Kiracı' : 'Mal Sahibi' }}
              </span>
            </td>
            <td class="py-4 text-center font-mono text-sm text-gray-600 dark:text-gray-400">
              {{ item.apartmentNumber || '-' }}
            </td>
            <td class="py-4 text-right font-medium" :class="item.aidatDebt > 0 ? 'text-gray-700 dark:text-gray-200' : 'text-gray-300 dark:text-gray-600'">
              {{ formatCurrency(item.aidatDebt) }}
            </td>
            <td class="py-4 text-right font-medium" :class="item.electricityDebt > 0 ? 'text-gray-700 dark:text-gray-200' : 'text-gray-300 dark:text-gray-600'">
              {{ formatCurrency(item.electricityDebt) }}
            </td>
            <td class="py-4 text-right font-medium" :class="item.waterDebt > 0 ? 'text-gray-700 dark:text-gray-200' : 'text-gray-300 dark:text-gray-600'">
              {{ formatCurrency(item.waterDebt) }}
            </td>
            <td class="py-4 text-right font-bold text-gray-900 dark:text-white">
              <div class="p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg inline-block min-w-[100px]">
                {{ formatCurrency(item.totalDebt) }}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Info Footer -->
    <div class="p-4 bg-gray-50 dark:bg-gray-700/30 text-xs text-gray-500 border-t dark:border-gray-700 flex justify-between items-center">
      <div>Toplam {{ filteredDebts.length }} kayıt listeleniyor.</div>
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-1">
          <span class="w-2 h-2 rounded-full bg-indigo-500"></span> Kiracı
        </div>
        <div class="flex items-center gap-1">
          <span class="w-2 h-2 rounded-full bg-emerald-500"></span> Mal Sahibi
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  debts: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const search = ref('')
const sortKey = ref('totalDebt')
const sortOrder = ref(-1) // -1 desc, 1 asc

const formatCurrency = (value) => {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(value || 0)
}

const sortBy = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value * -1
  } else {
    sortKey.value = key
    sortOrder.value = -1
  }
}

const filteredDebts = computed(() => {
  let result = [...props.debts]

  // Filter
  if (search.value) {
    const s = search.value.toLowerCase()
    result = result.filter(d => 
      d.displayName.toLowerCase().includes(s) || 
      (d.apartmentNumber && d.apartmentNumber.toLowerCase().includes(s))
    )
  }

  // Sort
  result.sort((a, b) => {
    const valA = a[sortKey.value] || 0
    const valB = b[sortKey.value] || 0
    return (valA - valB) * sortOrder.value
  })

  return result
})
</script>
