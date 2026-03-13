<template>
  <BaseModal
    :modelValue="isOpen"
    :title="title"
    @update:modelValue="$emit('cancel')"
    size="sm"
  >
    <div class="py-4">
      <p class="text-gray-700 dark:text-gray-300">
        {{ message }}
      </p>
    </div>

    <template #footer>
      <button
        type="button"
        class="btn btn-ghost"
        :disabled="loading"
        @click="$emit('cancel')"
      >
        {{ cancelLabel }}
      </button>
      <button
        type="button"
        class="btn"
        :class="[confirmClass, loading ? 'loading' : '']"
        :disabled="loading"
        @click="$emit('confirm')"
      >
        <span v-if="loading" class="loading loading-spinner loading-xs mr-2"></span>
        {{ confirmLabel }}
      </button>
    </template>
  </BaseModal>
</template>

<script setup>
import BaseModal from './BaseModal.vue'

defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  confirmLabel: {
    type: String,
    default: 'Onayla'
  },
  cancelLabel: {
    type: String,
    default: 'Vazgeç'
  },
  confirmClass: {
    type: String,
    default: 'btn-error'
  },
  loading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['confirm', 'cancel'])
</script>
