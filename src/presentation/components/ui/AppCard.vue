<template>
  <div
    class="app-card"
    :class="[
      padded ? 'p-5' : '',
      hoverable ? 'transition-shadow duration-200 hover:shadow-card-md cursor-pointer' : '',
      $attrs.class
    ]"
    v-bind="{ ...$attrs, class: undefined }"
  >
    <slot />
  </div>
</template>

<script setup>
defineProps({
  padded:    { type: Boolean, default: true },
  hoverable: { type: Boolean, default: false },
})
defineOptions({ inheritAttrs: false })
</script>
