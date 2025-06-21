<template>
  <div class="card bg-base-100 shadow-xl">
    <div class="card-body">
      <div class="flex justify-between items-center mb-4">
        <h2 class="card-title">Son İşlemler</h2>
        <FilterBar
          v-model:type="model"
          :type-options="typeOptions"
          @clear-filters="handleClearFilters"
        />
      </div>
      <div class="overflow-x-auto">
        <table class="table table-zebra w-full">
          <thead>
            <tr>
              <th>Tarih</th>
              <th>Açıklama</th>
              <th>Kategori</th>
              <th class="text-right">Tutar</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items" :key="item.id">
              <td>{{ formatDate(item.date) }}</td>
              <td>{{ item.description || (item.payer ? `Ödeme - ${item.payer}` : 'Gider') }}</td>
              <td>
                <span :class="item.type === 'income' ? 'badge badge-success' : 'badge badge-error'">
                  {{ item.type === 'income' ? 'Gelir' : 'Gider' }}
                </span>
              </td>
              <td class="text-right font-semibold" :class="item.type === 'income' ? 'text-green-600' : 'text-red-600'">
                {{ formatCurrency(item.amount) }}
              </td>
            </tr>
            <tr v-if="!items.length">
              <td colspan="4" class="text-center italic text-gray-500">Gösterilecek aktivite bulunmuyor.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="$slots.footer" class="card-actions justify-end mt-4">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import FilterBar from '@/components/common/FilterBar.vue'

const model = defineModel('type')

defineProps({
  items: {
    type: Array,
    required: true,
  },
  formatDate: {
    type: Function,
    default: (d) => d,
  },
  formatCurrency: {
    type: Function,
    default: (v) => v,
  },
  typeOptions: {
    type: Array,
    default: () => []
  }
})

const handleClearFilters = () => {
  model.value = 'all'
  console.log('✅ Tüm filtreler temizlendi')
}
</script>
