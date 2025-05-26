<template>
  <section class="p-4 space-y-6 max-w-5xl mx-auto">

    <!-- Gider Ekleme Kartı -->
    <div class="card bg-base-100 shadow-lg border border-base-300 p-6 rounded-xl">
      <h2 class="text-center text-lg font-semibold text-base-content mb-4">Gider Ekle</h2>
      <form @submit.prevent="saveExpense" class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input v-model="newExpense.date" type="date" placeholder="Tarih" class="input input-bordered w-full" required />
        <input v-model="newExpense.description" placeholder="Açıklama" class="input input-bordered w-full" required />
        <input v-model="newExpense.amount" type="number" placeholder="Tutar (₺)" class="input input-bordered w-full" required />
        <div class="md:col-span-3 flex justify-end gap-2">
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
              <th>Tarih</th>
              <th>Açıklama</th>
              <th>Tutar</th>
              <th>İşlem</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(e, index) in expenses" :key="index">
              <td>{{ e.date }}</td>
              <td>{{ e.description }}</td>
              <td class="text-red-600 font-medium">{{ e.amount }} ₺</td>
              <td>
                <div class="flex gap-2">
                  <button @click="deleteExpense(e.id)" class="btn btn-xs btn-error">Sil</button>
                  <button @click="startEdit(e)" class="btn btn-xs btn-info">Düzenle</button>
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
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore'
import { updateDoc } from 'firebase/firestore'

// 🟢 Form verisi
const newExpense = ref({
  date: '',
  description: '',
  amount: ''
})

const editMode = ref(false)
const selectedExpenseId = ref(null)


// 🟢 Liste verisi
const expenses = ref([])

// 🟢 Gider ekleme fonksiyonu


const startEdit = (expense) => {
  newExpense.value = {
    date: expense.date,
    description: expense.description,
    amount: expense.amount
  }
  selectedExpenseId.value = expense.id
  editMode.value = true
}

const cancelEdit = () => {
  newExpense.value = { date: '', description: '', amount: '' }
  editMode.value = false
  selectedExpenseId.value = null
}

// 🟢 Gider silme fonksiyonu
const deleteExpense = async (id) => {
  try {
    await deleteDoc(doc(db, 'expenses', id))
    expenses.value = expenses.value.filter(e => e.id !== id)
  } catch (error) {
    console.error('Silme işlemi başarısız:', error)
  }
}

const saveExpense = async () => {
  if (editMode.value && selectedExpenseId.value) {
    const expenseRef = doc(db, 'expenses', selectedExpenseId.value)
    await updateDoc(expenseRef, {
      date: newExpense.value.date,
      description: newExpense.value.description,
      amount: newExpense.value.amount
    })
  } else {
    await addDoc(collection(db, 'expenses'), {
      date: newExpense.value.date,
      description: newExpense.value.description,
      amount: newExpense.value.amount
    })
  }

  newExpense.value = { date: '', description: '', amount: '' }
  editMode.value = false
  selectedExpenseId.value = null
  await fetchExpenses()
  alert('Gider başarıyla güncellendi.')
}

// 🟢 Firestore'dan giderleri çekme
const fetchExpenses = async () => {
  expenses.value = []
  const querySnapshot = await getDocs(collection(db, 'expenses'))
  querySnapshot.forEach(docSnapshot => {
    expenses.value.push({
      id: docSnapshot.id,
      ...docSnapshot.data()
    })
  })
}

// 🟢 Sayfa yüklendiğinde giderleri getir
onMounted(fetchExpenses)
</script>

<style scoped>

</style>
