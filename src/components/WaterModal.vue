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
import { ref, computed, onMounted, watch } from 'vue'
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

const formatDecimal = (val) => isNaN(val) ? '0.00' : Number(val).toFixed(2)

const fetchLastReadingByUnit = async (unit) => {
  const q = query(
    collection(db, 'readings'),
    where('unit', '==', unit),
    where('type', '==', 'water'),
    orderBy('endDate', 'desc'),
    limit(1)
  )
  const snap = await getDocs(q)
  return !snap.empty ? snap.docs[0].data().currentValue || 0 : 0
}

const fetchTenants = async () => {
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

  const snapshot = await getDocs(collection(db, 'tenants'))
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

const calculate = (i) => {
  const r = readings.value[i]
  r.usage = r.current - r.previous

  const s = r.usage * (waterUnitPrice.value + wasteUnitPrice.value)
  const suKdv = r.usage * waterUnitPrice.value * 0.01
  const atikKdv = r.usage * wasteUnitPrice.value * 0.10

  r.kdvHaric = s
  r.kdvDahil = s + suKdv + atikKdv
  r.toplamTutar = r.kdvDahil
}

watch([waterUnitPrice, wasteUnitPrice], () => {
  readings.value.forEach((_, idx) => calculate(idx))
})

const save = async (onlyFilled = false) => {
  if (!startDate.value || !endDate.value || dayCount.value <= 0) {
    alert('Lütfen geçerli bir tarih aralığı seçin.')
    return
  }

  const colRef = collection(db, 'readings')
  const dataToSave = onlyFilled
    ? readings.value.filter(r => r.previous >= 0 && r.current > r.previous)
    : readings.value

  for (const r of dataToSave) {
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

  alert(onlyFilled ? 'Girilen kayıtlar eklendi.' : 'Tüm kayıtlar eklendi.')
  readings.value = []
  fetchTenants()
}

const saveReadings = () => save(false)
const savePartialReadings = () => save(true)

onMounted(fetchTenants)
</script>
