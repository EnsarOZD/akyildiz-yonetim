<template>
  <BaseModal :modelValue="true" title="Excel'den Borç Aktarımı" @close="$emit('close')">
    <div class="space-y-6">
      <!-- Bilgilendirme -->
      <div class="bg-brand-50 dark:bg-brand-500/[0.08] border border-brand-100 dark:border-brand-700 p-4 rounded-xl">
        <h3 class="text-brand-700 dark:text-brand-300 font-semibold flex items-center gap-2 mb-2">
          <span>ℹ️</span> Aktarım Talimatları
        </h3>
        <ul class="text-sm text-brand-700 dark:text-brand-400 space-y-1 list-disc list-inside">
          <li>Excel dosyanızda <b>Firma, Tarih, Ödeme Türü, Tutar, Açıklama</b> sütunları bulunmalıdır.</li>
          <li>Firma ismi sistemdeki Kiracı veya Mülk Sahibi adı ile tam eşleşmelidir.</li>
          <li>Ödeme Türü: <b>Aidat, Elektrik, Su</b> gibi değerler alabilir.</li>
          <li>Tutar sütunu sadece sayısal değer içermelidir.</li>
        </ul>
      </div>

      <!-- 1. Yükleme Ekranı -->
      <div v-if="!importResult" class="space-y-6">
        <!-- Sürükle Bırak Alanı -->
        <div 
          class="border-2 border-dash rounded-2xl p-8 transition-all duration-300 text-center"
          :class="[
            isDragging 
              ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/[0.08] scale-[1.02]' 
              : 'border-gray-200 dark:border-white/[0.07] hover:border-gray-300 dark:hover:border-gray-600'
          ]"
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop.prevent="handleDrop"
        >
          <div v-if="!selectedFile">
            <div class="bg-slate-100 dark:bg-[#151a2e] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-3xl">📊</span>
            </div>
            <p class="text-gray-600 dark:text-[#9aa0b4] mb-2">Excel dosyanızı buraya sürükleyin</p>
            <p class="text-xs text-gray-400 mb-4">veya</p>
            <button @click="$refs.fileInput.click()" class="btn btn-primary btn-sm px-6">
                Dosya Seç
            </button>
          </div>
          
          <div v-else class="flex items-center justify-center gap-4">
            <div class="bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 p-3 rounded-lg">
               <span class="text-2xl">📄</span>
            </div>
            <div class="text-left">
              <p class="font-semibold text-gray-800 dark:text-[#f1f3f9]">{{ selectedFile.name }}</p>
              <p class="text-xs text-gray-500">{{ (selectedFile.size / 1024).toFixed(1) }} KB</p>
            </div>
            <button @click="selectedFile = null" class="btn btn-ghost btn-circle btn-sm text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <input 
            type="file" 
            ref="fileInput" 
            class="hidden" 
            accept=".xlsx,.xls" 
            @change="handleFileChange"
          />
        </div>

        <!-- Hata Özeti -->
        <div v-if="importError" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-xl text-sm">
          <p class="text-red-700 dark:text-red-300 font-semibold mb-1">Aktarım Sırasında Bazı Sorunlar Oluştu:</p>
          <p class="text-red-600 dark:text-red-400 italic">{{ importError }}</p>
        </div>
      </div>

      <!-- 2. Sonuç Raporu Ekranı -->
      <div v-else class="space-y-4">
        <div class="flex items-center gap-4 p-4 dark:bg-gray-800/50 rounded-xl">
          <div class="flex-1 text-center border-r dark:border-white/[0.07]">
            <p class="text-xs text-gray-500 mb-1">Başarılı Satır</p>
            <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ importResult.successCount }}</p>
          </div>
          <div class="flex-1 text-center">
            <p class="text-xs text-gray-500 mb-1">Hatalı Satır</p>
            <p class="text-2xl font-bold text-red-600 dark:text-red-400">{{ importResult.failedCount }}</p>
          </div>
        </div>

        <!-- Hata Listesi -->
        <div v-if="importResult.errors && importResult.errors.length > 0" class="space-y-2">
          <p class="text-sm font-semibold text-gray-700 dark:text-[#f1f3f9]">Konum / Hata Detayları:</p>
          <div class="max-h-48 overflow-y-auto border border-gray-100 dark:border-white/[0.05] rounded-xl p-3 dark:bg-gray-800/30 text-xs">
            <ul class="space-y-1 list-disc list-inside text-red-600 dark:text-red-400">
              <li v-for="(err, idx) in importResult.errors" :key="idx">{{ err }}</li>
            </ul>
          </div>
        </div>
        <div v-else class="text-center py-4 bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400 rounded-xl text-sm">
          🎉 Dosyadaki tüm kayıtlar hatasız bir şekilde sisteme işlendi.
        </div>
      </div>

      <!-- Aksiyonlar -->
      <div class="flex justify-end gap-3 pt-4 border-t dark:border-white/[0.07]">
        <!-- İçe aktarma ekranı butonları -->
        <template v-if="!importResult">
          <button @click="$emit('close')" class="btn btn-ghost">Vazgeç</button>
          <button 
            @click="startImport" 
            class="btn btn-primary px-8" 
            :disabled="!selectedFile || isImporting"
          >
            <span v-if="isImporting" class="loading loading-spinner loading-sm"></span>
            {{ isImporting ? 'Aktarılıyor...' : 'Aktarımı Başlat' }}
          </button>
        </template>
        <!-- Sonuç ekranı butonu -->
        <template v-else>
          <button @click="$emit('close')" class="btn btn-primary px-8">Kapat</button>
        </template>
      </div>
    </div>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue'
import BaseModal from '@/presentation/components/common/BaseModal.vue'
import utilityDebtsService from '@/infrastructure/services/utilityDebtsService'
import { useErrorHandler } from '@/application/composables/useErrorHandler'

const emit = defineEmits(['close', 'refresh'])
const { handleNetworkError, showSuccess } = useErrorHandler()

const isDragging = ref(false)
const selectedFile = ref(null)
const isImporting = ref(false)
const importError = ref(null)
const importResult = ref(null)

const handleFileChange = (e) => {
  const file = e.target.files[0]
  if (file) selectedFile.value = file
}

const handleDrop = (e) => {
  isDragging.value = false
  const file = e.dataTransfer.files[0]
  if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
    selectedFile.value = file
  }
}

const startImport = async () => {
  if (!selectedFile.value) return

  isImporting.value = true
  importError.value = null

  try {
    const response = await utilityDebtsService.importUtilityDebtsFromExcel(selectedFile.value)
    
    if (response.data) {
      importResult.value = response.data
      emit('refresh') // Tabloyu arkada güncelle
      showSuccess(response.message || 'Aktarım tamamlandı.')
    } else if (response.isSuccess) {
      showSuccess('Aktarım tamamlandı.')
      emit('refresh')
      emit('close')
    } else {
      importError.value = response.errorMessage || response.message || 'Veri okuma hatası oluştu.'
    }
  } catch (error) {
    handleNetworkError(error)
    importError.value = error.response?.data?.errorMessage || error.response?.data?.message || error.message || 'Beklenmedik bir ağ hatası oluştu.'
  } finally {
    isImporting.value = false
  }
}
</script>
