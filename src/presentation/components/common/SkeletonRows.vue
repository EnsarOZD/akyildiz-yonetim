<template>
  <div class="space-y-3">
    <div
      v-for="i in rows"
      :key="i"
      class="animate-pulse flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-white/[0.07] bg-white dark:bg-[#151a2e]"
    >
      <!-- Avatar placeholder -->
      <div class="shrink-0 h-10 w-10 bg-gray-200 dark:bg-[#1c2238] rounded-full" />
      <!-- Content lines -->
      <div class="flex-1 space-y-2 min-w-0">
        <div class="h-4 bg-gray-200 dark:bg-[#1c2238] rounded w-3/4" />
        <div class="h-3 bg-gray-200 dark:bg-[#1c2238] rounded w-1/2" />
      </div>
      <!-- Action placeholder -->
      <div class="shrink-0 h-8 w-20 bg-gray-200 dark:bg-[#1c2238] rounded-lg" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  rows: { type: Number, default: 5 }
})
</script>
