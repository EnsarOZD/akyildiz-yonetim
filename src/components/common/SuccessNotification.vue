<template>
  <TransitionGroup
    name="success-notification"
    tag="div"
    class="fixed top-4 right-4 z-50 space-y-2 max-w-md"
  >
    <div
      v-for="notification in notifications"
      :key="notification.id"
      :class="getNotificationClasses(notification.type)"
      class="shadow-lg rounded-lg p-4 max-w-sm w-full"
    >
      <!-- Header -->
      <div class="flex items-start justify-between">
        <div class="flex items-center gap-3">
          <div :class="getIconClasses(notification.type)" class="rounded-full p-2">
            <!-- Success Icon -->
            <svg v-if="notification.type === 'success'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <!-- Info Icon -->
            <svg v-else-if="notification.type === 'info'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <!-- Warning Icon -->
            <svg v-else-if="notification.type === 'warning'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <!-- Default Success Icon -->
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 class="font-semibold text-gray-900 dark:text-gray-100 text-sm">
              {{ notification.title }}
            </h4>
            <p class="text-gray-600 dark:text-gray-400 text-sm mt-1">
              {{ notification.message }}
            </p>
          </div>
        </div>
        
        <!-- Close Button -->
        <button
          @click="removeNotification(notification.id)"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Progress Bar -->
      <div class="mt-3 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          :class="getProgressClasses(notification.type)"
          class="h-full transition-all duration-300 ease-linear"
          :style="{ width: `${notification.progress}%` }"
        ></div>
      </div>
    </div>
  </TransitionGroup>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { errorHandler } from '@/utils/errorHandler'

const notifications = ref([])

// Başarı mesajı ekle
const addNotification = (notification) => {
  const notificationId = Date.now() + Math.random()
  const notificationData = {
    id: notificationId,
    title: notification.title || 'Başarılı',
    message: notification.message || 'İşlem başarıyla tamamlandı.',
    type: notification.type,
    timestamp: notification.timestamp,
    context: notification.context,
    progress: 100
  }

  notifications.value.push(notificationData)

  // Otomatik kaldırma için timer
  const timer = setInterval(() => {
    const notificationIndex = notifications.value.findIndex(n => n.id === notificationId)
    if (notificationIndex !== -1) {
      notificationData.progress -= 2
      if (notificationData.progress <= 0) {
        removeNotification(notificationId)
        clearInterval(timer)
      }
    } else {
      clearInterval(timer)
    }
  }, 100)

  // Süreye göre otomatik kaldır
  const duration = notification.type === 'success' ? 3000 : 5000
  setTimeout(() => {
    removeNotification(notificationId)
  }, duration)
}

// Başarı mesajı kaldır
const removeNotification = (notificationId) => {
  const index = notifications.value.findIndex(n => n.id === notificationId)
  if (index !== -1) {
    notifications.value.splice(index, 1)
  }
}

// Bildirim sınıfları
const getNotificationClasses = (type) => {
  const baseClasses = 'bg-white dark:bg-gray-800'
  switch (type) {
    case 'success':
      return `${baseClasses} border-l-4 border-green-500`
    case 'info':
      return `${baseClasses} border-l-4 border-blue-500`
    case 'warning':
      return `${baseClasses} border-l-4 border-yellow-500`
    default:
      return `${baseClasses} border-l-4 border-green-500`
  }
}

// İkon sınıfları
const getIconClasses = (type) => {
  switch (type) {
    case 'success':
      return 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400'
    case 'info':
      return 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
    case 'warning':
      return 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400'
    default:
      return 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400'
  }
}

// Progress bar sınıfları
const getProgressClasses = (type) => {
  switch (type) {
    case 'success':
      return 'bg-green-500'
    case 'info':
      return 'bg-blue-500'
    case 'warning':
      return 'bg-yellow-500'
    default:
      return 'bg-green-500'
  }
}

// Error handler listener - sadece başarı mesajlarını yakala
const notificationListener = (error) => {
  // Sadece success, info, warning tipindeki mesajları göster
  if (error.type === 'success' || error.type === 'info' || error.type === 'warning') {
    const displayMessage = error.getDisplayMessage()
    addNotification({
      ...displayMessage,
      type: error.type,
      timestamp: error.timestamp,
      context: error.context
    })
  }
}

onMounted(() => {
  errorHandler.addListener(notificationListener)
})

onUnmounted(() => {
  // Listener'ı kaldır (eğer gerekirse)
})
</script>

<style scoped>
.success-notification-enter-active,
.success-notification-leave-active {
  transition: all 0.3s ease;
}

.success-notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.success-notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.success-notification-move {
  transition: transform 0.3s ease;
}
</style> 