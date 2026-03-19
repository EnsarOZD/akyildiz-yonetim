<template>
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
    <div class="min-w-0">
      <div v-if="$slots.breadcrumb" class="mb-1">
        <slot name="breadcrumb" />
      </div>
      <h1 class="page-title truncate">{{ title }}</h1>
      <p v-if="subtitle" class="page-subtitle">{{ subtitle }}</p>
    </div>
    <div v-if="$slots.actions" class="flex items-center gap-2 flex-shrink-0">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title:    { type: String, required: true },
  subtitle: { type: String, default: '' },
})
</script>
