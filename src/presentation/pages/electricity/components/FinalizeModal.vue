<template>
  <div class="modal modal-open" data-testid="finalize-modal">
    <div class="modal-box max-w-2xl">
      <h3 class="font-bold text-lg mb-2">Dönemi Onayla</h3>
      <p class="text-sm text-slate-500 mb-3">
        Onaylandığında aşağıdaki elektrik borçları oluşturulur ve dönem kilitlenir.
      </p>

      <div v-if="detail.warnings?.length" class="border border-yellow-200 bg-yellow-50 text-yellow-800 rounded-xl p-3 text-sm space-y-1 mb-3" data-testid="finalize-warnings">
        <div v-for="(m, i) in detail.warnings" :key="'w' + i">{{ m }}</div>
      </div>

      <div class="overflow-x-auto border border-slate-200 rounded-xl max-h-72 overflow-y-auto">
        <table class="table table-sm" data-testid="finalize-debts">
          <thead>
            <tr>
              <th>Kat</th>
              <th>Cari</th>
              <th>Aralık</th>
              <th class="text-right">KDV Dahil</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!debts.length">
              <td colspan="4" class="text-center text-slate-400 py-4">Oluşacak borç yok.</td>
            </tr>
            <tr v-for="r in debts" :key="r.readingId + '-' + r.flatId">
              <td>{{ r.flatCode }}</td>
              <td>{{ r.debtorName || '-' }}</td>
              <td class="whitespace-nowrap text-xs">{{ formatDate(r.startDate) }} - {{ formatDate(r.endDate) }}</td>
              <td class="text-right whitespace-nowrap">{{ formatMoney(r.total) }}</td>
            </tr>
          </tbody>
          <tfoot v-if="debts.length">
            <tr class="font-bold">
              <td colspan="3">Toplam ({{ debts.length }} borç)</td>
              <td class="text-right whitespace-nowrap" data-testid="finalize-total">{{ formatMoney(sum) }}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <p v-if="error" class="text-sm text-red-600 mt-3 whitespace-pre-line" data-testid="finalize-error">{{ error }}</p>

      <div class="modal-action">
        <button type="button" class="btn btn-sm btn-ghost" :disabled="busy" @click="emit('close')">Vazgeç</button>
        <button type="button" class="btn btn-sm btn-primary" :disabled="busy || !canConfirm" data-testid="finalize-confirm" @click="emit('confirm')">
          <span v-if="busy" class="loading loading-spinner loading-xs"></span>
          Onayla
        </button>
      </div>
    </div>
    <div class="modal-backdrop" @click="!busy && emit('close')"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatDate, formatMoney } from '../electricityHelpers'

const props = defineProps({
  detail: { type: Object, required: true },
  error: { type: String, default: '' },
  busy: { type: Boolean, default: false }
})
const emit = defineEmits(['close', 'confirm'])

const debts = computed(() => (props.detail.reportRows || []).filter(r => Number(r.total) > 0))
const sum = computed(() => debts.value.reduce((s, r) => s + Number(r.total || 0), 0))
const canConfirm = computed(() => !props.detail.errors?.length)
</script>
