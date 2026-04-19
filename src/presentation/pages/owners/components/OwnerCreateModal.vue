<template>
  <BaseModal
    :model-value="visible"
    title="YENİ MAL SAHİBİ EKLE"
    icon="🏠"
    size="md"
    @close="$emit('close')"
  >
    <div class="space-y-8">
      <!-- Form Bilgileri -->
      <form @submit.prevent="submitForm" id="ownerCreateForm" class="space-y-8">
        
        <!-- 1. Kişisel Bilgiler -->
        <div class="space-y-4">
          <div class="flex items-center gap-3 px-1">
            <div class="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center text-brand-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h4 class="text-[11px] font-black uppercase tracking-widest text-[#f1f3f9]">Kişisel ve İletişim Bilgileri</h4>
          </div>

          <div class="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6 space-y-6">
            <div class="form-control">
              <label class="label"><span class="label-text">Ad Soyad *</span></label>
              <input 
                v-model="owner.name" 
                type="text" 
                placeholder="Örn: Ahmet Yılmaz" 
                class="input input-bordered w-full font-bold !text-lg" 
                required 
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="form-control">
                <label class="label"><span class="label-text">Telefon Numarası</span></label>
                <input 
                  v-model="owner.phone" 
                  v-mask="'+90 (###) ### ## ##'" 
                  type="tel" 
                  placeholder="+90 (5XX) XXX XX XX" 
                  class="input input-bordered w-full font-bold" 
                />
              </div>
              <div class="form-control">
                <label class="label"><span class="label-text">E-posta Adresi</span></label>
                <input 
                  v-model="owner.email" 
                  type="email" 
                  placeholder="ornek@mail.com" 
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
            <h4 class="text-[11px] font-black uppercase tracking-widest text-[#f1f3f9]">Sahip Olunan Üniteler</h4>
          </div>

          <div class="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6">
            <div class="max-h-56 overflow-y-auto custom-scrollbar pr-2">
              <div v-if="availableUnits && availableUnits.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                <label 
                  v-for="unit in availableUnits" 
                  :key="unit" 
                  class="relative flex items-center gap-3 p-3 rounded-xl border border-white/[0.05] bg-white/[0.01] hover:bg-brand-500/10 hover:border-brand-500/30 transition-all cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    :value="unit"
                    v-model="owner.units"
                    class="checkbox checkbox-primary checkbox-sm"
                  />
                  <span class="text-xs font-black text-[#9aa0b4] group-hover:text-brand-400 uppercase tracking-tighter">{{ unit }}</span>
                </label>
              </div>
              <div v-else class="py-8 text-center bg-white/[0.01] rounded-2xl border border-dashed border-white/[0.08]">
                <p class="text-[10px] font-black text-[#626885] uppercase tracking-widest px-6">Atanacak boş ünite bulunmuyor</p>
              </div>
            </div>
            
            <div v-if="unitError" class="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-400 text-[10px] font-bold uppercase tracking-tight">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="3"/></svg>
              {{ unitError }}
            </div>

            <p class="mt-4 text-[10px] text-[#626885] font-bold uppercase italic tracking-tight leading-relaxed">
              💡 Bir ünite yalnızca bir mal sahibine atanabilir. Seçilen tüm üniteler bu kayda bağlanacaktır.
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
        form="ownerCreateForm" 
        type="submit" 
        class="btn btn-primary flex-1 shadow-lg shadow-brand-500/20 uppercase tracking-widest font-black"
        :disabled="!isFormValid"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
        </svg>
        Mal Sahibini Kaydet
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
      unitError.value = 'En az bir unit seçmelisiniz.';
    }
    return;
  }

  const nameParts = owner.value.name.trim().split(' ');
  const firstName = nameParts.length > 1 ? nameParts.slice(0, -1).join(' ') : nameParts[0];
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';

  const commandData = {
    firstName: firstName,
    lastName: lastName,
    phoneNumber: owner.value.phone,
    email: owner.value.email,
    apartmentNumber: owner.value.units[0] || '',
    monthlyDues: 0,
    flats: owner.value.units
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
