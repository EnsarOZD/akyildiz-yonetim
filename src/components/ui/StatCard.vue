<template>
  <div class="app-card p-5 flex items-center gap-4">
    <!-- Icon -->
    <div
      class="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
      :class="iconBg"
    >
      <slot name="icon">
        <svg class="w-6 h-6" :class="iconColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      </slot>
    </div>

    <!-- Content -->
    <div class="min-w-0 flex-1">
      <p class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">{{ label }}</p>
      <p class="mt-0.5 text-2xl font-bold text-slate-800 dark:text-slate-100 leading-none">{{ value }}</p>
      <p v-if="sub" class="mt-1 text-xs text-slate-500 dark:text-slate-400 truncate">{{ sub }}</p>
    </div>

    <!-- Trend badge (optional) -->
    <div v-if="trend !== undefined" class="flex-shrink-0">
      <span
        class="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
        :class="trend >= 0 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'"
      >
        <svg v-if="trend >= 0" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 15l7-7 7 7" />
        </svg>
        <svg v-else class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
        </svg>
        {{ Math.abs(trend) }}%
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label:     { type: String, required: true },
  value:     { type: [String, Number], required: true },
  sub:       { type: String, default: '' },
  trend:     { type: Number, default: undefined },
  color:     { type: String, default: 'blue' }, // blue | green | red | amber | purple | slate
})

const palettes = {
  blue:   { bg: 'bg-blue-100 dark:bg-blue-900/30',   icon: 'text-blue-600 dark:text-blue-400' },
  green:  { bg: 'bg-emerald-100 dark:bg-emerald-900/30', icon: 'text-emerald-600 dark:text-emerald-400' },
  red:    { bg: 'bg-red-100 dark:bg-red-900/30',     icon: 'text-red-600 dark:text-red-400' },
  amber:  { bg: 'bg-amber-100 dark:bg-amber-900/30', icon: 'text-amber-600 dark:text-amber-400' },
  purple: { bg: 'bg-violet-100 dark:bg-violet-900/30', icon: 'text-violet-600 dark:text-violet-400' },
  slate:  { bg: 'bg-slate-100 dark:bg-slate-700',    icon: 'text-slate-500 dark:text-slate-400' },
}

const iconBg    = computed(() => (palettes[props.color] || palettes.blue).bg)
const iconColor = computed(() => (palettes[props.color] || palettes.blue).icon)
</script>
