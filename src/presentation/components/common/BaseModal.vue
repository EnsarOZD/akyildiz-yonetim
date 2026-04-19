<template>
  <dialog v-if="modelValue" class="modal" open @keydown.esc="handleClose">
    <div
      ref="modalBoxRef"
      class="modal-box flex flex-col p-0 w-full max-w-[95vw] sm:max-w-lg md:max-w-2xl lg:max-w-4xl bg-[#0f1322] border border-white/[0.08] shadow-2xl"
      :class="sizeClass"
      :style="{ maxHeight: 'min(90dvh, 800px)' }"
    >
      <!-- Sticky Header -->
      <div class="flex-shrink-0 flex items-center justify-between px-6 py-5 border-b border-white/[0.08] bg-white/[0.02] rounded-t-2xl">
        <h3 class="text-[13px] font-black text-[#f1f3f9] flex items-center gap-3 uppercase tracking-widest">
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
      <div class="flex-grow overflow-y-auto overscroll-contain px-6 py-6 scrollbar-thin scrollbar-thumb-white/[0.05]">
        <slot />
      </div>

      <!-- Sticky Footer -->
      <div
        v-if="$slots.footer"
        class="flex-shrink-0 flex items-center justify-end gap-3 px-6 py-5 border-t border-white/[0.08] bg-white/[0.01] rounded-b-2xl"
      >
        <slot name="footer" />
      </div>
    </div>
    <!-- Backdrop -->
    <div class="modal-backdrop bg-[#030509]/80 backdrop-blur-sm transition-all duration-300" @click="handleClose" />
  </dialog>

  <!-- Kaydedilmemiş değişiklik uyarısı -->
  <ConfirmModal
    :isOpen="showUnsavedWarning"
    title="Kaydedilmemiş Değişiklikler"
    message="Kaydedilmemiş değişiklikleriniz var. Yine de çıkmak istiyor musunuz?"
    confirmLabel="Evet, Çık"
    confirmClass="btn-warning"
    @confirm="onUnsavedConfirm"
    @cancel="showUnsavedWarning = false"
  />
</template>

<script setup>
import { ref, computed } from 'vue'
import ConfirmModal from './ConfirmModal.vue'
import { useFocusTrap } from '@/application/composables/useFocusTrap'

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

const modalBoxRef = ref(null)
const showUnsavedWarning = ref(false)

useFocusTrap(modalBoxRef, computed(() => props.modelValue && !showUnsavedWarning.value))

function handleClose() {
  if (props.isDirty) {
    showUnsavedWarning.value = true
    return
  }
  emit('update:modelValue', false)
  emit('close')
}

function onUnsavedConfirm() {
  showUnsavedWarning.value = false
  emit('update:modelValue', false)
  emit('close')
}
</script>
