<template>
  <dialog open class="modal">
    <div class="modal-box max-w-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      
      <!-- Modal Header -->
      <div class="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center gap-3">
          <div class="bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 rounded-full p-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100">Aidat Oluştur</h3>
        </div>
        <button @click="handleClose" class="btn btn-ghost btn-sm">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Form Content -->
      <form @submit.prevent="handleSubmit" class="space-y-6">
        
        <!-- Dönem ve Son Ödeme Tarihi -->
        <div class="space-y-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold text-gray-700 dark:text-gray-300">Dönem</span>
              <span class="label-text-alt text-red-500">*</span>
            </label>
            <input 
              type="month" 
              v-model="period" 
              class="input input-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300" 
              required 
            />
            <label class="label">
              <span class="label-text-alt text-gray-500 dark:text-gray-400">Aidatın geçerli olacağı ay ve yıl</span>
            </label>
          </div>
          
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold text-gray-700 dark:text-gray-300">Son Ödeme Tarihi</span>
              <span class="label-text-alt text-red-500">*</span>
            </label>
            <input 
              type="date" 
              v-model="dueDate" 
              class="input input-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300" 
              required 
            />
            <label class="label">
              <span class="label-text-alt text-gray-500 dark:text-gray-400">Aidatın son ödeme tarihi</span>
            </label>
          </div>
        </div>

        <!-- Bilgi Kutusu -->
        <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <div class="flex items-start gap-3">
            <div class="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full p-1 mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="text-sm text-gray-700 dark:text-gray-300">
              <p class="font-medium mb-1">Bilgi</p>
              <p>Seçilen dönem için yıllık aidat tanımlarından otomatik olarak aidat kayıtları oluşturulacaktır.</p>
            </div>
          </div>
        </div>

        <!-- Modal Actions -->
        <div class="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button 
            type="button" 
            class="btn btn-outline btn-sm" 
            @click="handleClose"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            İptal
          </button>
          <button 
            type="submit" 
            class="btn btn-primary btn-sm"
            :disabled="!period || !dueDate"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Oluştur
          </button>
        </div>
      </form>
    </div>
  </dialog>
</template>

<script setup>
import { ref } from 'vue'
import { db } from '../../firebase'
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

    // 1. Kiracı Aidatlarını İşle
    const annualDuesQuery = query(collection(db, 'annualDues'), where('year', '==', year));
    const annualDuesSnap = await getDocs(annualDuesQuery);
    
    let tenantDuesCreated = 0;
    for (const docSnap of annualDuesSnap.docs) {
      const data = docSnap.data();
      if (data.amount > 0) {
        // Bu dönem için zaten aidat var mı?
        const existingRecordQuery = query(collection(db, 'aidatRecords'), 
          where('tenantId', '==', data.tenantId),
          where('unit', '==', data.unit),
          where('period', '==', period.value)
        );
        const existingRecordSnap = await getDocs(existingRecordQuery);

        if (existingRecordSnap.empty) {
          await addDoc(collection(db, 'aidatRecords'), {
            tenantId: data.tenantId,
            unit: data.unit,
            period: period.value,
            dueDate: dueDate.value,
            kdvHaric: data.amount,
            toplamTutar: data.vatIncludedAmount,
            type: 'aidat',
            isPaid: false,
            createdAt: new Date(),
          });
          tenantDuesCreated++;
        }
      }
    }

    // 2. Mal Sahibi Aidatlarını İşle
    const ownerDuesQuery = query(collection(db, 'ownerDues'), where('year', '==', year));
    const ownerDuesSnap = await getDocs(ownerDuesQuery);

    let ownerDuesCreated = 0;
    for (const docSnap of ownerDuesSnap.docs) {
      const data = docSnap.data();
      if (data.isActive && data.amount > 0) {
        // Bu dönem için zaten aidat var mı?
        const existingRecordQuery = query(collection(db, 'ownerAidatRecords'), 
          where('unit', '==', data.unit),
          where('period', '==', period.value)
        );
        const existingRecordSnap = await getDocs(existingRecordQuery);

        if (existingRecordSnap.empty) {
          await addDoc(collection(db, 'ownerAidatRecords'), {
            ownerId: data.ownerId || 'MAL_SAHIBI',
            unit: data.unit,
            period: period.value,
            dueDate: dueDate.value,
            kdvHaric: data.amount,
            toplamTutar: data.vatIncludedAmount,
            type: 'aidat',
            isPaid: false,
            createdAt: new Date(),
          });
          ownerDuesCreated++;
        }
      }
    }

    if (tenantDuesCreated === 0 && ownerDuesCreated === 0) {
      alert(`Seçilen dönem (${period.value}) için zaten tüm aidat kayıtları oluşturulmuş veya tanımlı aidat bulunmuyor.`);
      return;
    }

    alert(`${tenantDuesCreated} kiracı ve ${ownerDuesCreated} mal sahibi için aidat kayıtları başarıyla oluşturuldu.`);
    emit('refresh')
    emit('close')
  } catch (error) {
    console.error('Aidat kayıt hatası:', error)
    alert('Bir hata oluştu. Konsolu kontrol ediniz.')
  }
}
</script>
