<template>
  <dialog class="modal" :open="visible">
    <div class="modal-box max-w-3xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl">
      <!-- Başlık -->
      <div class="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700 mb-6">
        <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <span class="text-2xl">💰</span>
          {{ editMode ? 'Gider Düzenle' : 'Yeni Gider Ekle' }}
        </h3>
        <button @click="$emit('close')" class="btn btn-sm btn-ghost text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSave" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Gider Tipi -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold text-gray-700 dark:text-gray-300">Gider Tipi</span>
            </label>
            <select v-model="expense.type" class="select select-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:border-blue-500 dark:focus:border-blue-400" required>
              <option disabled value="">Seçiniz</option>
              <option v-for="type in expenseTypeOptions" :key="type.value" :value="type.value">{{ type.label }}</option>
            </select>
          </div>

          <!-- Tarih -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold text-gray-700 dark:text-gray-300">Tarih</span>
            </label>
            <input v-model="expense.expenseDate" type="date" class="input input-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:border-blue-500 dark:focus:border-blue-400" required />
          </div>

          <!-- Tutar -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold text-gray-700 dark:text-gray-300">Tutar (₺)</span>
            </label>
            <input v-model="expense.amount" type="number" min="0" step="0.01" class="input input-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:border-blue-500 dark:focus:border-blue-400" required />
          </div>
        </div>

        <!-- Başlık -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-semibold text-gray-700 dark:text-gray-300">Başlık</span>
          </label>
          <input v-model="expense.title" type="text" class="input input-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:border-blue-500 dark:focus:border-blue-400" placeholder="Gider başlığı giriniz" required />
        </div>

        <!-- Açıklama -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-semibold text-gray-700 dark:text-gray-300">Açıklama</span>
          </label>
          <textarea v-model="expense.description" class="textarea textarea-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:border-blue-500 dark:focus:border-blue-400" placeholder="Gider açıklaması giriniz" rows="3"></textarea>
        </div>

        <!-- Butonlar -->
        <div class="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button class="btn btn-outline border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700" type="button" @click="$emit('close')">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            İptal
          </button>
          <button class="btn btn-primary bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border-0 text-white shadow-lg" type="submit">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            {{ editMode ? 'Güncelle' : 'Kaydet' }}
          </button>
        </div>
      </form>
    </div>
  </dialog>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps(['visible', 'expense', 'types', 'editMode'])
const emit = defineEmits(['save', 'close'])

// Backend enum değerlerini frontend'e uygun hale getir
const expenseTypeOptions = computed(() => [
  { value: 'Electricity', label: 'Elektrik (Genel)' },
  { value: 'Water', label: 'Su (Genel)' },
  { value: 'Gas', label: 'Gaz' },
  { value: 'Maintenance', label: 'Bakım' },
  { value: 'Cleaning', label: 'Temizlik' },
  { value: 'Security', label: 'Güvenlik' },
  { value: 'Other', label: 'Diğer' }
])

function handleSave() {
  emit('save', props.expense)
}
</script>
