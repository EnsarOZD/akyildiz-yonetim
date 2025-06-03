<template>
  <dialog id="waterModal" class="modal" open>
    <div class="modal-box max-w-6xl">
      <h3 class="font-bold text-lg">Su Sayaç Girişi</h3>

      <!-- Tarih ve dönem -->
      <div class="form-control w-48 mt-4">
        <label class="label font-semibold">Dönem</label>
        <input type="month" v-model="selectedPeriod" class="input input-bordered" />
      </div>

      <div class="flex flex-wrap gap-4 mt-2">
        <div class="form-control">
          <label class="label font-semibold">Başlangıç Tarihi</label>
          <input type="date" v-model="startDate" class="input input-bordered" />
        </div>
        <div class="form-control">
          <label class="label font-semibold">Bitiş Tarihi</label>
          <input type="date" v-model="endDate" class="input input-bordered" />
        </div>
        <div class="form-control">
          <label class="label font-semibold">Son Ödeme Tarihi</label>
          <input type="date" v-model="dueDate" class="input input-bordered" />
        </div>
        <div class="form-control">
          <label class="label font-semibold">Gün Sayısı</label>
          <input type="number" :value="dayCount" disabled class="input input-bordered" />
        </div>
      </div>

      <!-- Birim fiyatlar -->
      <div class="flex gap-4 mt-4">
        <div class="form-control w-60">
          <label class="label font-semibold">Su Birim Fiyatı (₺)</label>
          <input type="number" v-model.number="waterUnitPrice" class="input input-bordered" step="0.01" />
        </div>
        <div class="form-control w-60">
          <label class="label font-semibold">Atık Su Birim Fiyatı (₺)</label>
          <input type="number" v-model.number="wasteUnitPrice" class="input input-bordered" step="0.01" />
        </div>
      </div>

      <!-- Sayaç tablosu -->
      <div class="overflow-x-auto mt-6">
        <table class="table w-full border">
          <thead>
            <tr>
              <th>Kat</th>
              <th>Şirket</th>
              <th>Önceki Sayaç</th>
              <th>Yeni Sayaç</th>
              <th>Tüketim</th>
              <th>KDV Hariç</th>
              <th>KDV Dahil</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(reading, index) in readings" :key="index">
              <td>{{ reading.unit }}</td>
              <td>{{ reading.name }}</td>
              <td>
                <input type="number" class="input input-bordered w-24" v-model.number="reading.previous" @input="calculate(index)" />
              </td>
              <td>
                <input type="number" class="input input-bordered w-24" v-model.number="reading.current" @input="calculate(index)" />
              </td>
              <td>{{ formatDecimal(reading.usage) }}</td>
