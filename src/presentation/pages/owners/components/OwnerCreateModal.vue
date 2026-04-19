<template>
  <dialog :open="visible" class="modal bg-black/30 backdrop-blur-sm">
    <div class="modal-box max-w-lg bg-white dark:bg-[#0f1322] border border-gray-200 dark:border-white/[0.07]">
      
      <!-- Başlık -->
      <div class="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-white/[0.07]">
        <h3 class="text-xl font-bold text-gray-800 dark:text-[#f1f3f9] flex items-center gap-2">
          <span class="text-2xl">🏠</span>
          Yeni Mal Sahibi Ekle
        </h3>
        <button @click="$emit('close')" class="btn btn-sm btn-ghost text-gray-500 hover:text-gray-700 dark:text-[#9aa0b4] dark:hover:text-gray-200">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="submitForm" class="py-6 space-y-6">
        
        <div class="form-control">
          <label class="label">
            <span class="label-text font-semibold text-gray-700 dark:text-[#f1f3f9]">Ad Soyad</span>
          </label>
          <input v-model="owner.name" type="text" placeholder="Mal sahibinin adı ve soyadı" class="input input-bordered w-full bg-white dark:bg-[#1c2238]" required />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold text-gray-700 dark:text-[#f1f3f9]">Telefon Numarası</span>
            </label>
            <input v-model="owner.phone" v-mask="'+90 (###) ### ## ##'" type="tel" placeholder="+90 (5xx) xxx xx xx" class="input input-bordered w-full bg-white dark:bg-[#1c2238]" />
          </div>
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold text-gray-700 dark:text-[#f1f3f9]">E-posta Adresi</span>
            </label>
            <input v-model="owner.email" type="email" placeholder="ornek@mail.com" class="input input-bordered w-full bg-white dark:bg-[#1c2238]" />
          </div>
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text font-semibold text-gray-700 dark:text-[#f1f3f9]">Sahip Olunan Katlar</span>
          </label>
          <div class="p-4 border rounded-lg dark:bg-gray-700/50 dark:border-white/[0.1] max-h-48 overflow-y-auto">
            <div class="grid grid-cols-3 sm:grid-cols-4 gap-2">
              <label v-for="unit in availableUnits" :key="unit" class="flex items-center gap-2 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  :value="unit"
                  v-model="owner.units"
                  class="checkbox checkbox-primary"
                />
                <span class="text-sm font-medium text-gray-700 dark:text-[#f1f3f9]">{{ unit }}</span>
              </label>
            </div>
             <div v-if="!availableUnits || availableUnits.length === 0" class="text-center text-sm text-gray-500 dark:text-[#9aa0b4]">
              Atanacak boş kat bulunmuyor.
            </div>
          </div>
          <div v-if="unitError" class="text-red-500 text-sm mt-1">{{ unitError }}</div>
        </div>

        <div class="text-sm text-gray-500 dark:text-[#9aa0b4]">
          <p>Seçilen katlar bu mal sahibine atanacaktır. Bir kat yalnızca bir mal sahibine atanabilir.</p>
        </div>

        <!-- Butonlar -->
        <div class="modal-action pt-4 border-t border-gray-200 dark:border-white/[0.07]">
          <button type="button" @click="$emit('close')" class="btn btn-outline border-gray-300 dark:border-white/[0.1] text-gray-700 dark:text-[#f1f3f9] hover:bg-gray-50 dark:hover:bg-white/[0.06]">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            İptal
          </button>
          <button type="submit" class="btn btn-primary bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border-0 text-white shadow-lg" :disabled="!isFormValid">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            Kaydet
          </button>
        </div>
      </form>
    </div>
  </dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { mask } from 'vue-the-mask';

const props = defineProps({
  visible: Boolean,
  availableUnits: Array,
});
const emit = defineEmits(['close', 'save']);

const owner = ref({
  name: '',
  phone: '',
  email: '',
  units: [],
});

const unitError = ref('');

const isFormValid = computed(() => {
  return owner.value.name && owner.value.units.length > 0;
});

const submitForm = () => {
  if (!isFormValid.value) {
    if (owner.value.units.length === 0) {
      unitError.value = 'En az bir kat seçmelisiniz.';
    }
    return;
  }

  //İsim parçalama
  const nameParts = owner.value.name.trim().split(' ');
  const firstName = nameParts.length > 1 ? nameParts.slice(0, -1).join(' ') : nameParts[0];
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';

  // Backend CreateOwnerCommand beklentileri
  const commandData = {
    firstName: firstName,
    lastName: lastName,
    phoneNumber: owner.value.phone,
    email: owner.value.email,
    apartmentNumber: owner.value.units[0] || '', // Ana daire olarak ilki alınıyor
    monthlyDues: 0, // Varsayılan
    flats: owner.value.units // Birden fazla kat seçimi için (Handler'da işlenmeli)
  };

  emit('save', commandData);
};

watch(() => props.visible, (newVal) => {
  if (newVal) {
    owner.value = { name: '', phone: '', email: '', units: [] };
    unitError.value = '';
  }
});
</script>
