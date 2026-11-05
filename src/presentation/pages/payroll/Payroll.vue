<template>
  <div class="p-4 sm:p-10 min-h-screen pb-24 md:pb-10">
    <div class="max-w-7xl mx-auto space-y-6">
      <PageHeader title="Personel & Maaş" subtitle="Aylık maaş dönemleri, ödemeler, bordro, kıdem tazminatı ve yıllık izin fonları">
        <template #actions>
          <button type="button" class="btn btn-outline btn-sm" @click="showHistory = true">Geçmiş bordroları yükle</button>
        </template>
      </PageHeader>

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

      <PeriodTab v-if="activeTab === 'period'" :key="periodKeyNonce" />
      <EmployeesTab v-else-if="activeTab === 'employees'" />
      <div v-else-if="activeTab === 'severance'" class="space-y-4" data-testid="payroll-funds-tab">
        <div role="tablist" class="tabs tabs-bordered">
          <button
            v-for="f in fundTabs"
            :key="f.value"
            type="button"
            role="tab"
            class="tab"
            :class="{ 'tab-active': activeFund === f.value }"
            @click="activeFund = f.value"
          >{{ f.label }}</button>
        </div>
        <SeveranceTab :key="activeFund" :fund="activeFund" />
      </div>

      <HistoryImportModal v-model="showHistory" @imported="periodKeyNonce++" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import PageHeader from '@/presentation/components/ui/PageHeader.vue'
import PeriodTab from './components/PeriodTab.vue'
import EmployeesTab from './components/EmployeesTab.vue'
import SeveranceTab from './components/SeveranceTab.vue'
import HistoryImportModal from './components/HistoryImportModal.vue'

const tabs = [
  { value: 'period', label: 'Maaş Dönemi' },
  { value: 'employees', label: 'Personel' },
  { value: 'severance', label: 'Fonlar' }
]

const fundTabs = [
  { value: 'Severance', label: 'Kıdem' },
  { value: 'AnnualLeave', label: 'Yıllık izin' }
]
const activeFund = ref('Severance')

const STORAGE_KEY = 'payroll.activeTab'
const readTab = () => {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    return tabs.some(t => t.value === v) ? v : 'period'
  } catch {
    return 'period'
  }
}
const showHistory = ref(false)
const periodKeyNonce = ref(0) // içe aktarım sonrası dönem sekmesini yeniden yükler
const activeTab = ref(readTab())
watch(activeTab, (v) => {
  try { localStorage.setItem(STORAGE_KEY, v) } catch { /* yoksay */ }
})
</script>
