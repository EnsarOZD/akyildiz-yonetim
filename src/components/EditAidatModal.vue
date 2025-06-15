<template>
  <dialog open class="modal">
    <div class="modal-box max-w-md">
      <h3 class="font-bold text-lg mb-4">Aidat Kaydı Düzenle</h3>

      <div class="form-control mb-4">
        <label class="label font-semibold">Kat</label>
        <input type="text" class="input input-bordered" :value="record.unit" disabled />
      </div>

      <div class="form-control mb-4">
        <label class="label font-semibold">Şirket</label>
        <input type="text" class="input input-bordered" :value="record.tenantName || '-'" disabled />
      </div>

      <div class="form-control mb-4">
        <label class="label font-semibold">KDV Hariç</label>
        <input type="number" v-model.number="local.kdvHaric" class="input input-bordered" />
      </div>

      <div class="form-control mb-4">
        <label class="label font-semibold">Toplam Tutar (KDV Dahil)</label>
        <input type="number" v-model.number="local.toplamTutar" class="input input-bordered" />
      </div>

      <div class="modal-action">
        <button class="btn btn-outline" @click="$emit('close')">İptal</button>
        <button class="btn btn-primary" @click="save">Kaydet</button>
      </div>
    </div>
  </dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'

const props = defineProps({ record: Object })
const emit = defineEmits(['close', 'updated'])

const local = ref({
  kdvHaric: 0,
  toplamTutar: 0
})

watch(() => props.record, (newVal) => {
  if (newVal) {
    local.value.kdvHaric = newVal.kdvHaric ?? 0
    local.value.toplamTutar = newVal.toplamTutar ?? 0
  }
}, { immediate: true })

const save = async () => {
  const refDoc = doc(db, 'aidatRecords', props.record.id)
  await updateDoc(refDoc, {
    kdvHaric: local.value.kdvHaric,
    toplamTutar: local.value.toplamTutar
  })
  alert('Aidat kaydı güncellendi.')
  emit('updated')
  emit('close')
}
</script>
