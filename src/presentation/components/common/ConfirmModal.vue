<template>
  <dialog v-if="isOpen" class="modal" open @keydown.esc="$emit('cancel')">
    <div
      class="modal-box flex flex-col p-0 w-full max-w-[95vw] sm:max-w-sm"
      :style="{ maxHeight: 'min(90dvh, 800px)' }"
    >
      <!-- Header -->
      <div class="flex-shrink-0 flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-white/[0.07] bg-white dark:bg-[#151a2e] rounded-t-2xl">
        <h3 class="text-lg font-bold text-gray-800 dark:text-[#f1f3f9] flex items-center gap-2">
          {{ title }}
        </h3>
        <button
          @click="$emit('cancel')"
          type="button"
          class="btn btn-sm btn-ghost btn-circle text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 active:scale-95"
          aria-label="Kapat"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="flex-grow overflow-y-auto overscroll-contain px-5 py-5 bg-gray-50 dark:bg-gray-900/30 text-gray-700 dark:text-[#f1f3f9]">
        {{ message }}
      </div>

      <!-- Footer -->
      <div class="flex-shrink-0 flex items-center justify-end gap-3 px-5 py-4 border-t border-gray-200 dark:border-white/[0.07] bg-white dark:bg-[#151a2e] rounded-b-2xl">
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
      </div>
    </div>
    <!-- Backdrop -->
    <div class="modal-backdrop bg-black/50" @click="$emit('cancel')" />
  </dialog>
</template>

<script setup>
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
