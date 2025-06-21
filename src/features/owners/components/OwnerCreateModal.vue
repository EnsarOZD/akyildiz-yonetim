<template>
  <dialog :open="visible" class="modal bg-black/30 backdrop-blur-sm">
    <div class="modal-box max-w-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      
      <!-- Başlık -->
      <div class="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100">Yeni Mal Sahibi Ekle</h3>
        <button @click="$emit('close')" class="btn btn-sm btn-ghost">✕</button>
      </div>

      <!-- Form -->
      <form @submit.prevent="submitForm" class="py-6 space-y-6">
        
        <div class="form-control">
          <label class="label">
            <span class="label-text font-semibold text-gray-700 dark:text-gray-300">Ad Soyad</span>
          </label>
          <input v-model="owner.name" type="text" placeholder="Mal sahibinin adı ve soyadı" class="input input-bordered w-full bg-white dark:bg-gray-700" required />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold text-gray-700 dark:text-gray-300">Telefon Numarası</span>
            </label>
            <input v-model="owner.phone" v-mask="'+90 (###) ### ## ##'" type="tel" placeholder="+90 (5xx) xxx xx xx" class="input input-bordered w-full bg-white dark:bg-gray-700" />
          </div>
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold text-gray-700 dark:text-gray-300">E-posta Adresi</span>
            </label>
            <input v-model="owner.email" type="email" placeholder="ornek@mail.com" class="input input-bordered w-full bg-white dark:bg-gray-700" />
          </div>
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text font-semibold text-gray-700 dark:text-gray-300">Sahip Olunan Katlar</span>
          </label>
          <div class="p-4 border rounded-lg bg-gray-50 dark:bg-gray-700/50 dark:border-gray-600 max-h-48 overflow-y-auto">
            <div class="grid grid-cols-3 sm:grid-cols-4 gap-2">
              <label v-for="unit in availableUnits" :key="unit" class="flex items-center gap-2 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  :value="unit"
                  v-model="owner.units"
                  class="checkbox checkbox-primary"
                />
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ unit }}</span>
              </label>
            </div>
             <div v-if="!availableUnits || availableUnits.length === 0" class="text-center text-sm text-gray-500 dark:text-gray-400">
              Atanacak boş kat bulunmuyor.
            </div>
          </div>
          <div v-if="unitError" class="text-red-500 text-sm mt-1">{{ unitError }}</div>
        </div>

        <div class="text-sm text-gray-500 dark:text-gray-400">
          <p>Seçilen katlar bu mal sahibine atanacaktır. Bir kat yalnızca bir mal sahibine atanabilir.</p>
        </div>

        <!-- Butonlar -->
        <div class="modal-action pt-4 border-t border-gray-200 dark:border-gray-700">
          <button type="button" @click="$emit('close')" class="btn btn-outline">İptal</button>
          <button type="submit" class="btn btn-primary" :disabled="!isFormValid">Kaydet</button>
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
  emit('save', { ...owner.value });
};

watch(() => props.visible, (newVal) => {
  if (newVal) {
    owner.value = { name: '', phone: '', email: '', units: [] };
    unitError.value = '';
  }
});
</script>
