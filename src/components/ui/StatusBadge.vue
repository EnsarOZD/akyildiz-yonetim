<template>
  <span
    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
    :class="classes"
  >
    <span v-if="dot" class="w-1.5 h-1.5 rounded-full" :class="dotColor" />
    <slot>{{ label }}</slot>
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label:   { type: String, default: '' },
  variant: { type: String, default: 'default' }, // active | passive | pending | overdue | info | success | warning | error | default
  dot:     { type: Boolean, default: false },
})

const map = {
  active:  { badge: 'badge-active',  dot: 'bg-emerald-500' },
  success: { badge: 'badge-active',  dot: 'bg-emerald-500' },
  passive: { badge: 'badge-passive', dot: 'bg-slate-400'   },
  default: { badge: 'badge-passive', dot: 'bg-slate-400'   },
  pending: { badge: 'badge-pending', dot: 'bg-amber-500'   },
  warning: { badge: 'badge-pending', dot: 'bg-amber-500'   },
  overdue: { badge: 'badge-overdue', dot: 'bg-red-500'     },
  error:   { badge: 'badge-overdue', dot: 'bg-red-500'     },
  info:    { badge: 'badge-info',    dot: 'bg-blue-500'    },
}

const entry    = computed(() => map[props.variant] || map.default)
const classes  = computed(() => entry.value.badge)
const dotColor = computed(() => entry.value.dot)
</script>
