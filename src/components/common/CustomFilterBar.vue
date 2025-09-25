<template>
  <div class="flex flex-wrap gap-2 items-center">
    <!-- Arama Kutusu -->
    <input
      class="input input-bordered"
      type="text"
      :placeholder="searchPlaceholder"
      :value="search"
      @input="$emit('update:search', $event.target.value)"
    />

    <!-- Gider Tipi (Headless UI Listbox) -->
    <Listbox v-model="selectedType">
      <div class="relative w-48">
        <ListboxButton class="select select-bordered select-sm w-full flex items-center">
          <span v-if="selectedTypeOption">
            <span class="mr-2">{{ selectedTypeOption.icon }}</span>
            {{ selectedTypeOption.label }}
          </span>
          <span v-else>Tip Seç</span>
        </ListboxButton>
        <ListboxOptions class="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto focus:outline-none">
          <ListboxOption
            v-for="opt in selectTypeOptions"
            :key="opt.value"
            :value="opt.value"
            class="cursor-pointer select-none relative py-2 pl-8 pr-4 hover:bg-blue-100 dark:hover:bg-blue-900/30"
          >
            <span class="absolute left-2">{{ opt.icon }}</span>
            <span :class="[selectedType === opt.value ? 'font-semibold text-blue-700 dark:text-blue-300' : 'text-gray-900 dark:text-gray-100']">
              {{ opt.label }}
            </span>
          </ListboxOption>
        </ListboxOptions>
      </div>
    </Listbox>

    <!-- Dönem (Ay/Yıl) Seçici -->
    <input
      type="month"
      class="input input-bordered input-sm"
      :value="period"
      @input="$emit('update:period', $event.target.value)"
    />

    <!-- Tarih Seçici (isteğe bağlı) -->
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
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'

const props = defineProps({
  search: String,
  searchPlaceholder: { type: String, default: 'Ara...' },
  selectType: String,
  selectTypeOptions: Array,
  period: String,
  startDate: String,
  endDate: String
})

const emit = defineEmits([
  'update:search',
  'update:selectType',
  'update:period',
  'update:startDate',
  'update:endDate',
  'clearFilters'
])

const selectedType = ref(props.selectType || '')

watch(() => props.selectType, (val) => {
  selectedType.value = val
})
watch(selectedType, (val) => {
  emit('update:selectType', val)
})

const selectedTypeOption = computed(() => {
  return props.selectTypeOptions?.find(opt => opt.value === selectedType.value)
})

const activeFilterCount = computed(() => {
  let count = 0
  if (props.search && props.search.trim()) count++
  if (selectedType.value && selectedType.value !== 'all' && selectedType.value !== '') count++
  if (props.period) count++
  if (props.startDate) count++
  if (props.endDate) count++
  return count
})

const hasActiveFilters = computed(() => activeFilterCount.value > 0)

const clearAllFilters = () => {
  emit('update:search', '')
  emit('update:selectType', '')
  emit('update:period', '')
  emit('update:startDate', '')
  emit('update:endDate', '')
  emit('clearFilters')
}
</script> 