<template>
  <section class="p-4 space-y-6 max-w-5xl mx-auto">

    <!-- Gider Ekleme Kartı -->
    <div class="card bg-base-100 shadow-lg border border-base-300 p-6 rounded-xl">
      <h2 class="text-center text-lg font-semibold text-base-content mb-4">Gider Ekle</h2>
      <form @submit.prevent="saveExpense" class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input v-model="newExpense.date" type="date" placeholder="Tarih" class="input input-bordered w-full" required />
        <input v-model="newExpense.description" placeholder="Açıklama" class="input input-bordered w-full" required />
        <input v-model="newExpense.amount" type="number" placeholder="Tutar (₺)" class="input input-bordered w-full" required />

        <!-- Gider Tipi -->
        <div class="form-control w-full">
          <label class="label">
            <span class="label-text">Gider Tipi</span>
          </label>
          <select v-model="newExpense.type" class="select select-bordered w-full" required>
            <option disabled value="">Gider Tipi Seçin</option>
            <option v-for="type in expenseTypes" :key="type" :value="type">{{ type }}</option>
          </select>
        </div>

        <!-- Kiracı Seçimi -->
        <div class="form-control w-full">
          <label class="label">
            <span class="label-text">Kiracı</span>
          </label>
          <select v-model="newExpense.tenantId" class="select select-bordered w-full" required>
            <option disabled value="">Kiracı Seçin</option>
            <option v-for="tenant in tenants" :key="tenant.id" :value="tenant.id">
              {{ tenant.company }}
            </option>
          </select>
        </div>

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
              <th class="text-center">Tarih</th>
              <th class="text-center">Açıklama</th>
              <th class="text-center">Tutar</th>
              <th class="text-center">Tip</th>
              <th class="text-center">Kiracı</th>
              <th class="text-center">İşlem</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(e, index) in expenses" :key="index">
              <td class="text-center">{{ e.date }}</td>
              <td class="text-center">{{ e.description }}</td>
              <td class="text-center text-red-600 font-medium">{{ e.amount }} ₺</td>
              <td class="text-center">{{ e.type }}</td>
              <td class="text-center">{{ getTenantName(e.tenantId) }}</td>
              <td>
                <div class="flex justify-center gap-2">
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
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore'

const expenseTypes = ['Aidat', 'Elektrik', 'Su', 'Diğer']
const today = new Date().toISOString().substr(0, 10)
const newExpense = ref({ date: today, description: '', amount: '', tenantId: '', type: '' })
const editMode = ref(false)
const selectedExpenseId = ref(null)
const expenses = ref([])
const tenants = ref([])

const startEdit = (expense) => {
  newExpense.value = {
    date: expense.date,
    description: expense.description,
    amount: expense.amount,
    tenantId: expense.tenantId,
    type: expense.type
  }
  selectedExpenseId.value = expense.id
  editMode.value = true
}

const cancelEdit = () => {
  newExpense.value = { date: today, description: '', amount: '', tenantId: '', type: '' }
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
  if (editMode.value && selectedExpenseId.value) {
    const expenseRef = doc(db, 'expenses', selectedExpenseId.value)
    await updateDoc(expenseRef, { ...newExpense.value })
  } else {
    await addDoc(collection(db, 'expenses'), { ...newExpense.value })
  }

  newExpense.value = { date: today, description: '', amount: '', tenantId: '', type: '' }
  editMode.value = false
  selectedExpenseId.value = null
  await fetchExpenses()
  alert('Gider başarıyla güncellendi.')
}

const fetchExpenses = async () => {
  expenses.value = []
  const querySnapshot = await getDocs(collection(db, 'expenses'))
  querySnapshot.forEach(docSnapshot => {
    expenses.value.push({ id: docSnapshot.id, ...docSnapshot.data() })
  })
}

const fetchTenants = async () => {
  tenants.value = []
  const querySnapshot = await getDocs(collection(db, 'tenants'))
  querySnapshot.forEach(docSnapshot => {
    tenants.value.push({ id: docSnapshot.id, ...docSnapshot.data() })
  })
}

const getTenantName = (tenantId) => {
  const tenant = tenants.value.find(t => t.id === tenantId)
  return tenant ? tenant.company : '—'
}

onMounted(() => {
  fetchExpenses()
  fetchTenants()
})
</script>

<style scoped>
</style>
