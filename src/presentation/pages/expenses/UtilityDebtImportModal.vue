<template>
  <BaseModal
    :model-value="true"
    title="EXCEL'DEN BORÇ AKTARIMI"
    icon="📊"
    size="md"
    @close="$emit('close')"
  >
    <div class="space-y-6">
      <!-- Bilgilendirme -->
      <div class="bg-brand-500/[0.05] border border-brand-500/20 rounded-2xl p-5">
        <div class="flex items-start gap-4">
          <div class="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center shrink-0 text-brand-400 font-bold">ℹ️</div>
          <div>
            <h4 class="text-[11px] font-black uppercase tracking-widest text-brand-400 mb-1">Aktarım Talimatları</h4>
            <ul class="text-[11px] text-brand-200/70 space-y-1.5 font-medium leading-relaxed">
              <li class="flex items-center gap-2"><span class="w-1 h-1 rounded-full bg-brand-400"></span> Firma, Tarih, Ödeme Türü, Tutar, Açıklama sütunları zorunludur.</li>
              <li class="flex items-center gap-2"><span class="w-1 h-1 rounded-full bg-brand-400"></span> Firma ismi Kiracı veya Mülk Sahibi adı ile tam eşleşmelidir.</li>
              <li class="flex items-center gap-2"><span class="w-1 h-1 rounded-full bg-brand-400"></span> Tutar sütunu sadece sayısal (örn: 1250.50) olmalıdır.</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 1. Yükleme Ekranı -->
      <div v-if="!importResult" class="space-y-6">
        <!-- Sürükle Bırak Alanı -->
        <div 
          class="relative group border-2 border-dashed rounded-3xl p-10 transition-all duration-500 text-center overflow-hidden"
          :class="[
            isDragging 
              ? 'border-brand-500 bg-brand-500/[0.08] scale-[1.01]' 
              : 'border-white/[0.08] bg-white/[0.01] hover:border-white/[0.2] hover:bg-white/[0.02]'
          ]"
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop.prevent="handleDrop"
        >
          <!-- Background Glow -->
          <div class="absolute inset-0 bg-gradient-to-b from-brand-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

          <div v-if="!selectedFile" class="relative z-10">
            <div class="w-20 h-20 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center mx-auto mb-6 shadow-xl transition-transform group-hover:scale-110 duration-500">
              <svg class="w-10 h-10 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <p class="text-[13px] font-black text-[#f1f3f9] uppercase tracking-widest mb-2">Excel dosyanızı sürükleyin</p>
            <p class="text-xs text-[#626885] font-bold uppercase tracking-tighter mb-6">veya bilgisayarınızdan seçin</p>
            
            <button @click="$refs.fileInput.click()" class="btn btn-primary px-8 shadow-lg shadow-brand-500/20">
                Dosya Seç
            </button>
          </div>
          
          <div v-else class="relative z-10 flex flex-col items-center">
            <div class="w-20 h-20 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-4 shadow-xl">
               <span class="text-3xl">📄</span>
            </div>
            <div class="mb-6">
              <p class="text-[14px] font-black text-[#f1f3f9] uppercase tracking-tight mb-1">{{ selectedFile.name }}</p>
              <p class="text-[10px] font-bold text-[#626885] uppercase tracking-widest">{{ (selectedFile.size / 1024).toFixed(1) }} KB</p>
            </div>
            <button @click="selectedFile = null" class="btn btn-ghost !bg-red-500/10 text-red-400 hover:bg-red-500/20 px-6">
              Dosyayı Kaldır
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
        <div v-if="importError" class="bg-red-500/10 border border-red-500/20 p-5 rounded-2xl animate-shake">
          <div class="flex items-center gap-3 text-red-400 mb-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span class="text-xs font-black uppercase tracking-widest">Aktarım Hatası</span>
          </div>
          <p class="text-xs text-red-300 font-medium leading-relaxed italic">{{ importError }}</p>
        </div>
      </div>

      <!-- 2. Sonuç Raporu Ekranı -->
      <div v-else class="space-y-6 animate-fade-in">
        <div class="grid grid-cols-2 gap-4">
          <div class="p-5 bg-green-500/5 border border-green-500/10 rounded-2xl text-center">
            <p class="text-[10px] font-black text-[#626885] uppercase tracking-widest mb-2">Başarılı İşlem</p>
            <p class="text-3xl font-black text-green-400 tabular-nums">{{ importResult.successCount }}</p>
          </div>
          <div class="p-5 bg-red-500/5 border border-red-500/10 rounded-2xl text-center">
            <p class="text-[10px] font-black text-[#626885] uppercase tracking-widest mb-2">Hatalı İşlem</p>
            <p class="text-3xl font-black text-red-400 tabular-nums">{{ importResult.failedCount }}</p>
          </div>
        </div>

        <!-- Hata Listesi -->
        <div v-if="importResult.errors && importResult.errors.length > 0" class="space-y-3">
          <h5 class="text-[10px] font-black text-[#626885] uppercase tracking-widest px-1">Hata Detayları</h5>
          <div class="max-h-56 overflow-y-auto border border-white/[0.08] bg-white/[0.01] rounded-2xl p-4 custom-scrollbar">
            <ul class="space-y-3">
              <li v-for="(err, idx) in importResult.errors" :key="idx" class="flex items-start gap-3 p-3 bg-red-500/5 border border-red-500/10 rounded-xl">
                 <span class="text-red-400 font-black text-[10px] mt-1 shrink-0">#{{ idx + 1 }}</span>
                 <p class="text-[11px] text-red-200/80 font-medium leading-relaxed">{{ err }}</p>
              </li>
            </ul>
          </div>
        </div>
        <div v-else class="flex flex-col items-center justify-center py-10 bg-green-500/5 border border-green-500/10 rounded-3xl animate-bounce-subtle">
          <div class="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center text-3xl mb-4">✨</div>
          <p class="text-[13px] font-black text-green-400 uppercase tracking-widest px-6 text-center">
            Tüm kayıtlar hatasız şekilde işlendi
          </p>
        </div>
      </div>
    </div>

    <!-- Footer Butonları -->
    <template #footer>
      <template v-if="!importResult">
        <button @click="$emit('close')" class="btn btn-ghost !bg-transparent border border-white/[0.08] text-[#9aa0b4] hover:bg-white/[0.05] flex-1">Vazgeç</button>
        <button 
          @click="startImport" 
          class="btn btn-primary flex-1 shadow-lg shadow-brand-500/20" 
          :disabled="!selectedFile || isImporting"
        >
          <span v-if="isImporting" class="loading loading-spinner loading-xs mr-2"></span>
          {{ isImporting ? 'Aktarılıyor...' : 'Aktarımı Başlat' }}
        </button>
      </template>
      <template v-else>
        <button @click="$emit('close')" class="btn btn-primary w-full shadow-lg shadow-brand-500/20 font-black uppercase tracking-widest">Pencereyi Kapat</button>
      </template>
    </template>
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
      emit('refresh')
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
