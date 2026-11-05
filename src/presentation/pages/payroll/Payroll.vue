<template>
  <div class="p-4 sm:p-10 min-h-screen pb-24 md:pb-10">
    <div class="max-w-7xl mx-auto space-y-6">
      <PageHeader title="Personel & Maaş" subtitle="Aylık maaş dönemleri, ödemeler, bordro ve kıdem tazminatı fonu" />

      <div role="tablist" class="tabs tabs-boxed bg-base-200 p-1 w-fit max-w-full overflow-x-auto">
        <button
          v-for="t in tabs"
          :key="t.value"
          type="button"
          role="tab"
          class="tab"
          :class="{ 'tab-active': activeTab === t.value }"
          @click="activeTab = t.value"
        >{{ t.label }}</button>
      </div>

      <PeriodTab v-if="activeTab === 'period'" />
      <div v-else class="app-card text-center text-sm text-slate-500 py-10">Bu bölüm yakında eklenecek.</div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import PageHeader from '@/presentation/components/ui/PageHeader.vue'
import PeriodTab from './components/PeriodTab.vue'

const tabs = [
  { value: 'period', label: 'Maaş Dönemi' },
  { value: 'employees', label: 'Personel' },
  { value: 'severance', label: 'Tazminat Fonu' }
]

const STORAGE_KEY = 'payroll.activeTab'
const readTab = () => {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    return tabs.some(t => t.value === v) ? v : 'period'
  } catch {
    return 'period'
  }
}
const activeTab = ref(readTab())
watch(activeTab, (v) => {
  try { localStorage.setItem(STORAGE_KEY, v) } catch { /* yoksay */ }
})
</script>
