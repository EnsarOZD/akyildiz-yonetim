<template>
  <dialog id="editTenantModal" class="modal" :open="visible">
    <div v-if="tenant" class="modal-box max-w-2xl">
      <h3 class="font-bold text-lg mb-4">Kiracı Bilgilerini Güncelle</h3>
      <form @submit.prevent="save">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="label font-semibold">Ad</label>
            <input v-model="tenant.firstName" class="input input-bordered w-full" required />
          </div>
          <div>
            <label class="label font-semibold">Soyad</label>
            <input v-model="tenant.lastName" class="input input-bordered w-full" required />
          </div>
          <div>
            <label class="label font-semibold">Telefon</label>
            <input v-mask="'+90 (###) ### ## ##'" v-model="tenant.phone" class="input input-bordered w-full" required />
          </div>
          <div>
            <label class="label font-semibold">E-posta</label>
            <input type="email" v-model="tenant.email" class="input input-bordered w-full" />
          </div>
          <div class="md:col-span-2">
            <label class="label font-semibold">Şirket Unvanı</label>
            <input v-model="tenant.company" class="input input-bordered w-full" required />
          </div>
          <div class="md:col-span-2">
            <label class="label font-semibold">Katlar</label>
            <div class="flex flex-wrap gap-3">
              <label
  v-for="unit in unitOptions"
  :key="unit"
  class="flex items-center gap-2"
>
  <input
    type="checkbox"
    :value="unit"
    v-model="tenant.units"
    :disabled="isUnitTaken(unit)"
  />
  <span :class="isUnitTaken(unit) ? 'text-gray-400 line-through' : ''">
    {{ unit }}
  </span>
</label>
            </div>
          </div>

          <!-- ✅ Aktif/Pasif Alanı -->
          <div class="md:col-span-2 flex items-center gap-2">
            <input type="checkbox" v-model="tenant.isActive" class="toggle toggle-success" />
            <label class="label font-semibold">Aktif</label>
          </div>
        </div>

        <div class="modal-action mt-6">
          <button type="submit" class="btn btn-success">Kaydet</button>
          <button type="button" @click="$emit('close')" class="btn btn-ghost">Kapat</button>
        </div>
      </form>
    </div>
  </dialog>
</template>

<script setup>
const props = defineProps({
  tenant: Object,
  unitOptions: Array,
  visible: Boolean,
  allTenants: Array
})

const isUnitTaken = (unit) => {
  return props.allTenants.some(t =>
    t.id !== props.tenant.id &&
    t.isActive &&
    t.units?.includes(unit)
  )
}

const emit = defineEmits(['save', 'close'])

const save = () => {
  emit('save')
}
</script>
