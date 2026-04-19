<template>
  <dialog v-if="isOpen" class="modal" open @keydown.esc="$emit('cancel')">
    <div
      class="modal-box flex flex-col p-0 w-full max-w-[95vw] sm:max-w-sm bg-[#0f1322] border border-white/[0.08] shadow-2xl"
      :style="{ maxHeight: 'min(90dvh, 800px)' }"
    >
      <!-- Header -->
      <div class="flex-shrink-0 flex items-center justify-between px-6 py-5 border-b border-white/[0.08] bg-white/[0.02] rounded-t-2xl">
        <h3 class="text-[13px] font-black text-[#f1f3f9] flex items-center gap-3 uppercase tracking-widest">
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
      <div class="flex-grow overflow-y-auto overscroll-contain px-6 py-8 text-gray-300 text-sm leading-relaxed text-center">
        {{ message }}
      </div>

      <!-- Footer -->
      <div class="flex-shrink-0 flex items-center justify-center gap-3 px-6 py-5 border-t border-white/[0.08] bg-white/[0.01] rounded-b-2xl">
        <button
          type="button"
          class="btn btn-ghost !bg-transparent border border-white/[0.08] text-[#9aa0b4] hover:bg-white/[0.05]"
          :disabled="loading"
          @click="$emit('cancel')"
        >
          {{ cancelLabel }}
        </button>
        <button
          type="button"
          class="btn px-8"
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
    <div class="modal-backdrop bg-[#030509]/80 backdrop-blur-sm transition-all duration-300" @click="$emit('cancel')" />
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
