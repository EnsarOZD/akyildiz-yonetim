<template>
  <dialog open class="modal">
    <div class="modal-box max-w-6xl">
      <h3 class="font-bold text-lg mb-4">Elektrik Kayıtlarını Düzenle - {{ period }}</h3>

      <!-- Genel Tarih Bilgileri -->
      <div class="flex flex-wrap gap-4 mb-4">
        <div class="form-control">
          <label class="label font-semibold">İlk Okuma Tarihi</label>
          <input type="date" v-model="startDate" class="input input-bordered" />
        </div>
        <div class="form-control">
          <label class="label font-semibold">Son Okuma Tarihi</label>
          <input type="date" v-model="endDate" class="input input-bordered" />
        </div>
        <div class="form-control">
          <label class="label font-semibold">Son Ödeme Tarihi</label>
          <input type="date" v-model="dueDate" class="input input-bordered" />
        </div>
      </div>

      <!-- Kayıt Listesi -->
      <div class="overflow-x-auto">
        <table class="table w-full">
          <thead>
            <tr>
              <th>Kat</th>
              <th>Şirket</th>
              <th>Önceki</th>
              <th>Yeni</th>
              <th>KDV Hariç</th>
              <th>Toplam</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in items" :key="item.id">
              <td>{{ item.unit }}</td>
              <td>{{ item.company }}</td>
              <td><input v-model.number="item.previousValue" type="number" class="input input-sm" /></td>
              <td><input v-model.number="item.currentValue" type="number" class="input input-sm" /></td>
              <td><input v-model.number="item.kdvHaric" type="number" class="input input-sm" /></td>
              <td>{{ formatCurrency(item.kdvHaric * 1.2) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- İşlem Butonları -->
      <div class="modal-action">
        <button class="btn btn-outline" @click="$emit('close')">Kapat</button>
        <button class="btn btn-primary" @click="saveChanges">Kaydet</button>
      </div>
    </div>
  </dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db } from '../firebase'
import { getDocs, doc, updateDoc, query, collection, where } from 'firebase/firestore'

const props = defineProps({ period: String })
const emit = defineEmits(['close', 'updated'])

const items = ref([])
const startDate = ref('')
const endDate = ref('')
const dueDate = ref('')

const formatCurrency = val =>
  isNaN(val) ? '-' : val.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })

const fetchElectricityData = async () => {
  const q = query(collection(db, 'readings'), where('type', '==', 'electricity'), where('period', '==', props.period))
  const snapshot = await getDocs(q)
  items.value = snapshot.docs.map(docSnap => {
    const d = docSnap.data()
    // Tarihleri ilk kayıttan alalım
    if (!startDate.value && d.startDate) startDate.value = d.startDate
    if (!endDate.value && d.endDate) endDate.value = d.endDate
    if (!dueDate.value && d.dueDate) dueDate.value = d.dueDate

    return {
      id: docSnap.id,
      ...d,
      company: d.company || '-'
    }
  })
}

const saveChanges = async () => {
  for (const item of items.value) {
    const ref = doc(db, 'readings', item.id)
    await updateDoc(ref, {
      previousValue: item.previousValue,
      currentValue: item.currentValue,
      kdvHaric: item.kdvHaric,
      toplamTutar: +(item.kdvHaric * 1.2).toFixed(2),
      startDate: startDate.value,
      endDate: endDate.value,
      dueDate: dueDate.value
    })
  }

  alert('Kayıtlar başarıyla güncellendi.')
  emit('updated')
  emit('close')
}

onMounted(fetchElectricityData)
</script>
