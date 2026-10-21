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

      <PeriodList v-if="activeTab === 'periods'" @open="openPeriod" />

      <PeriodDetail v-else-if="activeTab === 'detail' && selectedPeriodId" :period-id="selectedPeriodId" @back="closePeriod" />

      <MeterSettings v-else-if="activeTab === 'meters'" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PageHeader from '@/presentation/components/ui/PageHeader.vue'
import MeterSettings from './components/MeterSettings.vue'
import PeriodList from './components/PeriodList.vue'
import PeriodDetail from './components/PeriodDetail.vue'

const route = useRoute()
const router = useRouter()

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

const openPeriod = (id) => {
  // Sekme, sorgu parametresi değişince watch ile 'detail' olur
  if (selectedPeriodId.value === id) activeTab.value = 'detail'
  else router.push({ query: { ...route.query, period: id } })
}

const closePeriod = () => {
  const query = { ...route.query }
  delete query.period
  router.push({ query })
}

const tabs = computed(() => {
  const list = [{ label: 'Dönemler', value: 'periods' }]
  if (selectedPeriodId.value) list.push({ label: 'Dönem Detayı', value: 'detail' })
  list.push({ label: 'Sayaçlar', value: 'meters' })
  return list
})
</script>
