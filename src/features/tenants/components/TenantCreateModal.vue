<template>
  <dialog id="createTenantModal" class="modal" :open="visible">
    <div class="modal-box max-w-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl">
      <!-- Başlık -->
      <div class="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700 mb-6">
        <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <span class="text-2xl">👤</span>
          Yeni Kiracı Ekle
        </h3>
        <button @click="$emit('close')" class="btn btn-sm btn-ghost text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Scroll edilebilir form -->
      <div class="overflow-y-auto max-h-[70vh] pr-2">
        <form @submit.prevent="handleSave" id="tenantForm" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Ad Soyad -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-semibold text-gray-700 dark:text-gray-300">Ad</span>
              </label>
              <input v-model="tenant.firstName" class="input input-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:border-blue-500 dark:focus:border-blue-400" required />
            </div>
            <div class="form-control">
              <label class="label">
                <span class="label-text font-semibold text-gray-700 dark:text-gray-300">Soyad</span>
              </label>
              <input v-model="tenant.lastName" class="input input-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:border-blue-500 dark:focus:border-blue-400" required />
            </div>

            <!-- Telefon E-posta -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-semibold text-gray-700 dark:text-gray-300">Telefon</span>
              </label>
              <input v-mask="'+90 (###) ### ## ##'" v-model="tenant.phone" class="input input-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:border-blue-500 dark:focus:border-blue-400" required />
            </div>
            <div class="form-control">
              <label class="label">
                <span class="label-text font-semibold text-gray-700 dark:text-gray-300">E-posta</span>
              </label>
              <input type="email" v-model="tenant.email" class="input input-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:border-blue-500 dark:focus:border-blue-400" />
            </div>

            <!-- Şirket Unvanı -->
            <div class="form-control md:col-span-2">
              <label class="label">
                <span class="label-text font-semibold text-gray-700 dark:text-gray-300">Şirket Unvanı</span>
              </label>
              <input v-model="tenant.company" class="input input-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:border-blue-500 dark:focus:border-blue-400" required />
            </div>

            <!-- Katlar -->
            <div class="form-control md:col-span-2">
              <label class="label">
                <span class="label-text font-semibold text-gray-700 dark:text-gray-300">Katlar</span>
              </label>
              <div class="p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 max-h-48 overflow-y-auto">
                <div class="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  <label
                    v-for="unit in unitOptions"
                    :key="unit"
                    class="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      :value="unit"
                      v-model="tenant.units"
                      :disabled="isUnitTaken(unit)"
                      class="checkbox checkbox-primary"
                    />
                    <span :class="isUnitTaken(unit) ? 'text-gray-400 line-through' : 'text-gray-700 dark:text-gray-300'">
                      {{ unit }}
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Giriş Tarihi -->
            <div class="form-control md:col-span-2">
              <label class="label">
                <span class="label-text font-semibold text-gray-700 dark:text-gray-300">Giriş Tarihi</span>
              </label>
              <input type="date" v-model="tenant.entryDate" class="input input-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:border-blue-500 dark:focus:border-blue-400" required />
            </div>

            <!-- Aktiflik -->
            <div class="form-control md:col-span-2">
              <label class="label cursor-pointer">
                <span class="label-text font-semibold text-gray-700 dark:text-gray-300">Aktif</span>
                <input type="checkbox" v-model="tenant.isActive" class="toggle toggle-success" />
              </label>
            </div>
          </div>
        </form>
      </div>

      <!-- Sabit Butonlar -->
      <div class="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700 mt-6">
        <button type="button" @click="$emit('close')" class="btn btn-outline border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          İptal
        </button>
        <button form="tenantForm" type="submit" class="btn btn-success bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 border-0 text-white shadow-lg">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          Kaydet
        </button>
      </div>
    </div>
  </dialog>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  visible: Boolean,
  unitOptions: Array,
  allTenants: Array
})

const emit = defineEmits(['save', 'close'])

const emptyTenant = () => ({
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  company: '',
  units: [],
  entryDate: new Date().toISOString().slice(0, 10),
  isActive: true
})

const tenant = ref(emptyTenant())

watch(() => props.visible, (newVal) => {
  if (newVal) {
    tenant.value = emptyTenant()
  }
})

const isUnitTaken = (unit) => {
  return props.allTenants.some(t =>
    t.isActive &&
    t.units?.includes(unit)
  )
}

const handleSave = () => {
  emit('save', tenant.value)
  tenant.value = emptyTenant()
}
</script>
