<template>
  <dialog open class="modal">
    <div class="modal-box max-w-2xl">
      <h3 class="font-bold text-lg mb-4">Su Kaydı Düzenle</h3>

      <div class="form-control mb-3">
        <label class="label font-semibold">Kat</label>
        <input type="text" class="input input-bordered" :value="record.unit" disabled />
      </div>

      <div class="form-control mb-3">
        <label class="label font-semibold">Şirket</label>
        <input type="text" class="input input-bordered" :value="record.tenantName || '-'" disabled />
      </div>

      <div class="form-control mb-3">
        <label class="label font-semibold">Önceki Endeks</label>
        <input type="number" v-model.number="local.previousValue" class="input input-bordered" />
      </div>

      <div class="form-control mb-3">
        <label class="label font-semibold">Yeni Endeks</label>
        <input type="number" v-model.number="local.currentValue" class="input input-bordered" />
      </div>

      <div class="form-control mb-3">
        <label class="label font-semibold">Su Tutarı (KDV Hariç - %1)</label>
        <input type="number" v-model.number="local.waterAmount" class="input input-bordered" />
      </div>

      <div class="form-control mb-3">
        <label class="label font-semibold">Atık Su Tutarı (KDV Hariç - %10)</label>
        <input type="number" v-model.number="local.wasteAmount" class="input input-bordered" />
      </div>

      <div class="text-sm text-gray-500 mb-2">
        Tüketim: {{ local.currentValue - local.previousValue }}
      </div>

      <div class="text-sm text-gray-500 mb-3">
        Toplam (KDV Dahil): {{ formatCurrency(totalWithVAT) }}
      </div>

      <div class="modal-action">
        <button class="btn btn-outline" @click="$emit('close')">İptal</button>
        <button class="btn btn-primary" @click="save">Kaydet</button>
      </div>
    </div>
  </dialog>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'

const props = defineProps({ record: Object })
const emit = defineEmits(['close', 'updated'])

const local = ref({
  previousValue: 0,
  currentValue: 0,
  waterAmount: 0,
  wasteAmount: 0
})

// 🔄 Her props değişiminde formu doldur
watchEffect(() => {
  const r = props.record
  if (r) {
    local.value.previousValue = typeof r.previousValue === 'number' ? r.previousValue : 0
    local.value.currentValue = typeof r.currentValue === 'number' ? r.currentValue : 0
    local.value.waterAmount = typeof r.waterAmount === 'number' ? r.waterAmount : 0
    local.value.wasteAmount = typeof r.wasteAmount === 'number' ? r.wasteAmount : 0
  }
})

const totalWithVAT = computed(() => {
  const water = local.value.waterAmount * 1.01
  const waste = local.value.wasteAmount * 1.10
  return +(water + waste).toFixed(2)
})

const formatCurrency = val =>
  isNaN(val) ? '-' : val.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })

const save = async () => {
  const consumption = local.value.currentValue - local.value.previousValue

  if (consumption < 0) {
    alert('Yeni endeks, önceki endeksten küçük olamaz.')
    return
  }

  const kdvHaric = +(local.value.waterAmount + local.value.wasteAmount).toFixed(2)
  const toplam = totalWithVAT.value

  const docRef = doc(db, 'readings', props.record.id)
  await updateDoc(docRef, {
    previousValue: local.value.previousValue,
    currentValue: local.value.currentValue,
    consumption,
    waterAmount: local.value.waterAmount,
    wasteAmount: local.value.wasteAmount,
    kdvHaric,
    toplamTutar: toplam,
    kdvDahil: toplam
  })

  alert('Su kaydı başarıyla güncellendi.')
  emit('updated')
  emit('close')
}
</script>
