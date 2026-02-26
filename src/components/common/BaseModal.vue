<template>
  <dialog v-if="modelValue" class="modal" open @keydown.esc="handleClose">
    <div
      class="modal-box flex flex-col p-0 w-full max-w-[95vw] sm:max-w-lg md:max-w-2xl lg:max-w-4xl"
      :class="sizeClass"
      :style="{ maxHeight: 'min(90dvh, 800px)' }"
    >
      <!-- Sticky Header -->
      <div class="flex-shrink-0 flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-t-2xl">
        <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <span v-if="icon" class="text-xl">{{ icon }}</span>
          {{ title }}
        </h3>
        <button
          @click="handleClose"
          type="button"
          class="btn btn-sm btn-ghost btn-circle text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 active:scale-95"
          aria-label="Kapat"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Scrollable Content -->
      <div class="flex-grow overflow-y-auto overscroll-contain px-5 py-5 bg-gray-50 dark:bg-gray-900/30">
        <slot />
      </div>

      <!-- Sticky Footer -->
      <div
        v-if="$slots.footer"
        class="flex-shrink-0 flex items-center justify-end gap-3 px-5 py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-2xl"
      >
        <slot name="footer" />
      </div>
    </div>
    <!-- Backdrop -->
    <div class="modal-backdrop bg-black/50" @click="handleClose" />
  </dialog>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, required: true },
  icon: { type: String, default: '' },
  size: { type: String, default: 'md' }, // sm | md | lg | xl
  isDirty: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'close'])

const sizeClass = computed(() => ({
  'sm:max-w-sm': props.size === 'sm',
  'sm:max-w-lg': props.size === 'md',
  'sm:max-w-2xl': props.size === 'lg',
  'sm:max-w-4xl': props.size === 'xl',
}))

function handleClose() {
  if (props.isDirty) {
    // Faz 2'de ConfirmDialog bileşeni gelince burası değişecek.
    // Şimdilik confirm() yeterli — merkezi yönetim için tek yer.
    const ok = window.confirm('Kaydedilmemiş değişiklikler var. Çıkmak istediğinizden emin misiniz?')
    if (!ok) return
  }
  emit('update:modelValue', false)
  emit('close')
}
</script>
