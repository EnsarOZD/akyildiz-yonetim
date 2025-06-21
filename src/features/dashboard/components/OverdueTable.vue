<template>
  <div class="card bg-base-100 shadow-md border border-base-300">
    <div class="card-body">
      <div class="flex justify-between items-center mb-2">
        <h2 class="text-lg font-semibold text-red-500">⏰ Geciken Ödemeler</h2>
        <router-link v-if="showAllLink" to="/overdue" class="btn btn-sm btn-outline btn-warning">Tümünü Gör</router-link>
      </div>
      <div class="overflow-x-auto">
        <table class="table table-sm w-full text-sm">
          <thead>
            <tr>
              <th>Firma</th>
              <th>Tip</th>
              <th>Dönem</th>
              <th>Son Ödeme</th>
              <th>Kat</th>
              <th>Tutar</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in items" :key="i">
              <td>{{ item.company }}</td>
              <td>{{ item.typeLabel }}</td>
              <td>{{ item.period || '-' }}</td>
              <td>{{ new Date(item.dueDate).toLocaleDateString('tr-TR') }}</td>
              <td>{{ item.floor }}</td>
              <td>{{ formatCurrency(item.amount) }}</td>
            </tr>
          </tbody>
        </table>
        <p v-if="!items.length" class="text-gray-400 italic text-sm mt-2">Geciken ödeme bulunmuyor.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  items: Array,
  showAllLink: {
    type: Boolean,
    default: true
  }
})
const formatCurrency = (value) =>
  Number(value || 0).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })
</script>
