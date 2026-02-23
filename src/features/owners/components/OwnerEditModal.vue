<template>
  <dialog :open="visible" class="modal bg-black/30 backdrop-blur-sm">
    <div class="modal-box max-w-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      
      <!-- Başlık -->
      <div class="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <span class="text-2xl">✏️</span>
          Mal Sahibi Düzenle
        </h3>
        <button @click="$emit('close')" class="btn btn-sm btn-ghost text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="submitForm" class="py-6 space-y-6">
        
        <div class="form-control">
          <label class="label">
            <span class="label-text font-semibold text-gray-700 dark:text-gray-300">Ad Soyad</span>
          </label>
          <input v-model="formData.name" type="text" placeholder="Mal sahibinin adı ve soyadı" class="input input-bordered w-full bg-white dark:bg-gray-700" required />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold text-gray-700 dark:text-gray-300">Telefon Numarası</span>
            </label>
            <input v-model="formData.phone" v-mask="'+90 (###) ### ## ##'" type="tel" placeholder="+90 (5xx) xxx xx xx" class="input input-bordered w-full bg-white dark:bg-gray-700" />
          </div>
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold text-gray-700 dark:text-gray-300">E-posta Adresi</span>
            </label>
            <input v-model="formData.email" type="email" placeholder="ornek@mail.com" class="input input-bordered w-full bg-white dark:bg-gray-700" />
          </div>
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text font-semibold text-gray-700 dark:text-gray-300">Sahip Olunan Katlar</span>
          </label>
          <div class="p-4 border rounded-lg bg-gray-50 dark:bg-gray-700/50 dark:border-gray-600 max-h-48 overflow-y-auto">
            <div class="grid grid-cols-3 sm:grid-cols-4 gap-2">
              <label v-for="unit in allUnitOptions" :key="unit" class="flex items-center gap-2 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  :value="unit"
                  v-model="formData.units"
                  class="checkbox checkbox-primary"
                  :disabled="!isUnitAvailable(unit)"
                />
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ unit }}</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Butonlar -->
        <div class="modal-action pt-4 border-t border-gray-200 dark:border-gray-700">
          <button type="button" @click="$emit('close')" class="btn btn-outline border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            İptal
          </button>
          <button type="submit" class="btn btn-primary bg-blue-600 hover:bg-blue-700 text-white shadow-lg" :disabled="!isFormValid">
            Değişiklikleri Kaydet
          </button>
        </div>
      </form>
    </div>
  </dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { UNIT_OPTIONS } from '@/constants/units';

const props = defineProps({
  visible: Boolean,
  initialData: Object,
  availableUnits: Array, // Sadece boş olanlar + zaten bu mal sahibine ait olanlar
});
const emit = defineEmits(['close', 'save']);

const formData = ref({
  id: '',
  name: '',
  phone: '',
  email: '',
  units: [],
});

const allUnitOptions = UNIT_OPTIONS;

const isUnitAvailable = (unit) => {
  // Eğer kat boşsa (availableUnits içinde) veya zaten bu mal sahibine aitse seçilebilir kalsın
  return props.availableUnits.includes(unit) || (props.initialData?.allUnits?.includes(unit));
};

const isFormValid = computed(() => {
  return formData.value.name && formData.value.units.length > 0;
});

watch(() => props.visible, (newVal) => {
  if (newVal && props.initialData) {
    formData.value = {
      id: props.initialData.id,
      name: props.initialData.name,
      phone: props.initialData.phoneNumber || '',
      email: props.initialData.email || '',
      units: [...(props.initialData.allUnits || [])]
    };
  }
});

const submitForm = () => {
  if (!isFormValid.value) return;

  const nameParts = formData.value.name.trim().split(' ');
  const firstName = nameParts.length > 1 ? nameParts.slice(0, -1).join(' ') : nameParts[0];
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';

  const updateData = {
    id: formData.value.id,
    firstName,
    lastName,
    phoneNumber: formData.value.phone,
    email: formData.value.email,
    apartmentNumber: formData.value.units[0] || '',
    flats: formData.value.units
  };

  emit('save', updateData);
};
</script>
