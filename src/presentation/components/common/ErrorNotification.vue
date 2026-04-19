<template>
  <TransitionGroup
    name="error-notification"
    tag="div"
    class="fixed top-6 right-6 z-[100] space-y-3 max-w-sm w-full"
    role="alert"
    aria-live="assertive"
    aria-atomic="false"
  >
    <div
      v-for="error in errors"
      :key="error.id"
      class="group relative bg-[#0f1322]/90 backdrop-blur-xl border border-red-500/20 shadow-2xl shadow-red-500/10 rounded-2xl p-4 overflow-hidden animate-slide-in"
    >
      <!-- Background Accent Glow -->
      <div class="absolute -right-4 -top-4 w-12 h-12 bg-red-500/10 blur-2xl rounded-full"></div>

      <!-- Main Content -->
      <div class="flex items-start gap-4">
        <!-- Icon -->
        <div class="shrink-0 w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 shadow-inner">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <div class="flex-1 min-w-0 pr-6">
          <h4 class="text-[13px] font-black text-[#f1f3f9] uppercase tracking-tight truncate">
            {{ error.title }}
          </h4>
          <p class="text-[11px] text-[#9aa0b4] font-medium leading-relaxed mt-1 line-clamp-2 italic">
            {{ error.message }}
          </p>
        </div>

        <!-- Close Button -->
        <button
          @click="removeError(error.id)"
          class="absolute top-4 right-4 text-[#626885] hover:text-red-400 transition-colors duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Actions -->
      <div v-if="error.action" class="flex items-center gap-3 mt-4 pt-3 border-t border-white/[0.05]">
        <button
          @click="handleAction(error)"
          class="text-[10px] font-black uppercase tracking-widest bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 active:scale-95 transition-all outline-none"
        >
          {{ error.action }}
        </button>
        
        <button
          @click="showDetails(error)"
          class="text-[10px] font-black uppercase tracking-widest text-[#626885] hover:text-brand-400 transition-colors outline-none"
        >
          Teknik Detaylar
        </button>
      </div>

      <!-- Progress Bar (Auto-hide logic) -->
      <div class="absolute bottom-0 left-0 h-[3px] bg-red-900/20 w-full overflow-hidden">
        <div
          class="h-full bg-red-500 transition-all duration-100 ease-linear shadow-[0_0_8px_rgba(239,68,68,0.5)]"
          :style="{ width: `${error.progress}%` }"
        ></div>
      </div>
    </div>
  </TransitionGroup>

  <!-- Error Details Modal -->
  <BaseModal
    v-if="selectedError"
    :model-value="!!selectedError"
    title="HATA ANALİZ RAPORU"
    icon="⚠️"
    size="md"
    @close="selectedError = null"
  >
    <div class="space-y-6">
      <div class="bg-red-500/5 border border-red-500/10 rounded-2xl p-5 space-y-2">
        <h4 class="text-xs font-black text-red-400 uppercase tracking-widest">Hata Özeti</h4>
        <p class="text-sm font-bold text-[#f1f3f9] leading-relaxed">
          {{ selectedError.title }}: {{ selectedError.message }}
        </p>
      </div>

      <!-- Technical Code Block -->
      <div v-if="selectedError.technicalDetails" class="space-y-2">
        <h4 class="text-[10px] font-black text-[#626885] uppercase tracking-widest px-1">Teknik Sistem Yanıtı</h4>
        <div class="bg-[#080b14] border border-white/[0.08] rounded-2xl p-5 overflow-hidden group">
          <pre class="text-[10px] font-mono text-brand-400 custom-scrollbar overflow-x-auto leading-relaxed max-h-64 scroll-smooth">
            {{ JSON.stringify(selectedError.technicalDetails, null, 2) }}
          </pre>
        </div>
      </div>

      <!-- Meta Info -->
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-white/[0.02] border border-white/[0.08] rounded-xl p-3">
          <span class="text-[9px] font-black text-[#626885] uppercase tracking-widest block mb-1">Zaman Damgası</span>
          <span class="text-[10px] font-bold text-[#9aa0b4]">{{ formatDate(selectedError.timestamp) }}</span>
        </div>
        <div v-if="selectedError.context?.component" class="bg-white/[0.02] border border-white/[0.08] rounded-xl p-3">
          <span class="text-[9px] font-black text-[#626885] uppercase tracking-widest block mb-1">Kaynak Modül</span>
          <span class="text-[10px] font-bold text-[#9aa0b4]">{{ selectedError.context.component }}</span>
        </div>
      </div>
    </div>

    <template #footer>
      <button 
        class="btn btn-primary w-full font-black uppercase tracking-widest shadow-lg shadow-brand-500/10" 
        @click="selectedError = null"
      >
        Anladım, Kapat
      </button>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { errorHandler, ERROR_MESSAGES } from '@/core/utils/errorHandler'
import BaseModal from '@/presentation/components/common/BaseModal.vue'

const errors = ref([])
const selectedError = ref(null)

const addError = (error) => {
  const errorId = Date.now() + Math.random()
  const errorData = {
    id: errorId,
    title: error.title || 'Hata',
    message: error.message || 'Beklenmeyen bir hata oluştu.',
    action: error.action,
    type: error.type,
    timestamp: error.timestamp,
    context: error.context,
    technicalDetails: error.originalError,
    progress: 100
  }

  errors.value.push(errorData)

  const timer = setInterval(() => {
    const errorIndex = errors.value.findIndex(e => e.id === errorId)
    if (errorIndex !== -1) {
      errorData.progress -= (100 / 50) // 5 seconds (50 * 100ms)
      if (errorData.progress <= 0) {
        removeError(errorId)
        clearInterval(timer)
      }
    } else {
      clearInterval(timer)
    }
  }, 100)
}

const removeError = (errorId) => {
  const index = errors.value.findIndex(e => e.id === errorId)
  if (index !== -1) {
    errors.value.splice(index, 1)
  }
}

const handleAction = (error) => {
  switch (error.action) {
    case 'Tekrar Dene':
      window.location.reload()
      break
    case 'Giriş Yap':
      window.location.href = '/login'
      break
    case 'Ana Sayfaya Dön':
      window.location.href = '/dashboard'
      break
    case 'Geri Dön':
      window.history.back()
      break
    default:
      console.log('Action:', error.action)
  }
  removeError(error.id)
}

const showDetails = (error) => {
  selectedError.value = error
}

const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleString('tr-TR')
}

const errorListener = (payload) => {
  const isSuccessLike = ['success', 'info', 'warning'].includes(payload.type)
  if (isSuccessLike) return

  const defaults = ERROR_MESSAGES[payload.type] || {
    title: 'Hata',
    message: 'Beklenmeyen bir hata oluştu.',
    action: 'Tekrar Dene'
  }

  addError({
    title: payload.title || defaults.title,
    message: payload.message || defaults.message,
    action: payload.action || defaults.action,
    type: 'error',
    timestamp: payload.timestamp,
    context: payload.context,
    originalError: payload.originalError
  })
}

onMounted(() => errorHandler.addListener(errorListener))
onUnmounted(() => errorHandler.removeListener(errorListener))

</script>

<style scoped>
.error-notification-enter-active,
.error-notification-leave-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.error-notification-enter-from {
  opacity: 0;
  transform: translateX(40px) scale(0.95);
}

.error-notification-leave-to {
  opacity: 0;
  transform: translateX(20px) scale(0.9);
}

.error-notification-move {
  transition: transform 0.4s ease;
}

@keyframes slide-in {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}
</style> 