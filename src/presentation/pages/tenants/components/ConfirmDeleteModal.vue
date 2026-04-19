<template>
  <BaseModal
    :model-value="visible"
    :title="title.toUpperCase()"
    icon="🗑️"
    size="sm"
    @close="onCancel"
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
          <p class="text-[13.5px] font-black text-[#f1f3f9] uppercase tracking-tight leading-relaxed">
            <span class="text-red-400">{{ displayName }}</span> kaydı siliniyor
          </p>
          <p class="text-xs text-[#626885] font-medium px-4">
            {{ message || 'Bu kaydı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.' }}
          </p>
        </div>
      </div>

      <!-- Bilgi Notu -->
      <div class="bg-red-500/5 border border-red-500/10 rounded-2xl p-4">
        <p class="text-[10px] font-bold text-red-300 uppercase tracking-widest text-center italic">
          ⚠️ Kritik Veri: Yetkilerinize göre ilişkili borç ve ödeme kayıtları bu işlemden etkilenebilir.
        </p>
      </div>
    </div>

    <!-- Footer Butonları -->
    <template #footer>
      <button 
        type="button"
        class="btn btn-ghost !bg-transparent border border-white/[0.08] text-[#9aa0b4] hover:bg-white/[0.05] flex-1" 
        @click="onCancel"
        :disabled="loading"
      >
        Vazgeç
      </button>
      <button 
        type="button"
        class="btn btn-error flex-1 font-black uppercase tracking-widest" 
        :disabled="loading" 
        @click="onConfirm"
      >
        <span v-if="loading" class="loading loading-spinner loading-xs mr-2"></span>
        <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2M4 7h16" />
        </svg>
        {{ confirmLabel }}
      </button>
    </template>
  </BaseModal>
</template>

<script setup>
import { computed } from 'vue'
import BaseModal from '@/presentation/components/common/BaseModal.vue'

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
