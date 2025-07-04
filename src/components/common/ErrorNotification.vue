<template>
  <TransitionGroup
    name="error-notification"
    tag="div"
    class="fixed top-4 right-4 z-50 space-y-2 max-w-md"
  >
    <div
      v-for="error in errors"
      :key="error.id"
      class="bg-white dark:bg-gray-800 border-l-4 border-red-500 shadow-lg rounded-lg p-4 max-w-sm w-full"
    >
      <!-- Header -->
      <div class="flex items-start justify-between">
        <div class="flex items-center gap-3">
          <div class="bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-full p-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 class="font-semibold text-gray-900 dark:text-gray-100 text-sm">
              {{ error.title }}
            </h4>
            <p class="text-gray-600 dark:text-gray-400 text-sm mt-1">
              {{ error.message }}
            </p>
          </div>
        </div>
        
        <!-- Close Button -->
        <button
          @click="removeError(error.id)"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Actions -->
      <div v-if="error.action" class="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
        <button
          @click="handleAction(error)"
          class="text-xs bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 px-3 py-1 rounded-md hover:bg-red-200 dark:hover:bg-red-900/70 transition-colors duration-200"
        >
          {{ error.action }}
        </button>
        
        <button
          @click="showDetails(error)"
          class="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
        >
          Detaylar
        </button>
      </div>

      <!-- Progress Bar -->
      <div class="mt-3 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          class="h-full bg-red-500 transition-all duration-300 ease-linear"
          :style="{ width: `${error.progress}%` }"
        ></div>
      </div>
    </div>
  </TransitionGroup>

  <!-- Error Details Modal -->
  <dialog
    v-if="selectedError"
    class="modal modal-open"
    @click.self="selectedError = null"
  >
    <div class="modal-box max-w-2xl">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-bold text-lg text-gray-900 dark:text-gray-100">
          Hata Detayları
        </h3>
        <button
          @click="selectedError = null"
          class="btn btn-sm btn-circle btn-ghost"
        >
          ✕
        </button>
      </div>

      <div class="space-y-4">
        <!-- Error Info -->
        <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {{ selectedError.title }}
          </h4>
          <p class="text-gray-600 dark:text-gray-400 text-sm">
            {{ selectedError.message }}
          </p>
        </div>

        <!-- Technical Details -->
        <div v-if="selectedError.technicalDetails" class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Teknik Detaylar
          </h4>
          <pre class="text-xs text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-900 p-3 rounded border overflow-x-auto">
            {{ JSON.stringify(selectedError.technicalDetails, null, 2) }}
          </pre>
        </div>

        <!-- Context -->
        <div v-if="selectedError.context" class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Bağlam Bilgileri
          </h4>
          <div class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <div><strong>Zaman:</strong> {{ formatDate(selectedError.timestamp) }}</div>
            <div><strong>Tip:</strong> {{ selectedError.type }}</div>
            <div v-if="selectedError.context.component"><strong>Bileşen:</strong> {{ selectedError.context.component }}</div>
            <div v-if="selectedError.context.action"><strong>İşlem:</strong> {{ selectedError.context.action }}</div>
          </div>
        </div>
      </div>

      <div class="modal-action">
        <button
          @click="selectedError = null"
          class="btn btn-primary btn-sm"
        >
          Kapat
        </button>
      </div>
    </div>
  </dialog>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { errorHandler } from '@/utils/errorHandler'

const errors = ref([])
const selectedError = ref(null)

// Hata ekle
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

  // Otomatik kaldırma için timer
  const timer = setInterval(() => {
    const errorIndex = errors.value.findIndex(e => e.id === errorId)
    if (errorIndex !== -1) {
      errorData.progress -= 2
      if (errorData.progress <= 0) {
        removeError(errorId)
        clearInterval(timer)
      }
    } else {
      clearInterval(timer)
    }
  }, 100)

  // 5 saniye sonra otomatik kaldır
  setTimeout(() => {
    removeError(errorId)
  }, 5000)
}

// Hata kaldır
const removeError = (errorId) => {
  const index = errors.value.findIndex(e => e.id === errorId)
  if (index !== -1) {
    errors.value.splice(index, 1)
  }
}

// Aksiyon işle
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

// Detayları göster
const showDetails = (error) => {
  selectedError.value = error
}

// Tarih formatla
const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleString('tr-TR')
}

// Error handler listener
const errorListener = (error) => {
  // Sadece error tipindeki mesajları göster
  if (error.type === 'error') {
    const displayMessage = error.getDisplayMessage()
    addError({
      ...displayMessage,
      type: error.type,
      timestamp: error.timestamp,
      context: error.context,
      originalError: error.originalError
    })
  }
}

onMounted(() => {
  errorHandler.addListener(errorListener)
})

onUnmounted(() => {
  // Listener'ı kaldır (eğer gerekirse)
})
</script>

<style scoped>
.error-notification-enter-active,
.error-notification-leave-active {
  transition: all 0.3s ease;
}

.error-notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.error-notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.error-notification-move {
  transition: transform 0.3s ease;
}
</style> 