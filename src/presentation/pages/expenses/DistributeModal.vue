<template>
  <BaseModal
    :model-value="true"
    title="GİDER PAYLAŞTIR"
    icon="⚖️"
    size="sm"
    @close="handleClose"
  >
    <div class="space-y-6">
      <!-- Bilgilendirme Kutusu -->
      <div class="bg-brand-500/[0.05] border border-brand-500/20 rounded-2xl p-5">
        <div class="flex items-start gap-4">
          <div class="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center shrink-0 text-brand-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 class="text-[11px] font-black uppercase tracking-widest text-brand-400 mb-1">Otomatik Paylaştırma</h4>
            <p class="text-xs text-brand-200/70 leading-relaxed font-medium">
              Bu işlem, <b>"Ortak Alan"</b> veya <b>"Mescit"</b> giderlerini tüm aktif kiracılara eşit olarak paylaştırır.
            </p>
          </div>
        </div>
      </div>

      <form @submit.prevent="handleDistribute" class="space-y-6">
        <!-- Dönem -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">Eşleştirilecek Dönem *</span>
          </label>
          <input 
            type="month" 
            v-model="period" 
            class="input input-bordered w-full font-bold !text-lg" 
            required 
          />
        </div>

        <!-- Tip -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">Gider Kategorisi *</span>
          </label>
          <select v-model="utilityType" class="select select-bordered w-full font-bold" required>
            <option value="Electricity">Elektrik Giderleri</option>
            <option value="Water">Su Giderleri</option>
          </select>
        </div>
      </form>
    </div>

    <!-- Footer Butonları -->
    <template #footer>
      <button 
        type="button" 
        class="btn btn-ghost !bg-transparent border border-white/[0.08] text-[#9aa0b4] hover:bg-white/[0.05] flex-1" 
        @click="handleClose" 
        :disabled="loading"
      >
        Vazgeç
      </button>
      <button 
        type="button"
        class="btn btn-primary flex-1" 
        @click="handleDistribute"
        :disabled="loading"
      >
        <span v-if="loading" class="loading loading-spinner loading-xs mr-2"></span>
        <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        Paylaştır
      </button>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue'
import BaseModal from '@/presentation/components/common/BaseModal.vue'
import utilityDebtsService from '@/infrastructure/services/utilityDebtsService'
import { useErrorHandler } from '@/application/composables/useErrorHandler'
import { useNotify } from '@/application/composables/useNotify'

const emit = defineEmits(['close', 'refresh'])
const { showSuccess } = useErrorHandler()
const { notifyError } = useNotify()

const loading = ref(false)
const period = ref(new Date().toISOString().substring(0, 7)) // YYYY-MM
const utilityType = ref('Electricity')

const handleClose = () => {
  if (!loading.value) emit('close')
}

const handleDistribute = async () => {
  loading.value = true
  try {
    const result = await utilityDebtsService.distributeSharedExpense(period.value, utilityType.value)
    
    showSuccess(`${result.message || 'Başarıyla paylaştırıldı.'} (${result.createdDebtsCount} kayıt oluşturuldu)`)
    
    emit('refresh')
    emit('close')
  } catch (error) {
    console.error('Dağıtım hatası:', error)
    notifyError('Hata: ' + (error.message || 'Dağıtım gerçekleştirilemedi. Ortak alan gider kaydının girildiğinden emin olun.'))
  } finally {
    loading.value = false
  }
}
</script>
