<template>
  <dialog class="modal" :open="visible">
    <div class="modal-box max-w-3xl">
      <h3 class="font-bold text-lg mb-4">Gider Ekle</h3>
      <form @submit.prevent="handleSave" class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Gider Tipi -->
        <div class="form-control">
          <label class="label font-semibold">Gider Tipi</label>
          <select v-model="expense.type" class="select select-bordered" required>
            <option disabled value="">Seçiniz</option>
            <option v-for="type in types" :key="type" :value="type">{{ type }}</option>
          </select>
        </div>

        <!-- Tarih -->
        <div class="form-control">
          <label class="label font-semibold">Tarih</label>
          <input v-model="expense.date" type="date" class="input input-bordered" required />
        </div>

        <!-- Tutar -->
        <div class="form-control">
          <label class="label font-semibold">Tutar (₺)</label>
          <input v-model="expense.amount" type="number" min="0" step="0.01" class="input input-bordered" required />
        </div>

        <!-- Açıklama -->
        <div class="form-control md:col-span-3">
          <label class="label font-semibold">Açıklama</label>
          <input v-model="expense.description" class="input input-bordered" placeholder="Açıklama giriniz" required />
        </div>

        <div class="mt-4 md:col-span-3 flex justify-end gap-2">
          <button class="btn" type="button" @click="$emit('close')">İptal</button>
          <button class="btn btn-primary" type="submit">Kaydet</button>
        </div>
      </form>
    </div>
  </dialog>
</template>

<script setup>
defineProps(['visible', 'expense', 'types'])
const emit = defineEmits(['save', 'close'])

function handleSave() {
  emit('save')
}
</script>
