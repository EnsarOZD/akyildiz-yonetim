<template>
  <dialog class="modal" :open="visible">
    <div class="modal-box max-w-3xl">
      <h3 class="font-bold text-lg mb-4">Ödeme {{ editMode ? 'Güncelle' : 'Ekle' }}</h3>
      <form @submit.prevent="handleSave" class="grid grid-cols-1 md:grid-cols-3 gap-4">

        <input v-model="payment.date" type="date" class="input input-bordered w-full" required />

        <select v-model="payment.tenantId" class="select select-bordered w-full" required>
          <option disabled value="">Kiracı seçin</option>
          <option v-for="tenant in tenants" :key="tenant.id" :value="tenant.id">
            {{ tenant.company }}
          </option>
        </select>

        <input v-model.number="payment.amount" type="number" placeholder="Tutar (₺)" class="input input-bordered w-full" required />

        <select v-model="payment.type" class="select select-bordered w-full" required>
          <option disabled value="">Ödeme Tipi</option>
          <option value="Aidat">Aidat</option>
          <option value="Elektrik">Elektrik</option>
          <option value="Su">Su</option>
        </select>

        <select v-model="payment.bank" class="select select-bordered w-full" required>
          <option disabled value="">Banka Seçin</option>
          <option v-for="b in banks" :key="b" :value="b">{{ b }}</option>
        </select>

        <div class="md:col-span-3 flex justify-end gap-2">
          <button type="submit" class="btn btn-success">{{ editMode ? 'Kaydet' : 'Ekle' }}</button>
          <button type="button" class="btn btn-outline btn-warning" @click="$emit('cancel')">Vazgeç</button>
        </div>

      </form>
    </div>
  </dialog>
</template>

<script setup>
defineProps(['visible', 'payment', 'tenants', 'banks', 'editMode'])
const emit = defineEmits(['save', 'cancel'])

const handleSave = () => {
  emit('save')
}
</script>
