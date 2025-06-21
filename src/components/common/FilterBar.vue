<template>
  <div class="flex flex-wrap gap-2 items-center">
    <!-- Arama Kutusu -->
    <input
      v-if="search !== undefined"
      class="input input-bordered"
      type="text"
      :placeholder="searchPlaceholder"
      :value="search"
      @input="$emit('update:search', $event.target.value)"
    />

    <!-- Statü Butonları -->
    <template v-if="statusOptions && status !== undefined">
      <button
        v-for="opt in statusOptions"
        :key="opt.value"
        class="btn btn-sm"
        :class="status === opt.value ? opt.activeClass || 'btn-primary' : opt.inactiveClass || 'btn-outline'"
        @click="$emit('update:status', opt.value)"
      >
        {{ opt.label }}
      </button>
    </template>

    <!-- Tip/Butonlar -->
    <template v-if="typeOptions && type !== undefined">
      <button
        v-for="opt in typeOptions"
        :key="opt.value"
        class="btn btn-sm"
        :class="type === opt.value ? opt.activeClass || 'btn-primary' : opt.inactiveClass || 'btn-outline'"
        @click="$emit('update:type', opt.value)"
      >
        {{ opt.label }}
      </button>
    </template>

    <!-- Tarih Aralığı -->
    <input
      v-if="startDate !== undefined"
      type="date"
      class="input input-bordered input-sm"
      :value="startDate"
      @input="$emit('update:startDate', $event.target.value)"
    />
    <input
      v-if="endDate !== undefined"
      type="date"
      class="input input-bordered input-sm"
      :value="endDate"
      @input="$emit('update:endDate', $event.target.value)"
    />

    <!-- Tip (Select/Dropdown) -->
    <select
      v-if="selectTypeOptions && selectType !== undefined"
      class="select select-bordered select-sm"
      :value="selectType"
      @change="$emit('update:selectType', $event.target.value)"
    >
      <option v-for="opt in selectTypeOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
    </select>

    <!-- Dönem (Ay/Yıl) Seçici -->
    <input
      v-if="period !== undefined"
      type="month"
      class="input input-bordered input-sm"
      :value="period"
      @input="$emit('update:period', $event.target.value)"
    />

    <!-- Yıl Seçici -->
    <select
      v-if="yearOptions && year !== undefined"
      class="select select-bordered select-sm"
      :value="year"
      @change="$emit('update:year', $event.target.value)"
    >
      <option v-for="opt in yearOptions" :key="opt" :value="opt">{{ opt }}</option>
    </select>

    <!-- Filtre Temizle Butonu -->
    <button
      v-if="hasActiveFilters"
      class="btn btn-outline btn-sm btn-error"
      @click="clearAllFilters"
      title="Tüm filtreleri temizle"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
      Filtreleri Temizle
    </button>

    <!-- Aktif Filtre Sayısı -->
    <div v-if="activeFilterCount > 0" class="badge badge-info badge-sm">
      {{ activeFilterCount }} filtre aktif
    </div>

    <!-- Ekstra alanlar için slot -->
    <slot></slot>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  search: String,
  searchPlaceholder: { type: String, default: 'Ara...' },
  status: String,
  statusOptions: Array,
  type: String,
  typeOptions: Array,
  startDate: String,
  endDate: String,
  period: String,
  year: String,
  yearOptions: Array,
  selectType: String,
  selectTypeOptions: Array
})

const emit = defineEmits([
  'update:search',
  'update:status', 
  'update:type',
  'update:startDate',
  'update:endDate',
  'update:period',
  'update:year',
  'update:selectType',
  'clearFilters'
])

// Aktif filtre sayısını hesapla
const activeFilterCount = computed(() => {
  let count = 0
  if (props.search && props.search.trim()) count++
  if (props.status && props.status !== 'all') count++
  if (props.type && props.type !== 'all') count++
  if (props.startDate) count++
  if (props.endDate) count++
  if (props.period) count++
  if (props.year) count++
  if (props.selectType && props.selectType !== 'all') count++
  return count
})

// Aktif filtre var mı kontrol et
const hasActiveFilters = computed(() => {
  return activeFilterCount.value > 0
})

// Tüm filtreleri temizle
const clearAllFilters = () => {
  emit('update:search', '')
  emit('update:status', 'all')
  emit('update:type', 'all')
  emit('update:startDate', '')
  emit('update:endDate', '')
  emit('update:period', '')
  emit('update:year', '')
  emit('update:selectType', 'all')
  emit('clearFilters')
}
</script> 