<td>{{ formatDecimal(reading.kdvHaric) }}</td>
<td>{{ formatDecimal(reading.kdvDahil) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Butonlar -->
      <div class="modal-action flex justify-between">
        <div class="space-x-2">
          <button class="btn btn-success" @click="savePartialReadings">Girilenleri Kaydet</button>
          <button class="btn btn-primary" @click="saveReadings">Tümünü Kaydet</button>
        </div>
        <button class="btn" @click="$emit('close')">Kapat</button>
      </div>
    </div>
  </dialog>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { db } from '../firebase'
import { collection, addDoc, getDocs, query, where, orderBy, limit } from 'firebase/firestore'

const tenants = ref([])
const readings = ref([])
const selectedPeriod = ref(new Date().toISOString().slice(0, 7))
const startDate = ref('')
const endDate = ref('')
const dueDate = ref('')
const waterUnitPrice = ref(0)
const wasteUnitPrice = ref(0)

const dayCount = computed(() => {
  if (!startDate.value || !endDate.value) return 0
  const start = new Date(startDate.value)
  const end = new Date(endDate.value)
  const diffTime = end - start
  return Math.floor(diffTime / (1000 * 60 * 60 * 24))
})

const formatDecimal = (value) => {
  if (value === undefined || value === null || isNaN(value)) return '0.00'
  return Number(value).toFixed(2)
}

const fetchLastReadingByUnit = async (unit) => {
  const q = query(
    collection(db, 'readings'),
    where('unit', '==', unit),
    where('type', '==', 'water'),
    orderBy('endDate', 'desc'),
    limit(1)
  )
  const snap = await getDocs(q)
  if (!snap.empty) {
    const data = snap.docs[0].data()
    return data.currentValue || 0
  }
  return 0
}

const fetchTenants = async () => {
  const snapshot = await getDocs(collection(db, 'tenants'))
  tenants.value = []
  readings.value = []

  const staticUnits = [
    { tenantId: 'ortak', unit: 'ORTAK ALAN', name: 'ORTAK ALAN' },
    { tenantId: 'mescit', unit: 'MESCİT', name: 'MESCİT' }
  ]

  for (const s of staticUnits) {
    const prev = await fetchLastReadingByUnit(s.unit)
    readings.value.push({
      ...s,
      previous: prev,
      current: 0,
      usage: 0,
      kdvHaric: 0,
      kdvDahil: 0
    })
  }

  snapshot.forEach(async doc => {
    const data = doc.data()
    if (data.isActive) {
      for (const unit of data.units || []) {
        const prev = await fetchLastReadingByUnit(unit)
        readings.value.push({
          tenantId: doc.id,
          unit,
          name: data.company,
          previous: prev,
          current: 0,
          usage: 0,
          kdvHaric: 0,
          kdvDahil: 0
        })
      }
    }
  })
}

const calculate = (index) => {
  const r = readings.value[index]
  r.usage = r.current - r.previous
<<<<<<< Updated upstream
=======

  const suFiyat = waterUnitPrice.value
  const atikFiyat = wasteUnitPrice.value

  const kdvHaric = r.usage * (suFiyat + atikFiyat)
  const suKdv = r.usage * suFiyat * 0.01
  const atikKdv = r.usage * atikFiyat * 0.10

  r.kdvHaric = kdvHaric
  r.kdvDahil = kdvHaric + suKdv + atikKdv // eksik olan bu satır
  r.toplamTutar = r.kdvDahil              // toplamTutar da aynı değeri kullanabilir
}
>>>>>>> Stashed changes

  const suFiyat = waterUnitPrice.value
  const atikFiyat = wasteUnitPrice.value

  const kdvHaric = r.usage * (suFiyat + atikFiyat)
  const suKdv = r.usage * suFiyat * 0.01
  const atikKdv = r.usage * atikFiyat * 0.10

  r.kdvHaric = kdvHaric
  r.kdvDahil = kdvHaric + suKdv + atikKdv // eksik olan bu satır
  r.toplamTutar = r.kdvDahil              // toplamTutar da aynı değeri kullanabilir
}

const saveReadings = async () => {
  if (!startDate.value || !endDate.value || dayCount.value <= 0) {
    alert("Lütfen geçerli bir tarih aralığı seçin.")
    return
  }

  const colRef = collection(db, 'readings')
  for (const r of readings.value) {
    await addDoc(colRef, {
      tenantId: r.tenantId,
      unit: r.unit,
      period: selectedPeriod.value,
      type: 'water',
      previousValue: r.previous,
      currentValue: r.current,
      usage: r.usage,
      kdvHaric: r.kdvHaric,
      kdvDahil: r.kdvDahil,
      startDate: startDate.value,
      endDate: endDate.value,
      dueDate: dueDate.value,
      dayCount: dayCount.value,
      waterUnitPrice: waterUnitPrice.value,
      wasteUnitPrice: wasteUnitPrice.value
    })
  }

  alert('Tüm kayıtlar başarıyla eklendi.')
  readings.value = []
  fetchTenants()
}

const savePartialReadings = async () => {
  if (!startDate.value || !endDate.value || dayCount.value <= 0) {
    alert("Lütfen geçerli bir tarih aralığı seçin.")
    return
  }

  const colRef = collection(db, 'readings')
  const filled = readings.value.filter(r => r.previous >= 0 && r.current > r.previous)
  for (const r of filled) {
    await addDoc(colRef, {
      tenantId: r.tenantId,
      unit: r.unit,
      period: selectedPeriod.value,
      type: 'water',
      previousValue: r.previous,
      currentValue: r.current,
      usage: r.usage,
      kdvHaric: r.kdvHaric,
      kdvDahil: r.kdvDahil,
      startDate: startDate.value,
      endDate: endDate.value,
      dueDate: dueDate.value,
      dayCount: dayCount.value,
      waterUnitPrice: waterUnitPrice.value,
      wasteUnitPrice: wasteUnitPrice.value
    })
  }

  alert('Girilen kayıtlar başarıyla eklendi.')
  fetchTenants()
}

onMounted(fetchTenants)
</script>
