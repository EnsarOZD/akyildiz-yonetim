<template>
  <dialog open class="modal" @keydown.esc.prevent="handleClose">
    <div class="modal-box max-w-sm bg-white dark:bg-[#0f1322] border border-gray-200 dark:border-white/[0.07] shadow-2xl">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4 pb-2 border-b border-gray-100 dark:border-white/[0.07]">
        <h3 class="text-lg font-bold text-gray-800 dark:text-[#f1f3f9] italic">
          Ortak Gider Paylaştır
        </h3>
        <button @click="handleClose" class="btn btn-ghost btn-sm" :disabled="loading">✕</button>
      </div>

      <!-- Info -->
      <div class="text-xs text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/[0.08] p-3 rounded mb-4">
        <p>Bu işlem, seçilen dönem için <b>"Ortak Alan"</b> veya <b>"Mescit"</b> açıklamalı gider kaydını bulur ve tüm aktif kiracılara eşit olarak paylaştırır.</p>
      </div>

      <form @submit.prevent="handleDistribute" class="space-y-4">
        <!-- Dönem -->
        <div class="form-control">
          <label class="label"><span class="label-text font-semibold">Dönem *</span></label>
          <input 
            type="month" 
            v-model="period" 
            class="input input-bordered w-full" 
            required 
          />
        </div>

        <!-- Tip -->
        <div class="form-control">
          <label class="label"><span class="label-text font-semibold">Gider Tipi *</span></label>
          <select v-model="utilityType" class="select select-bordered w-full" required>
            <option value="Electricity">Elektrik</option>
            <option value="Water">Su</option>
          </select>
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-2 pt-4">
          <button type="button" class="btn btn-ghost btn-sm" @click="handleClose" :disabled="loading">İptal</button>
          <button type="submit" class="btn btn-primary btn-sm" :disabled="loading">
            <span v-if="loading" class="loading loading-spinner loading-xs mr-2"></span>
            Paylaştır
          </button>
        </div>
      </form>
    </div>
  </dialog>
</template>

<script setup>
import { ref } from 'vue'
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
