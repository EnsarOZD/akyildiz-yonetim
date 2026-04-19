<template>
  <div class="space-y-8 animate-fade-in">
    <!-- Başlık Bölümü -->
    <div class="flex items-center gap-4 px-1">
      <div class="w-12 h-12 rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-400 shadow-lg shadow-brand-500/5">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <div>
        <h2 class="text-2xl font-black text-[#f1f3f9] uppercase tracking-tight">SİSTEM DENETİM GÜNLÜKLERİ</h2>
        <p class="text-[11px] text-[#626885] font-bold uppercase tracking-widest leading-none">Tüm kritik işlemlerin kayıtları</p>
      </div>
    </div>
    
    <!-- Filtreler Paneli -->
    <div class="bg-white/[0.02] border border-white/[0.08] rounded-3xl p-6 shadow-2xl">
      <div class="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div class="form-control">
          <label class="label"><span class="label-text">Başlangıç Tarihi</span></label>
          <input v-model="filters.startDate" type="date" class="input input-bordered w-full font-bold" />
        </div>
        
        <div class="form-control">
          <label class="label"><span class="label-text">Bitiş Tarihi</span></label>
          <input v-model="filters.endDate" type="date" class="input input-bordered w-full font-bold" />
        </div>
        
        <div class="form-control">
          <label class="label"><span class="label-text">İşlem Türü</span></label>
          <select v-model="filters.action" class="select select-bordered w-full font-bold">
            <option value="">Tüm İşlemler</option>
            <option v-for="(label, value) in auditActions" :key="value" :value="value">{{ label }}</option>
          </select>
        </div>
        
        <div class="form-control">
          <label class="label"><span class="label-text">Varlık Türü</span></label>
          <select v-model="filters.entityType" class="select select-bordered w-full font-bold">
            <option value="">Tüm Varlıklar</option>
            <option v-for="(label, value) in entityTypes" :key="value" :value="value">{{ label }}</option>
          </select>
        </div>
        
        <div class="flex items-end">
          <button 
            @click="loadLogs" 
            class="btn btn-primary w-full shadow-lg shadow-brand-500/20 font-black uppercase tracking-widest"
            :disabled="loading"
          >
            <span v-if="loading" class="loading loading-spinner loading-sm mr-2"></span>
            {{ loading ? 'Sorgulanıyor' : 'Kayıtları Getir' }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- Log Tablosu -->
    <div v-if="logs.length > 0" class="bg-white/[0.02] border border-white/[0.08] rounded-3xl overflow-hidden shadow-2xl">
      <div class="overflow-x-auto custom-scrollbar">
        <table class="table w-full border-collapse">
          <thead>
            <tr class="bg-white/[0.03] border-b border-white/[0.08]">
              <th class="text-[10px] font-black text-[#626885] uppercase tracking-widest py-5">Tarih / Zaman</th>
              <th class="text-[10px] font-black text-[#626885] uppercase tracking-widest">Kullanıcı</th>
              <th class="text-[10px] font-black text-[#626885] uppercase tracking-widest">İşlem</th>
              <th class="text-[10px] font-black text-[#626885] uppercase tracking-widest">Varlık</th>
              <th class="text-[10px] font-black text-[#626885] uppercase tracking-widest">Ağ Bilgisi</th>
              <th class="text-right py-5 pr-8"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/[0.05]">
            <tr v-for="log in logs" :key="log.id" class="hover:bg-white/[0.03] transition-colors group">
              <td class="py-4">
                <div class="flex flex-col">
                  <span class="text-sm font-black text-[#f1f3f9] tracking-tight">{{ formatDateTime(log.createdAt).split(' ')[0] + ' ' + formatDateTime(log.createdAt).split(' ')[1] }}</span>
                  <span class="text-[10px] font-bold text-[#626885] uppercase tracking-tighter">{{ formatDateTime(log.createdAt).split(' ')[2] }}</span>
                </div>
              </td>
              <td>
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.1] flex items-center justify-center">
                    <span class="text-xs font-black text-brand-400 uppercase">{{ log.userName?.charAt(0) || 'S' }}</span>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-[13px] font-black text-[#f1f3f9] tracking-tight">{{ log.userName || 'Sistem' }}</span>
                    <span class="text-[10px] font-medium text-[#626885] italic">{{ log.userEmail || '-' }}</span>
                  </div>
                </div>
              </td>
              <td>
                <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border" :class="getActionBadgeClass(log.action)">
                  {{ getAuditActionLabel(log.action) }}
                </span>
              </td>
              <td>
                <div class="flex flex-col">
                  <span class="text-[11px] font-black text-[#f1f3f9] uppercase tracking-widest">{{ getEntityTypeLabel(log.entityType) }}</span>
                  <span class="text-[10px] font-bold text-[#626885]">ID: {{ log.entityId }}</span>
                </div>
              </td>
              <td>
                <span class="text-[11px] font-medium text-[#9aa0b4] font-mono tracking-tighter">{{ log.ipAddress || '-' }}</span>
              </td>
              <td class="text-right pr-8">
                <button 
                  @click="showDetails(log)" 
                  class="btn btn-ghost btn-xs text-brand-400 font-black hover:bg-brand-500/10 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Detaylar
                  <svg class="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke-width="3"/></svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Boş Durum -->
    <div v-else-if="!loading" class="py-20 flex flex-col items-center justify-center bg-white/[0.02] border border-dashed border-white/[0.1] rounded-3xl animate-pulse-slow">
        <div class="w-20 h-20 bg-white/[0.03] rounded-full flex items-center justify-center text-3xl mb-4">📜</div>
        <p class="text-[13px] font-black text-[#626885] uppercase tracking-widest">Herhangi bir kayıt bulunamadı</p>
    </div>
    
    <!-- Detay Modal -->
    <BaseModal
      v-if="selectedLog"
      :model-value="showDetailsModal"
      title="İŞLEM DETAYLARI"
      icon="🔍"
      size="lg"
      @close="showDetailsModal = false"
    >
      <div class="space-y-8">
        <!-- Üst Özet Bilgi -->
        <div class="grid grid-cols-2 md:grid-cols-3 gap-6 bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6">
          <div class="space-y-1">
            <span class="text-[9px] font-black text-[#626885] uppercase tracking-widest">İşlem Zamanı</span>
            <p class="text-xs font-black text-[#f1f3f9]">{{ formatDateTime(selectedLog.createdAt) }}</p>
          </div>
          <div class="space-y-1">
            <span class="text-[9px] font-black text-[#626885] uppercase tracking-widest">Kullanıcı</span>
            <p class="text-xs font-black text-[#f1f3f9]">{{ selectedLog.userName || 'Sistem Otomasyonu' }}</p>
          </div>
          <div class="space-y-1">
            <span class="text-[9px] font-black text-[#626885] uppercase tracking-widest">Ağ Kimliği</span>
            <p class="text-xs font-mono text-brand-400">{{ selectedLog.ipAddress || '-' }}</p>
          </div>
          <div class="space-y-1">
            <span class="text-[9px] font-black text-[#626885] uppercase tracking-widest">İşlem Türü</span>
            <p class="text-xs font-black text-[#f1f3f9]">{{ getAuditActionLabel(selectedLog.action) }}</p>
          </div>
          <div class="space-y-1">
            <span class="text-[9px] font-black text-[#626885] uppercase tracking-widest">Varlık</span>
            <p class="text-xs font-black text-[#f1f3f9] uppercase">{{ getEntityTypeLabel(selectedLog.entityType) }}</p>
          </div>
          <div class="space-y-1">
            <span class="text-[9px] font-black text-[#626885] uppercase tracking-widest">Varlık ID</span>
            <p class="text-xs font-mono text-[#f1f3f9]">{{ selectedLog.entityId }}</p>
          </div>
        </div>

        <!-- Değişiklikler -->
        <div v-if="selectedLog.oldValues || selectedLog.newValues" class="space-y-4">
          <div class="flex items-center gap-2 px-1">
            <span class="text-[11px] font-black text-[#f1f3f9] uppercase tracking-widest">Veri Karşılaştırması</span>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-if="selectedLog.oldValues" class="bg-red-500/[0.03] border border-red-500/20 rounded-2xl p-5 space-y-3">
              <span class="text-[10px] font-black text-red-400 uppercase tracking-widest">Eski Veriler</span>
              <pre class="text-[10px] font-mono text-red-200/70 overflow-x-auto custom-scrollbar leading-relaxed">
                {{ JSON.stringify(selectedLog.oldValues, null, 2) }}
              </pre>
            </div>
            <div v-if="selectedLog.newValues" class="bg-green-500/[0.03] border border-green-500/20 rounded-2xl p-5 space-y-3">
              <span class="text-[10px] font-black text-green-400 uppercase tracking-widest">Yeni Veriler</span>
              <pre class="text-[10px] font-mono text-green-200/70 overflow-x-auto custom-scrollbar leading-relaxed">
                {{ JSON.stringify(selectedLog.newValues, null, 2) }}
              </pre>
            </div>
          </div>
        </div>

        <div v-if="selectedLog.additionalData" class="space-y-2">
            <span class="text-[11px] font-black text-[#626885] uppercase tracking-widest px-1">Ek Sistem Verileri</span>
            <div class="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-5">
                <pre class="text-[10px] font-mono text-[#9aa0b4] overflow-x-auto custom-scrollbar leading-relaxed">{{ JSON.stringify(selectedLog.additionalData, null, 2) }}</pre>
            </div>
        </div>
      </div>

      <template #footer>
        <button class="btn btn-primary w-full shadow-lg shadow-brand-500/20 font-black uppercase tracking-widest" @click="showDetailsModal = false">Anladım, Kapat</button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { useNotify } from '@/application/composables/useNotify'
import BaseModal from '@/presentation/components/common/BaseModal.vue'
import paymentsService from '@/infrastructure/services/paymentsService'
import { auditActions, entityTypes, getAuditActionLabel, getEntityTypeLabel } from '@/core/constants/enums'

const { notifyError } = useNotify()
const loading = ref(false)
const logs = ref([])
const selectedLog = ref(null)
const showDetailsModal = ref(false)

const filters = ref({
  startDate: format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd'),
  endDate: format(new Date(), 'yyyy-MM-dd'),
  action: '',
  entityType: '',
  userId: ''
})

const formatDateTime = (date) => {
  return format(new Date(date), 'dd MMM yyyy HH:mm', { locale: tr })
}

const getActionBadgeClass = (action) => {
  const classes = {
    'Create': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'Update': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    'Delete': 'bg-red-500/10 text-red-400 border-red-500/20',
    'Payment': 'bg-brand-500/10 text-brand-400 border-brand-500/20',
    'DebtAllocation': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'AdvanceUsage': 'bg-purple-500/10 text-purple-400 border-purple-500/20'
  }
  return classes[action] || 'bg-slate-500/10 text-slate-400 border-slate-500/20'
}

const loadLogs = async () => {
  loading.value = true
  try {
    const response = await paymentsService.getAuditLogs(filters.value)
    logs.value = response || []
  } catch (error) {
    notifyError('Loglar yüklenemedi: ' + error.message)
  } finally {
    loading.value = false
  }
}

const showDetails = (log) => {
  selectedLog.value = log
  showDetailsModal.value = true
}

onMounted(() => {
  loadLogs()
})
</script> 