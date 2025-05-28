<template>
  <dialog id="electricityModal" class="modal" open>
    <div class="modal-box max-w-6xl">
      <h3 class="font-bold text-lg">Elektrik Sayaç Girişi</h3>

      <div class="form-control w-48 mt-4">
        <label class="label">
          <span class="label-text font-semibold">Dönem</span>
        </label>
        <input type="month" v-model="selectedPeriod" class="input input-bordered" />
      </div>

      <div class="flex flex-wrap gap-4 mt-2">
        <div class="form-control">
          <label class="label">
            <span class="label-text font-semibold">İlk Okuma Tarihi</span>
          </label>
          <input type="date" v-model="startDate" class="input input-bordered" />
        </div>
        <div class="form-control">
          <label class="label">
            <span class="label-text font-semibold">Son Okuma Tarihi</span>
          </label>
          <input type="date" v-model="endDate" class="input input-bordered" />
        </div>
        <div class="form-control">
          <label class="label">
            <span class="label-text font-semibold">Gün Sayısı</span>
          </label>
          <input type="number" :value="dayCount" disabled class="input input-bordered" />
        </div>
      </div>

      <div class="overflow-x-auto mt-6">
        <table class="table w-full border">
          <thead>
            <tr>
              <th>Kat</th>
              <th>Şirket</th>
              <th>Önceki Sayaç</th>
              <th>Yeni Sayaç</th>
              <th>Tüketim</th>
              <th>KDV Hariç Tutar</th>
              <th>Toplam Tutar</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(reading, index) in readings" :key="index">
              <td>{{ reading.unit }}</td>
              <td>{{ reading.company }}</td>
              <td>{{ reading.previous }}</td>
              <td><input type="number" class="input input-bordered w-24" v-model.number="reading.current" @input="calculate(index)" /></td>
              <td>{{ reading.usage }}</td>
              <td><input type="number" class="input input-bordered w-28" v-model.number="reading.kdvHaric" /></td>
              <td><input type="number" class="input input-bordered w-28" v-model.number="reading.toplamTutar" /></td>
            </tr>
          </tbody>
        </table>
      </div>

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
import { ref, onMounted, computed } from 'vue'
import { db } from '../firebase'
import { collection, addDoc, getDocs, query, where, orderBy, limit } from 'firebase/firestore'

const selectedPeriod = ref(new Date().toISOString().slice(0, 7))
const readings = ref([])
const startDate = ref('')
const endDate = ref('')
const dayCount = computed(() => {
  if (!startDate.value || !endDate.value) return 0
  const start = new Date(startDate.value)
  const end = new Date(endDate.value)
  const diffTime = end - start
  return Math.floor(diffTime / (1000 * 60 * 60 * 24))
})

const fetchTenantsAndPrevious = async () => {
  const tenantsSnapshot = await getDocs(collection(db, 'tenants'))
  readings.value = []
  const processedUnits = new Set()

  const staticUnits = [
    { tenantId: 'mescit', unit: 'MESCİT', company: 'MESCİT' },
    { tenantId: 'ortak', unit: 'ORTAK ALAN', company: 'ORTAK ALAN' }
  ]

  for (const s of staticUnits) {
    const prev = await fetchLastReadingByUnit(s.unit)
    readings.value.push({
      ...s,
      previous: prev,
      current: 0,
      usage: 0,
      kdvHaric: 0,
      toplamTutar: 0
    })
    processedUnits.add(s.unit)
  }

  tenantsSnapshot.forEach(doc => {
    const data = doc.data()
    if (data.isActive) {
      for (const unit of data.units || []) {
        if (processedUnits.has(unit)) continue
        processedUnits.add(unit)
        fetchLastReadingByUnit(unit).then(prev => {
          readings.value.push({
            tenantId: doc.id,
            unit,
            company: data.company,
            previous: prev,
            current: 0,
            usage: 0,
            kdvHaric: 0,
            toplamTutar: 0
          })
        })
      }
    }
  })
}

const fetchLastReadingByUnit = async (unit) => {
  const q = query(
    collection(db, 'readings'),
    where('unit', '==', unit),
    where('type', '==', 'electricity'),
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

const calculate = (index) => {
  const r = readings.value[index]
  r.usage = r.current - r.previous
}

const saveReadings = async () => {
  const colRef = collection(db, 'readings')
  for (const r of readings.value) {
    await addDoc(colRef, {
      tenantId: r.tenantId,
      unit: r.unit,
      period: selectedPeriod.value,
      type: 'electricity',
      previousValue: r.previous,
      currentValue: r.current,
      consumption: r.usage,
      kdvHaric: r.kdvHaric,
      toplamTutar: r.toplamTutar,
      company: r.company,
      startDate: startDate.value,
      endDate: endDate.value,
      dayCount: dayCount.value
    })
  }
  alert('Tüm elektrik sayaç kayıtları eklendi.')
  readings.value = []
  fetchTenantsAndPrevious()
}

const savePartialReadings = async () => {
  const colRef = collection(db, 'readings')
  const filled = readings.value.filter(r => r.current > 0)
  for (const r of filled) {
    await addDoc(colRef, {
      tenantId: r.tenantId,
      unit: r.unit,
      period: selectedPeriod.value,
      type: 'electricity',
      previousValue: r.previous,
      currentValue: r.current,
      consumption: r.usage,
      kdvHaric: r.kdvHaric,
      toplamTutar: r.toplamTutar,
      company: r.company,
      startDate: startDate.value,
      endDate: endDate.value,
      dayCount: dayCount.value
    })
  }
  alert('Girilen elektrik kayıtları başarıyla eklendi.')
  fetchTenantsAndPrevious()
}

onMounted(fetchTenantsAndPrevious)
</script>
