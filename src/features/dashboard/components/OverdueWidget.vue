<template>
  <router-link 
    to="/overdue" 
    class="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-red-200 dark:hover:border-red-800 transition-all cursor-pointer group relative overflow-hidden"
  >
    <div class="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-32 w-32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>

    <div class="flex flex-col h-full justify-between relative z-10">
      <div class="flex items-start justify-between mb-4">
        <div class="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl group-hover:scale-110 transition-transform">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <span class="badge badge-error badge-sm text-white font-bold">{{ count }} Kiracı</span>
      </div>

      <div>
        <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Geciken Toplam</p>
        <h3 class="text-2xl font-black text-red-600 dark:text-red-400 mt-1">{{ formatCurrency(totalAmount) }}</h3>
        
        <div v-if="oldestDate" class="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-gray-500 dark:text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>En Eski Borç: <span class="text-red-600 dark:text-red-400 font-bold">{{ formatDate(oldestDate) }}</span></span>
        </div>
      </div>

      <div class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <span class="text-xs font-bold text-gray-400 group-hover:text-red-500 transition-colors uppercase tracking-wider">Detayları Gör</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400 group-hover:text-red-500 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  </router-link>
</template>

<script setup>
import { formatCurrency } from '@/utils/currencyUtils'

defineProps({
  count: { type: Number, default: 0 },
  totalAmount: { type: Number, default: 0 },
  oldestDate: { type: [String, Date], default: null }
})

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })
}
</script>
