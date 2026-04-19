<template>
  <BaseModal
    :model-value="visible"
    title="MAL SAHİBİ BİLGİLERİNİ GÜNCELLE"
    icon="✏️"
    size="md"
    @close="$emit('close')"
  >
    <div v-if="formData" class="space-y-8">
      <!-- Form Bilgileri -->
      <form @submit.prevent="submitForm" id="ownerEditForm" class="space-y-8">
        
        <!-- 1. Kişisel Bilgiler -->
        <div class="space-y-4">
          <div class="flex items-center gap-3 px-1">
            <div class="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center text-brand-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h4 class="text-[11px] font-black uppercase tracking-widest text-[#f1f3f9]">Kayıt Detayları</h4>
          </div>

          <div class="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6 space-y-6">
            <div class="form-control">
              <label class="label"><span class="label-text">Ad Soyad *</span></label>
              <input 
                v-model="formData.name" 
                type="text" 
                class="input input-bordered w-full font-bold !text-lg" 
                required 
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="form-control">
                <label class="label"><span class="label-text">Telefon Numarası</span></label>
                <input 
                  v-model="formData.phone" 
                  v-mask="'+90 (###) ### ## ##'" 
                  type="tel" 
                  class="input input-bordered w-full font-bold" 
                />
              </div>
              <div class="form-control">
                <label class="label"><span class="label-text">E-posta Adresi</span></label>
                <input 
                  v-model="formData.email" 
                  type="email" 
                  class="input input-bordered w-full font-medium" 
                />
              </div>
            </div>
          </div>
        </div>

        <!-- 2. Ünite Atamaları -->
        <div class="space-y-4">
          <div class="flex items-center gap-3 px-1">
            <div class="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center text-brand-400 font-bold text-xs">📍</div>
            <h4 class="text-[11px] font-black uppercase tracking-widest text-[#f1f3f9]">Mülkiyetindeki Üniteler</h4>
          </div>

          <div class="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6">
            <div class="max-h-56 overflow-y-auto custom-scrollbar pr-2">
              <div v-if="allUnitOptions && allUnitOptions.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                <label 
                  v-for="unit in allUnitOptions" 
                  :key="unit" 
                  class="relative flex items-center gap-3 p-3 rounded-xl border border-white/[0.05] transition-all cursor-pointer group"
                  :class="[
                    isUnitAvailable(unit) 
                      ? 'bg-white/[0.01] hover:bg-brand-500/10 hover:border-brand-500/30' 
                      : 'bg-white/[0.01] opacity-40 cursor-not-allowed'
                  ]"
                >
                  <input
                    type="checkbox"
                    :value="unit"
                    v-model="formData.units"
                    class="checkbox checkbox-primary checkbox-sm"
                    :disabled="!isUnitAvailable(unit)"
                  />
                  <span class="text-xs font-black text-[#9aa0b4] group-hover:text-brand-400 uppercase tracking-tighter">{{ unit }}</span>
                </label>
              </div>
            </div>
            
            <p class="mt-6 text-[10px] text-[#626885] font-bold uppercase italic tracking-tight leading-relaxed">
              💡 Pasif seçenekler başka bir mal sahibine atalı olan ünitelerdir. Kendi mülkiyetindeki üniteleri buradan yönetebilirsiniz.
            </p>
          </div>
        </div>
      </form>
    </div>

    <!-- Footer -->
    <template #footer>
      <button 
        type="button" 
        @click="$emit('close')" 
        class="btn btn-ghost !bg-transparent border border-white/[0.08] text-[#9aa0b4] hover:bg-white/[0.05] flex-1"
      >
        Vazgeç
      </button>
      <button 
        form="ownerEditForm" 
        type="submit" 
        class="btn btn-primary flex-1 shadow-lg shadow-brand-500/20 uppercase tracking-widest font-black"
        :disabled="!isFormValid"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
        </svg>
        Güncellemeleri Kaydet
      </button>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import BaseModal from '@/presentation/components/common/BaseModal.vue';
import { mask as vMask } from 'vue-the-mask';

const props = defineProps({
  visible: Boolean,
  initialData: Object,
  availableUnits: Array,
  allUnitOptions: { type: Array, default: () => [] },
});
const emit = defineEmits(['close', 'save']);

const formData = ref({
  id: '',
  name: '',
  phone: '',
  email: '',
  units: [],
  isActive: true,
  monthlyDues: 0,
});

const isUnitAvailable = (unit) => {
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
      units: [...(props.initialData.allUnits || [])],
      isActive: props.initialData.isActive ?? true,
      monthlyDues: props.initialData.monthlyDues ?? 0,
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
    flats: formData.value.units,
    isActive: formData.value.isActive,
    monthlyDues: formData.value.monthlyDues,
  };

  emit('save', updateData);
};
</script>
