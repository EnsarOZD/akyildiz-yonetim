<template>
  <dialog id="deleteConfirmModal" class="modal" :open="visible">
    <div class="modal-box max-w-md">
      <h3 class="font-bold text-lg">Silme Onayı</h3>
      <p class="py-4">
        <strong>{{ tenant?.firstName }} {{ tenant?.lastName }}</strong> isimli kiracıyı silmek istediğinize emin misiniz?
      </p>
      <div class="modal-action">
        <button class="btn btn-error" @click="$emit('confirm')">Evet, Sil</button>
        <button class="btn" @click="$emit('cancel')">İptal</button>
      </div>
    </div>
  </dialog>
</template>

<script setup>
defineProps({
  tenant: Object,
  visible: Boolean
})

defineEmits(['confirm', 'close'])
</script>
