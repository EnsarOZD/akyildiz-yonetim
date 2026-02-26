<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-blue-50/50 dark:bg-blue-900/20">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
          </div>
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">Genel Duyuru Yayınla</h2>
        </div>
        <button @click="$emit('close')" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Body -->
      <div class="p-6 space-y-4">
        <div class="space-y-1">
          <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Duyuru Başlığı</label>
          <input 
            v-model="form.title"
            type="text" 
            placeholder="Örn: Su Kesintisi Hakkında"
            class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 transition outline-none"
          />
        </div>

        <div class="space-y-1">
          <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Mesaj İçeriği</label>
          <textarea 
            v-model="form.message"
            rows="4"
            placeholder="Tüm kullanıcılara iletilecek mesajı yazın..."
            class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 transition outline-none resize-none"
          ></textarea>
        </div>

        <div class="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-xl border border-amber-100 dark:border-amber-900/30 flex gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-amber-600 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          <p class="text-xs text-amber-800 dark:text-amber-200">
            Bu duyuru yayınlandığında sistemdeki <strong>tüm kullanıcılara</strong> anlık bildirim olarak iletilecektir.
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
        <button 
          @click="$emit('close')"
          class="px-5 py-2.5 rounded-xl text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          Vazgeç
        </button>
        <button 
          @click="handleSubmit"
          :disabled="loading || !isFormValid"
          class="px-8 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2"
        >
          <span v-if="loading" class="loading loading-spinner loading-xs"></span>
          {{ loading ? 'Yayınlanıyor...' : 'Yayınla' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { notificationsService } from '@/services/notificationsService'
import { useNotify } from '@/composables/useNotify'

const props = defineProps({
  show: Boolean
})

const emit = defineEmits(['close', 'success'])
const { notify } = useNotify()

const loading = ref(false)
const form = reactive({
  title: '',
  message: ''
})

const isFormValid = computed(() => {
  return form.title.trim().length >= 3 && form.message.trim().length >= 10
})

const handleSubmit = async () => {
  if (!isFormValid.value) return

  loading.value = true
  try {
    await notificationsService.broadcast(form.title, form.message)
    notify('Duyuru başarıyla tüm kullanıcılara iletildi', 'success')
    emit('success')
    form.title = ''
    form.message = ''
    emit('close')
  } catch (error) {
    notify('Duyuru yayınlanırken bir hata oluştu', 'error')
  } finally {
    loading.value = false
  }
}
</script>
