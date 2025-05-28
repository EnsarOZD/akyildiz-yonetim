<template>
  <section class="p-4 max-w-5xl mx-auto space-y-6">
    <h2 class="text-xl font-bold text-center">Sayaç Kayıtları</h2>

    <div class="flex gap-4">
      <button class="btn btn-primary" @click="showElectricityModal = true">Elektrik Girişi</button>
      <button class="btn btn-secondary" @click="showWaterModal = true">Su Girişi</button>
    </div>

    <div class="overflow-x-auto mt-6">
      <table class="table w-full border">
        <thead>
          <tr>
            <th>Dönem</th>
            <th>Kat</th>
            <th>Şirket</th>
            <th>Tip</th>
            <th>Tüketim</th>
            <th>KDV Hariç</th>
            <th>Toplam (₺)</th>
            <th>İşlem</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in readings" :key="r.id">
            <td>{{ r.period }}</td>
            <td>{{ r.unit }}</td>
            <td>{{ r.tenantId === 'ortak' ? 'Ortak Alan' : r.tenantId === 'mescit' ? 'Mescit' : r.tenantName || '-' }}</td>
            <td>{{ r.type === 'electricity' ? 'Elektrik' : 'Su' }}</td>
            <td>{{ r.consumption ?? r.usage }}</td>
            <td>{{ r.kdvHaric?.toFixed(2) || '-' }}</td>
            <td>{{ r.toplamTutar?.toFixed(2) || r.amount?.toFixed(2) || '-' }}</td>
            <td>
              <div class="flex gap-2">
                <button class="btn btn-xs btn-info" @click="editRecord(r)">Düzenle</button>
                <button class="btn btn-xs btn-error" @click="deleteRecord(r.id)">Sil</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <ElectricityModal v-if="showElectricityModal" @close="handleClose" />
    <WaterModal v-if="showWaterModal" @close="handleClose" />
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db } from '../firebase'
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'
import ElectricityModal from './ElectricityModal.vue'
import WaterModal from './WaterModal.vue'

const showElectricityModal = ref(false)
const showWaterModal = ref(false)
const readings = ref([])

const fetchReadings = async () => {
  readings.value = []

  const tenantsSnapshot = await getDocs(collection(db, 'tenants'))
  const tenantMap = {}
  tenantsSnapshot.forEach(doc => {
    const data = doc.data()
    tenantMap[doc.id] = data.company
  })

  const snapshot = await getDocs(collection(db, 'readings'))
  snapshot.forEach(docSnap => {
    const data = docSnap.data()
    const company = data.tenantId === 'ortak'
      ? 'Ortak Alan'
      : data.tenantId === 'mescit'
      ? 'Mescit'
      : tenantMap[data.tenantId] || '-'

    readings.value.push({
      id: docSnap.id,
      ...data,
      tenantName: company
    })
  })
}

const handleClose = () => {
  showElectricityModal.value = false
  showWaterModal.value = false
  fetchReadings()
}

const deleteRecord = async (id) => {
  if (confirm("Bu kaydı silmek istediğinizden emin misiniz?")) {
    await deleteDoc(doc(db, 'readings', id))
    readings.value = readings.value.filter(r => r.id !== id)
  }
}

const editRecord = (record) => {
  alert(`Düzenleme işlemi için kayıt: ${record.unit} (${record.period})`)
  // Düzenleme modalı ileride eklenecek
}

onMounted(fetchReadings)
</script>
