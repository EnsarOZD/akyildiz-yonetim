<template>
    <dialog open class="modal">
      <div class="modal-box max-w-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center gap-2">
            <div class="bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300 rounded-full p-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2M4 7h16" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100">Aidat Kaydı Sil</h3>
          </div>
          <button @click="$emit('close')" class="btn btn-ghost btn-xs">✕</button>
        </div>
  
        <p class="text-sm text-gray-600 dark:text-gray-300">
          <strong>{{ record.flatNumber || record.unit || 'Daire' }}</strong> için
          <strong>{{ record.periodYear }}/{{ String(record.periodMonth).padStart(2,'0') }}</strong>
          dönemine ait kayıt silinsin mi?
        </p>
        <p class="text-sm mt-2 text-gray-500 dark:text-gray-400">
          Tutar: <strong>{{ Number(record.amount ?? record.toplamTutar ?? 0).toLocaleString('tr-TR') }} ₺</strong>
        </p>
  
        <div class="mt-6 flex justify-end gap-2">
          <button class="btn btn-outline btn-sm" @click="$emit('close')">İptal</button>
          <button class="btn btn-error btn-sm" :disabled="loading" @click="remove">
            <span v-if="loading" class="loading loading-spinner loading-xs mr-2"></span>
            Sil
          </button>
        </div>
      </div>
    </dialog>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import aidatService from '@/services/aidatService'
  import { useErrorHandler } from '@/composables/useErrorHandler'
  
  const props = defineProps({ record: { type: Object, required: true } })
  const emit = defineEmits(['close', 'deleted'])
  const { showSuccess, handleNetworkError } = useErrorHandler?.() ?? {}
  
  const loading = ref(false)
  
  const remove = async () => {
    loading.value = true
    try {
      await aidatService.deleteAidat(props.record.id)
      showSuccess?.('Aidat kaydı silindi.')
      emit('deleted')
      emit('close')
    } catch (e) {
      handleNetworkError?.(e, { component: 'AidatDeleteModal', action: 'delete' })
    } finally {
      loading.value = false
    }
  }
  </script>
  