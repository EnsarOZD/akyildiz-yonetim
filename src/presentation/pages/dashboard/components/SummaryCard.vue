<template>
  <div class="card bg-base-100 shadow-md">
    <div class="card-body text-center">
      <h3 class="text-center text-sm text-base-content/70 font-medium uppercase tracking-wide">{{ title }}</h3>
      <p :class="['text-3xl font-bold', valueClass]">{{ value }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  value: [String, Number],
  valueClass: {
    type: String,
    default: ''
  }
})
</script>
