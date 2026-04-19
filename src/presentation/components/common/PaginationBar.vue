<template>
  <div
    v-if="totalCount > 0"
    class="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-gray-200 dark:border-white/[0.07]"
  >
    <!-- Sol: kayıt bilgisi + sayfa boyutu -->
    <div class="flex items-center gap-3 text-sm text-gray-500 dark:text-[#9aa0b4]">
      <span>
        <span class="font-medium text-gray-700 dark:text-[#f1f3f9]">{{ rangeStart }}</span>
        –
        <span class="font-medium text-gray-700 dark:text-[#f1f3f9]">{{ rangeEnd }}</span>
        /
        <span class="font-medium text-gray-700 dark:text-[#f1f3f9]">{{ totalCount }}</span>
        kayıt
      </span>
      <select
        v-if="pageSizeOptions.length > 0"
        :value="pageSize"
        @change="onPageSizeChange"
        class="select select-xs select-bordered bg-white dark:bg-[#1c2238] dark:border-white/[0.1] dark:text-[#f1f3f9]"
      >
        <option v-for="opt in pageSizeOptions" :key="opt" :value="opt">{{ opt }} / sayfa</option>
      </select>
    </div>

    <!-- Sağ: sayfa navigasyonu -->
    <div v-if="totalPages > 1" class="flex items-center gap-1">
      <button
        class="btn btn-sm btn-ghost"
        :disabled="currentPage === 1"
        @click="$emit('update:currentPage', 1)"
        aria-label="İlk sayfa"
      >
        ««
      </button>
      <button
        class="btn btn-sm btn-ghost"
        :disabled="currentPage === 1"
        @click="$emit('update:currentPage', currentPage - 1)"
        aria-label="Önceki sayfa"
      >
        ‹
      </button>

      <button
        v-for="page in displayedPages"
        :key="page"
        class="btn btn-sm"
        :class="page === currentPage ? 'btn-primary' : 'btn-ghost text-gray-700 dark:text-[#f1f3f9]'"
        @click="$emit('update:currentPage', page)"
        :aria-current="page === currentPage ? 'page' : undefined"
      >
        {{ page }}
      </button>

      <button
        class="btn btn-sm btn-ghost"
        :disabled="currentPage >= totalPages"
        @click="$emit('update:currentPage', currentPage + 1)"
        aria-label="Sonraki sayfa"
      >
        ›
      </button>
      <button
        class="btn btn-sm btn-ghost"
        :disabled="currentPage >= totalPages"
        @click="$emit('update:currentPage', totalPages)"
        aria-label="Son sayfa"
      >
        »»
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: { type: Number, required: true },
  totalCount:  { type: Number, required: true },
  pageSize:    { type: Number, required: true },
  pageSizeOptions: { type: Array, default: () => [10, 25, 50, 100] },
})

const emit = defineEmits(['update:currentPage', 'update:pageSize'])

const totalPages = computed(() => Math.max(1, Math.ceil(props.totalCount / props.pageSize)))

const rangeStart = computed(() => props.totalCount === 0 ? 0 : (props.currentPage - 1) * props.pageSize + 1)
const rangeEnd   = computed(() => Math.min(props.currentPage * props.pageSize, props.totalCount))

const displayedPages = computed(() => {
  const total = totalPages.value
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const curr = props.currentPage
  let start = Math.max(1, curr - 3)
  let end   = Math.min(total, curr + 3)

  if (curr <= 4)          end   = Math.min(total, 7)
  if (curr >= total - 3)  start = Math.max(1, total - 6)

  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

function onPageSizeChange(e) {
  emit('update:pageSize', Number(e.target.value))
  emit('update:currentPage', 1)
}
</script>
