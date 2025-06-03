<template>
  <section class="p-4 max-w-5xl mx-auto space-y-6">
    <h2 class="text-2xl font-bold text-center text-white dark:bg-gray-900 dark:text-white">Sayaç Kayıtları</h2>

    <div class="flex gap-4 justify-center">
      <button class="btn btn-primary" @click="showElectricityModal = true">⚡ Elektrik Girişi</button>
      <button class="btn btn-secondary" @click="showWaterModal = true">💧 Su Girişi</button>
      <button class="btn btn-primary mb-4" @click="showAidatModal = true">💰 Aidat Girişi</button>
    </div>

    <div class="flex flex-wrap gap-4 items-center mt-4">
      <input v-model="searchTerm" type="text" placeholder="Şirket Ara..." class="input input-bordered w-48" />
      <input v-model="selectedPeriod" type="month" class="input input-bordered w-40" />
      <select v-model="selectedType" class="select select-bordered w-40">
        <option value="all">Tümü</option>
        <option value="electricity">Elektrik</option>
        <option value="water">Su</option>
        <option value="aidat">Aidat</option>
      </select>

      <button class="btn btn-error btn-sm" @click="deleteByPeriod" :disabled="!selectedPeriod">Seçilen Dönemi Sil</button>
      <button class="btn btn-outline btn-sm" @click="openEditElectricityModal" :disabled="!selectedPeriod">Elektrik Kayıtlarını Düzenle</button>
      <button @click="showDistributeModal = true" class="btn btn-warning">⚡ Ortak Gider Paylaştır</button>
    </div>

    <div class="overflow-x-auto mt-6">
      <table class="table table-zebra w-full border text-sm text-white dark:bg-gray-800 dark:text-gray-100">
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
            <th>Açıklama</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in filteredReadings" :key="r.id">
            <td>{{ r.period }}</td>
            <td>{{ r.unit || '-' }}</td>
            <td>
              <span v-if="r.tenantId === 'ortak'">Ortak Alan</span>
              <span v-else-if="r.tenantId === 'mescit'">Mescit</span>
              <span v-else>{{ r.tenantName || '-' }}</span>
            </td>
            <td>
              <span :class="{
                'text-yellow-600 dark:text-yellow-400': r.type === 'electricity',
                'text-blue-600 dark:text-blue-400': r.type === 'water',
                'text-green-600 dark:text-green-400': r.type === 'aidat'
              }">
                {{ r.type === 'electricity' ? 'Elektrik' : r.type === 'water' ? 'Su' : 'Aidat' }}
              </span>
            </td>
            <td>{{ formatUsage(r.consumption ?? r.usage) }}</td>
            <td>{{ formatCurrency(r.kdvHaric) }}</td>
            <td class="text-right font-semibold text-blue-300">{{ formatCurrency(r.toplamTutar ?? r.kdvDahil) }}</td>
            <td>
              <div class="dropdown dropdown-end">
                <label tabindex="0" class="btn btn-xs btn-outline">İşlemler</label>
                <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-32">
                  <li><a @click.prevent="editRecord(r)">Düzenle</a></li>
                  <li><a @click.prevent="deleteRecord(r.id)">Sil</a></li>
                </ul>
              </div>
            </td>
            <td>{{ r.description || '-' }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <ElectricityModal v-if="showElectricityModal" @close="handleClose" />
    <WaterModal v-if="showWaterModal" @close="handleClose" />
    <AidatModal v-if="showAidatModal" @close="() => (showAidatModal = false)" @refresh="fetchReadings" />
    <EditElectricityModal v-if="showEditElectricityModal" :period="selectedPeriod" @close="() => (showEditElectricityModal = false)" @updated="fetchReadings" />

    <dialog id="distributeModal" class="modal" :open="showDistributeModal">
      <div class="modal-box">
        <h3 class="font-bold text-lg mb-4">Ortak Gider Paylaştır</h3>
        <div class="form-control mb-2">
          <label class="label">Dönem</label>
          <input type="month" v-model="selectedPeriod" class="input input-bordered" />
        </div>
        <div class="form-control mb-4">
          <label class="label">Gider Tipi</label>
          <select v-model="selectedType" class="select select-bordered">
            <option value="electricity">Elektrik</option>
            <option value="water">Su</option>
          </select>
        </div>
        <div class="modal-action">
          <button @click="distributeSharedExpense" class="btn btn-success">Paylaştır</button>
          <button @click="showDistributeModal = false" class="btn">Kapat</button>
        </div>
      </div>
    </dialog>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { db } from '../firebase'
import { collection, getDocs, deleteDoc, doc, addDoc, query, where } from 'firebase/firestore'
import ElectricityModal from './ElectricityModal.vue'
import WaterModal from './WaterModal.vue'
import AidatModal from './AidatModal.vue'
import EditElectricityModal from './EditElectricityModal.vue'

const showElectricityModal = ref(false)
const showWaterModal = ref(false)
const showAidatModal = ref(false)
const showEditElectricityModal = ref(false)
const showDistributeModal = ref(false)

const readings = ref([])
const searchTerm = ref('')
const selectedPeriod = ref('')
const selectedType = ref('all')

const filteredReadings = computed(() => {
  return readings.value.filter(r => {
    const matchesSearch = r.tenantName?.toLowerCase().includes(searchTerm.value.toLowerCase())
    const matchesPeriod = selectedPeriod.value === '' || r.period === selectedPeriod.value
    const matchesType = selectedType.value === 'all' || r.type === selectedType.value
    return matchesSearch && matchesPeriod && matchesType
  })
})

const formatUsage = (value) => {
  if (value === undefined || value === null || isNaN(value)) return '-'
  return Number(value).toFixed(0)
}

const formatCurrency = (value) => {
  if (value === undefined || value === null || isNaN(value)) return '-'
  return value.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })
}

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
    const company =
      data.tenantId === 'ortak'
        ? 'Ortak Alan'
        : data.tenantId === 'mescit'
        ? 'Mescit'
        : tenantMap[data.tenantId] || '-'
    readings.value.push({ id: docSnap.id, ...data, tenantName: company })
  })
}

