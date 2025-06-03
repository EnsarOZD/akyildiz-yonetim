<template>
  <dialog open class="modal">
    <div class="modal-box max-w-xl">
      <h3 class="font-bold text-lg mb-6 text-center">Aidat Oluştur</h3>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Dönem ve Son Ödeme Tarihi -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="form-control">
            <label class="label font-semibold">Dönem</label>
            <input type="month" v-model="period" class="input input-bordered w-full" required />
          </div>
          <div class="form-control">
            <label class="label font-semibold">Son Ödeme Tarihi</label>
            <input type="date" v-model="dueDate" class="input input-bordered w-full" required />
          </div>
        </div>

        <div class="flex justify-end mt-6">
          <button type="button" class="btn btn-outline mr-2" @click="handleClose">İptal</button>
          <button type="submit" class="btn btn-primary">Oluştur</button>
        </div>
      </form>
    </div>
  </dialog>
</template>

<script setup>
import { ref } from 'vue'
import { db } from '../firebase'
import { collection, getDocs, query, where, addDoc } from 'firebase/firestore'

const emit = defineEmits(['close', 'refresh'])

const period = ref('')
const dueDate = ref('')

const handleClose = () => {
  emit('close')
}

const handleSubmit = async () => {
  try {
    if (!period.value || !dueDate.value) {
      alert("Lütfen dönem ve son ödeme tarihini giriniz.")
      return
    }

    const year = parseInt(period.value.slice(0, 4))
    const snapshot = await getDocs(
      query(collection(db, 'annualDues'), where('year', '==', year))
    )

    const dues = []
    snapshot.forEach(doc => {
      const data = doc.data()
      if (data.amount > 0) {
        dues.push({
          tenantId: data.tenantId,
          unit: data.unit,
          kdvHaric: data.amount,
          toplamTutar: data.vatIncludedAmount
        })
      }
    })

    if (dues.length === 0) {
      alert('Bu yıla ait tanımlı aidat bilgisi bulunamadı.')
      return
    }

    for (const due of dues) {
      await addDoc(collection(db, 'aidatRecords'), {
        tenantId: due.tenantId,
        unit: due.unit,
        period: period.value,
        dueDate: dueDate.value,
        kdvHaric: due.kdvHaric,
        toplamTutar: due.toplamTutar,
        type: 'aidat',
        createdAt: new Date()
      })
    }

    alert('Aidatlar başarıyla oluşturuldu.')
    emit('refresh')
    emit('close')
  } catch (error) {
    console.error('Aidat kayıt hatası:', error)
    alert('Bir hata oluştu. Konsolu kontrol ediniz.')
  }
}
</script>
