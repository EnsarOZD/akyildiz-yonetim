<template>
  <section class="p-4 space-y-6 max-w-5xl mx-auto">

<!-- Gider Ekleme Kartı -->
<div class="card bg-base-100 shadow-lg border border-base-300 p-6 rounded-xl">
  <h2 class="text-center text-lg font-semibold text-base-content mb-4">Gider Ekle</h2>
  <form @submit.prevent="saveExpense" class="grid grid-cols-1 md:grid-cols-3 gap-4">

    <!-- Gider Tipi -->
    <div class="form-control md:col-span-1">
      <label class="label font-semibold">Gider Tipi</label>
      <select v-model="newExpense.type" class="select select-bordered w-full" required>
        <option disabled value="">Seçiniz</option>
        <option v-for="type in expenseTypes" :key="type" :value="type">{{ type }}</option>
      </select>
    </div>

    <!-- Tarih -->
    <div class="form-control md:col-span-1">
      <label class="label font-semibold">Tarih</label>
      <input v-model="newExpense.date" type="date" class="input input-bordered w-full" required />
    </div>

    <!-- Tutar -->
    <div class="form-control md:col-span-1">
      <label class="label font-semibold">Tutar (₺)</label>
      <input v-model="newExpense.amount" type="number" min="0" step="0.01" class="input input-bordered w-full" required />
    </div>

    <!-- Açıklama -->
    <div class="form-control md:col-span-3">
      <label class="label font-semibold">Açıklama</label>
      <input v-model="newExpense.description" placeholder="Açıklama giriniz" class="input input-bordered w-full" required />
    </div>

    <!-- Butonlar -->
    <div class="md:col-span-3 flex justify-end gap-2 pt-2">
      <button type="submit" class="btn btn-primary">{{ editMode ? 'Kaydet' : 'Ekle' }}</button>
      <button v-if="editMode" type="button" @click="cancelEdit" class="btn btn-outline btn-warning">Vazgeç</button>
    </div>
  </form>
</div>


        
    

    <!-- Gider Listesi -->
    <div class="card bg-base-100 shadow-lg border border-base-300 p-6 rounded-xl">
      <h3 class="text-center text-lg font-semibold text-base-content mb-4">Gider Listesi</h3>
      <div class="overflow-x-auto rounded-lg border border-base-300">
        <table class="table table-zebra w-full text-sm">
          <thead>
  <tr>
    <th class="text-center">Tarih</th>
    <th class="text-center">Açıklama</th>
    <th class="text-center">Tutar</th>
    <th class="text-center">Tip</th>
    <th class="text-center">İşlem</th>
  </tr>
</thead>
<tbody>
  <tr v-for="(e, index) in expenses" :key="index">
    <td class="text-center">{{ e.date }}</td>
    <td class="text-center">{{ e.description }}</td>
    <td class="text-center text-red-600 font-medium">{{ formatCurrency(e.amount) }}</td>
    <td class="text-center">{{ e.type }}</td>
    <td class="text-center">
      <div class="dropdown dropdown-end">
        <label tabindex="0" class="btn btn-xs btn-outline">İşlemler</label>
        <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-32">
          <li><a @click.prevent="startEdit(e)">Düzenle</a></li>
          <li><a @click.prevent="deleteExpense(e.id)">Sil</a></li>
        </ul>
      </div>
    </td>
  </tr>
</tbody>
        </table>
      </div>
    </div>

  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db } from '../firebase'
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore'

const expenseTypes = [
  'Elektrik (Genel)',
  'Su (Genel)',
  'Maaş',
  'Vergi',
  'Bakım',
  'Temizlik',
  'Yönetici Ücreti',
  'Diğer'
]
const today = new Date().toISOString().substr(0, 10)

const newExpense = ref({
  date: today,
  description: '',
  amount: '',
  type: ''
})
const editMode = ref(false)
const selectedExpenseId = ref(null)
const expenses = ref([])

const formatCurrency = (value) => {
  if (value === undefined || value === null || isNaN(value)) return '-'
  return Number(value).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })
}

const startEdit = (expense) => {
  newExpense.value = {
    date: expense.date,
    description: expense.description,
    amount: expense.amount,    
    type: expense.type
  }
  selectedExpenseId.value = expense.id
  editMode.value = true
}

const cancelEdit = () => {
  newExpense.value = { date: today, description: '', amount: '', type: '' }
  editMode.value = false
  selectedExpenseId.value = null
}

const deleteExpense = async (id) => {
  try {
    await deleteDoc(doc(db, 'expenses', id))
    expenses.value = expenses.value.filter(e => e.id !== id)
  } catch (error) {
    console.error('Silme işlemi başarısız:', error)
  }
}

const saveExpense = async () => {
  try {
    if (editMode.value && selectedExpenseId.value) {
      const ref = doc(db, 'expenses', selectedExpenseId.value)
      await updateDoc(ref, { ...newExpense.value })
    } else {
      await addDoc(collection(db, 'expenses'), { ...newExpense.value })
    }

    cancelEdit()
    await fetchExpenses()
    alert('Gider başarıyla kaydedildi.')
  } catch (error) {
    console.error('Kayıt hatası:', error)
  }
}

const fetchExpenses = async () => {
  expenses.value = []
  const querySnapshot = await getDocs(collection(db, 'expenses'))
  querySnapshot.forEach(docSnapshot => {
    expenses.value.push({ id: docSnapshot.id, ...docSnapshot.data() })
  })
}

onMounted(() => {
  fetchExpenses()  
})
</script>

<style scoped>
</style>