const distributeSharedExpense = async () => {
  if (!selectedPeriod.value || selectedType.value === 'all') {
    alert('Lütfen dönem ve gider tipini seçiniz.')
    return
  }

  // 🔒 1. Aynı dönem ve tip için dağıtım daha önce yapıldı mı kontrol et
  const distCheckQuery = query(
    collection(db, 'sharedDistributions'),
    where('period', '==', selectedPeriod.value),
    where('type', '==', selectedType.value)
  )
  const distCheckSnap = await getDocs(distCheckQuery)
  if (!distCheckSnap.empty) {
    alert("Bu dönem ve tip için ortak gider zaten paylaştırılmış.")
    return
  }

  // 📊 2. Ortak ve mescit kayıtlarını al
  const q = query(
    collection(db, 'readings'),
    where('period', '==', selectedPeriod.value),
    where('type', '==', selectedType.value),
    where('tenantId', 'in', ['ortak', 'mescit'])
  )
  const snapshot = await getDocs(q)
  let total = 0
  snapshot.forEach(doc => {
    total += Number(doc.data().kdvDahil || doc.data().toplamTutar || 0)
  })

  // 👥 3. Tüm kat bazlı girişleri al
  const tenantsSnap = await getDocs(collection(db, 'tenants'))
  const entries = []
  tenantsSnap.forEach(doc => {
    const data = doc.data()
    if (data.units && Array.isArray(data.units)) {
      data.units.forEach(unit => {
        entries.push({
          tenantId: doc.id,
          tenantName: data.company,
          unit
        })
      })
    }
  })

  if (entries.length === 0) {
    alert("Hiçbir kiracıya ait kat bilgisi bulunamadı.")
    return
  }

  // 💸 4. Payı hesapla ve kayıtları oluştur
  const amountPerUnit = total / entries.length
  const typeLabel = selectedType.value === 'electricity' ? 'Elektrik' : 'Su'

  for (const e of entries) {
    await addDoc(collection(db, 'readings'), {
      tenantId: e.tenantId,
      tenantName: e.tenantName,
      unit: e.unit,
      period: selectedPeriod.value,
      type: selectedType.value,
      consumption: null,
      kdvHaric: null,
      kdvDahil: amountPerUnit,
      toplamTutar: amountPerUnit,
      description: `Ortak ${typeLabel} Gider Payı`
    })
  }

  // 📁 5. Dağıtım yapıldı bilgisi kaydet
  await addDoc(collection(db, 'sharedDistributions'), {
    period: selectedPeriod.value,
    type: selectedType.value,
    distributed: true,
    distributedAt: new Date()
  })

  alert('Ortak gider başarıyla paylaştırıldı.')
  showDistributeModal.value = false
  fetchReadings()
}

const handleClose = () => {
  showElectricityModal.value = false
  showWaterModal.value = false
  showAidatModal.value = false
  fetchReadings()
}

const deleteByPeriod = async () => {
  if (!selectedPeriod.value) return
  const q = query(collection(db, 'readings'), where('period', '==', selectedPeriod.value))
  const snapshot = await getDocs(q)
  await Promise.all(snapshot.docs.map(docSnap => deleteDoc(doc(db, 'readings', docSnap.id))))
  alert('Kayıtlar silindi.')
  fetchReadings()
}

const deleteRecord = async (id) => {
  if (confirm('Bu kaydı silmek istediğinizden emin misiniz?')) {
    await deleteDoc(doc(db, 'readings', id))
    readings.value = readings.value.filter(r => r.id !== id)
  }
}

const editRecord = (record) => {
  alert(`Düzenleme işlemi için kayıt: ${record.unit || '-'} (${record.period})`)
}

const openEditElectricityModal = () => {
  if (!selectedPeriod.value) {
    alert('Lütfen önce dönem seçiniz.')
    return
  }
  showEditElectricityModal.value = true
}

onMounted(fetchReadings)
</script>
