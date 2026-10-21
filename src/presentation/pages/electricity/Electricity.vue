<template>
  <div class="p-4 sm:p-10 min-h-screen pb-24 md:pb-10">
    <div class="max-w-6xl mx-auto space-y-6">
      <PageHeader title="Elektrik" subtitle="Sayaç okumaları ve dönemlik elektrik dağıtımı" />

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

      <!-- Task 9: PeriodList.vue -->
      <div v-if="activeTab === 'periods'" class="app-card p-6 text-sm text-slate-500">
        Dönem listesi yakında.
      </div>

      <!-- Task 9: PeriodDetail.vue -->
      <div v-else-if="activeTab === 'detail'" class="app-card p-6 text-sm text-slate-500">
        Dönem detayı yakında.
      </div>

      <MeterSettings v-else-if="activeTab === 'meters'" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import PageHeader from '@/presentation/components/ui/PageHeader.vue'
import MeterSettings from './components/MeterSettings.vue'

const route = useRoute()

// Seçili dönem ?period=<id> sorgu parametresinde tutulur
const selectedPeriodId = computed(() => {
  const p = route.query.period
  return typeof p === 'string' && p ? p : ''
})

const activeTab = ref(selectedPeriodId.value ? 'detail' : 'periods')

watch(selectedPeriodId, (id) => {
  if (id) activeTab.value = 'detail'
  else if (activeTab.value === 'detail') activeTab.value = 'periods'
})

const tabs = computed(() => {
  const list = [{ label: 'Dönemler', value: 'periods' }]
  if (selectedPeriodId.value) list.push({ label: 'Dönem Detayı', value: 'detail' })
  list.push({ label: 'Sayaçlar', value: 'meters' })
  return list
})
</script>
