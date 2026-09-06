<template>
  <BaseModal
    :model-value="true"
    title="KAYIT SİL"
    icon="🗑️"
    size="sm"
    @close="$emit('close')"
  >
    <div class="space-y-6">
      <!-- Uyarı İkonu ve Mesajı -->
      <div class="flex flex-col items-center text-center space-y-4">
        <div class="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 shadow-lg shadow-red-500/5 transition-transform hover:scale-110">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2M4 7h16" />
          </svg>
        </div>
        
        <div class="space-y-2">
          <p class="text-[13.5px] font-black text-[#16283a] uppercase tracking-tight leading-relaxed">
            <span class="text-red-600">{{ record.flatNumber || record.unit || 'Daire' }}</span> kaydı siliniyor
          </p>
          <p class="text-xs text-[#8298ab] font-medium px-4">
            <strong>{{ record.periodYear }}/{{ String(record.periodMonth).padStart(2,'0') }}</strong> dönemine ait bu kayıt kalıcı olarak silinecektir.
          </p>
        </div>
      </div>

      <!-- Bilgi Kartı -->
      <div class="bg-[#f6fafd] border border-[#d9e7f2] rounded-2xl p-4 flex justify-between items-center">
        <span class="text-[10px] font-black text-[#8298ab] uppercase tracking-widest">Silinecek Tutar</span>
        <span class="text-lg font-black text-red-600 tabular-nums">
          {{ Number(record.amount ?? record.toplamTutar ?? 0).toLocaleString('tr-TR') }} ₺
        </span>
      </div>
    </div>

    <!-- Footer Butonları -->
    <template #footer>
      <button 
        type="button"
        class="btn btn-ghost !bg-transparent border border-[#d9e7f2] text-[#5a7186] hover:bg-[#ecf3f9] flex-1" 
        @click="$emit('close')"
      >
        Vazgeç
      </button>
      <button 
        type="button"
        class="btn btn-error flex-1" 
        :disabled="loading" 
        @click="remove"
      >
        <span v-if="loading" class="loading loading-spinner loading-xs mr-2"></span>
        <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2M4 7h16" />
        </svg>
        Evet, Sil
      </button>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue'
import BaseModal from '@/presentation/components/common/BaseModal.vue'
import aidatService from '@/infrastructure/services/aidatService'
import { useErrorHandler } from '@/application/composables/useErrorHandler'

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