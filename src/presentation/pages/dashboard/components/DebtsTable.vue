<template>
  <div class="app-card !p-0 overflow-hidden">
    <!-- Header area -->
    <div class="px-6 py-5 border-b border-slate-100 dark:border-white/[0.05] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <div>
          <h2 class="text-[15px] font-black text-slate-800 dark:text-white leading-none uppercase tracking-tight">Genel Borç Durumu</h2>
          <p class="text-[10px] text-slate-400 dark:text-[#626885] mt-1.5 font-bold uppercase tracking-[0.15em]">{{ filteredDebts.length }} Kayıt Listeleniyor</p>
        </div>
      </div>
      
      <div class="relative max-w-xs w-full">
        <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
          </svg>
        </span>
        <input 
          v-model="search" 
          type="text" 
          placeholder="İsim veya Ünite ara..." 
          class="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-[#151a2e] border border-slate-200 dark:border-white/[0.08] text-[13px] font-bold text-slate-700 dark:text-white rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-[#626885]"
        >
      </div>
    </div>

    <!-- Table content -->
    <div class="overflow-x-auto lg:overflow-visible">
      <table class="w-full border-collapse">
        <thead class="bg-slate-50/50 dark:bg-[#0f1322]/50 border-b border-slate-100 dark:border-white/[0.05]">
          <tr class="text-slate-500 dark:text-[#9aa0b4]">
            <th scope="col" class="text-left px-6 py-4 text-[10px] font-black uppercase tracking-[1.5px]">AD SOYAD/FİRMA</th>
            <th scope="col" class="text-center px-4 py-4 text-[10px] font-black uppercase tracking-[1.5px]">TİP</th>
            <th scope="col" class="text-center px-4 py-4 text-[10px] font-black uppercase tracking-[1.5px]">ÜNİTE</th>
            <th scope="col" @click="sortBy('aidatDebt')" class="text-right px-4 py-4 text-[10px] font-black uppercase tracking-[1.5px] cursor-pointer hover:text-brand-500 transition-colors">
              AİDAT <span v-if="sortKey === 'aidatDebt'" class="ml-1">{{ sortOrder === 1 ? '↑' : '↓' }}</span>
            </th>
            <th scope="col" @click="sortBy('electricityDebt')" class="text-right px-4 py-4 text-[10px] font-black uppercase tracking-[1.5px] cursor-pointer hover:text-brand-500 transition-colors">
              ELEKTRİK <span v-if="sortKey === 'electricityDebt'" class="ml-1">{{ sortOrder === 1 ? '↑' : '↓' }}</span>
            </th>
            <th scope="col" @click="sortBy('waterDebt')" class="text-right px-4 py-4 text-[10px] font-black uppercase tracking-[1.5px] cursor-pointer hover:text-brand-500 transition-colors">
              SU <span v-if="sortKey === 'waterDebt'" class="ml-1">{{ sortOrder === 1 ? '↑' : '↓' }}</span>
            </th>
            <th scope="col" @click="sortBy('totalDebt')" class="text-right px-6 py-4 text-[10px] font-black uppercase tracking-[1.5px] cursor-pointer hover:text-amber-500 transition-colors text-amber-600 dark:text-amber-500">
              TOPLAM <span v-if="sortKey === 'totalDebt'" class="ml-1">{{ sortOrder === 1 ? '↑' : '↓' }}</span>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50 dark:divide-white/[0.03]">
          <tr v-if="loading" v-for="i in 3" :key="i" class="animate-pulse">
            <td colspan="7" class="py-5 px-6"><div class="h-4 bg-slate-100 dark:bg-[#1c2238] rounded w-full"></div></td>
          </tr>
          <tr v-else-if="filteredDebts.length === 0" class="text-center">
            <td colspan="7" class="py-16">
              <div class="flex flex-col items-center gap-2 opacity-40">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0l-8 4-8-4m8 11V17"/></svg>
                <p class="text-[13px] font-bold">Kayıt bulunamadı</p>
              </div>
            </td>
          </tr>
          <tr 
            v-else 
            v-for="item in filteredDebts" 
            :key="item.entityId"
            class="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group"
          >
            <td class="px-6 py-4">
              <div class="text-[13px] font-black text-slate-800 dark:text-white uppercase tracking-wide group-hover:text-brand-500 transition-colors">{{ item.displayName }}</div>
            </td>
            <td class="px-4 py-4 text-center">
              <span 
                class="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm"
                :class="item.entityType === 'Tenant' 
                  ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400' 
                  : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'"
              >
                {{ item.entityType === 'Tenant' ? 'Kiracı' : 'Mal Sahibi' }}
              </span>
            </td>
            <td class="px-4 py-4 text-center">
              <span class="text-[11px] font-black text-slate-500 dark:text-[#9aa0b4] bg-slate-100 dark:bg-white/[0.04] px-2 py-0.5 rounded shadow-sm tabular-nums">{{ item.apartmentNumber || '-' }}</span>
            </td>
            <td class="px-4 py-4 text-right">
              <span class="text-[13.5px] font-bold tabular-nums" 
                :class="item.aidatDebt > 0 ? 'text-slate-800 dark:text-[#f1f3f9]' : 'text-slate-300 dark:text-[#1c2238]'">
                {{ formatCurrency(item.aidatDebt) }}
              </span>
            </td>
            <td class="px-4 py-4 text-right">
              <span class="text-[13.5px] font-bold tabular-nums" 
                :class="item.electricityDebt > 0 ? 'text-slate-800 dark:text-[#f1f3f9]' : 'text-slate-300 dark:text-[#1c2238]'">
                {{ formatCurrency(item.electricityDebt) }}
              </span>
            </td>
            <td class="px-4 py-4 text-right">
              <span class="text-[13.5px] font-bold tabular-nums" 
                :class="item.waterDebt > 0 ? 'text-slate-800 dark:text-[#f1f3f9]' : 'text-slate-300 dark:text-[#1c2238]'">
                {{ formatCurrency(item.waterDebt) }}
              </span>
            </td>
            <td class="px-6 py-4 text-right">
              <div class="inline-flex flex-col items-end">
                <span class="text-[15px] font-black text-amber-500 tabular-nums tracking-tighter">{{ formatCurrency(item.totalDebt) }}</span>
                <div v-if="item.totalDebt > 0" class="w-full h-0.5 bg-amber-500/20 rounded-full mt-0.5"></div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Info Footer -->
    <div class="px-6 py-4 bg-slate-50/50 dark:bg-[#0f1322]/30 border-t border-slate-100 dark:border-white/[0.05] flex flex-col sm:flex-row justify-between items-center gap-3">
      <div class="text-[11px] font-bold text-slate-400 dark:text-[#626885] uppercase tracking-widest">
        Aktif Filtreleme: <span class="text-slate-600 dark:text-white">{{ search || 'Tümü' }}</span>
      </div>
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2 text-[10px] font-black text-slate-500 dark:text-[#9aa0b4] uppercase tracking-widest">
          <span class="w-1.5 h-1.5 rounded-full bg-indigo-500 ring-4 ring-indigo-500/10"></span> Kiracı
        </div>
        <div class="flex items-center gap-2 text-[10px] font-black text-slate-500 dark:text-[#9aa0b4] uppercase tracking-widest">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/10"></span> Mal Sahibi
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { formatCurrency } from '@/core/utils/currencyUtils'

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
