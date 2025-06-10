<template>
  <dialog open class="modal">
    <div class="modal-box max-w-2xl">
      <h3 class="font-bold text-lg mb-4">Elektrik Kaydı Düzenle</h3>

      <div class="form-control mb-4">
        <label class="label font-semibold">Kat</label>
        <input type="text" class="input input-bordered" :value="record.unit" disabled />
      </div>

      <div class="form-control mb-4">
        <label class="label font-semibold">Şirket</label>
        <input type="text" class="input input-bordered" :value="record.tenantName || '-'" disabled />
      </div>

      <div class="form-control mb-4">
        <label class="label font-semibold">Önceki Endeks</label>
        <input type="number" v-model.number="local.previousValue" class="input input-bordered" />
      </div>

      <div class="form-control mb-4">
        <label class="label font-semibold">Yeni Endeks</label>
        <input type="number" v-model.number="local.currentValue" class="input input-bordered" />
      </div>

      <div class="form-control mb-4">
        <label class="label font-semibold">KDV Hariç Tutar</label>
        <input type="number" v-model.number="local.kdvHaric" class="input input-bordered" />
      </div>

      <div class="text-sm text-gray-500 mb-2">
        Tüketim: {{ local.currentValue - local.previousValue }}
      </div>
      <div class="text-sm text-gray-500 mb-4">
        Toplam (KDV Dahil): {{ formatCurrency(local.kdvHaric * 1.2) }}
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

const props = defineProps({
  record: Object
})
const emit = defineEmits(['close', 'updated'])

const local = ref({
  previousValue: 0,
  currentValue: 0,
  kdvHaric: 0
})

// 👁️ record değiştiğinde input'lara yansıt
watch(
  () => props.record,
  (newVal) => {
    if (newVal) {
      local.value.previousValue = newVal.previousValue ?? 0
      local.value.currentValue = newVal.currentValue ?? 0
      local.value.kdvHaric = newVal.kdvHaric ?? 0
    }
  },
  { immediate: true }
)

const formatCurrency = (val) =>
  isNaN(val) ? '-' : val.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })

const save = async () => {
  const consumption = local.value.currentValue - local.value.previousValue
  const toplamTutar = +(local.value.kdvHaric * 1.2).toFixed(2)
  const refDoc = doc(db, 'readings', props.record.id)

  await updateDoc(refDoc, {
    previousValue: local.value.previousValue,
    currentValue: local.value.currentValue,
    consumption: consumption,
    kdvHaric: local.value.kdvHaric,
    toplamTutar: toplamTutar,
    kdvDahil: toplamTutar // İsteğe bağlı olarak burada da yazabilirsin
  })

  alert('Kayıt güncellendi.')
  emit('updated')
  emit('close')
}
</script>
