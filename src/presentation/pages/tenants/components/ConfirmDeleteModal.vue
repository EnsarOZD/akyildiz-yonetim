<template>
  <dialog
    class="modal"
    :open="visible"
    role="alertdialog"
    aria-modal="true"
    aria-labelledby="dc-title"
    aria-describedby="dc-desc"
    @keydown.esc.prevent.stop="onCancel"
  >
    <!-- DaisyUI: backdrop tıklamasıyla kapat -->
    <form method="dialog" class="modal-backdrop" @click.prevent="onCancel"></form>

    <div class="modal-box max-w-md bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl">
      <!-- Başlık -->
      <div class="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700 mb-6">
        <h3 id="dc-title" class="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <span class="text-2xl">⚠️</span>
          {{ title }}
        </h3>
        <button
          type="button"
          @click="onCancel"
          :disabled="loading"
          :class="['btn btn-sm btn-ghost', loading ? 'btn-disabled' : '']"
          class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- İçerik -->
      <div class="py-4">
        <div class="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg mb-4">
          <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
          </svg>
          <p id="dc-desc" class="text-gray-700 dark:text-gray-300">
            <strong class="text-red-600 dark:text-red-400">{{ displayName }}</strong>
            {{ message || 'kaydını silmek istediğinize emin misiniz?' }}
          </p>
        </div>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Not: Silme işlemi geri alınamaz olabilir; yetkilerinize göre ilişkili veriler etkilenebilir.
        </p>
      </div>

      <!-- Butonlar -->
      <div class="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          @click="onCancel"
          :disabled="loading"
          :class="['btn btn-outline border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700', loading ? 'btn-disabled' : '']"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          {{ cancelLabel }}
        </button>

        <button
          type="button"
          @click="onConfirm"
          :disabled="loading"
          :class="['btn btn-error bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 border-0 text-white shadow-lg', loading ? 'btn-disabled' : '']"
        >
          <svg v-if="!loading" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
          <span v-else class="loading loading-spinner loading-sm mr-2"></span>
          {{ confirmLabel }}
        </button>
      </div>
    </div>
  </dialog>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  tenant: { type: Object, default: null },
  visible: { type: Boolean, default: false },
  title:   { type: String,  default: 'Silme Onayı' },
  message: { type: String,  default: '' },
  confirmLabel: { type: String, default: 'Evet, Sil' },
  cancelLabel:  { type: String, default: 'İptal' },
  loading: { type: Boolean, default: false }
})

const emit = defineEmits(['confirm', 'cancel'])

const displayName = computed(() =>
  props.tenant?.companyName
  || [props.tenant?.firstName, props.tenant?.lastName].filter(Boolean).join(' ')
  || 'bu kayıt'
)

function onCancel () {
  if (props.loading) return
  emit('cancel')
}

function onConfirm () {
  if (props.loading) return
  emit('confirm')
}
</script>
