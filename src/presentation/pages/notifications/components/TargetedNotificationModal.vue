<template>
  <div v-if="show" class="fixed inset-0 z-[100] flex items-center justify-center p-4 pb-24 md:pb-4 bg-black/60 backdrop-blur-sm">
    <div class="bg-white dark:bg-[#0f1322] rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all border border-gray-100 dark:border-white/[0.07]">
      <!-- Header -->
      <div class="px-8 py-6 border-b border-gray-50 dark:border-white/[0.07] flex items-center justify-between bg-gradient-to-r from-blue-50 to-white dark:from-gray-800 dark:to-gray-800">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-brand-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200 dark:shadow-none">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">Hedefli Bildirim Sistemi</h2>
            <p class="text-sm text-gray-500 dark:text-[#9aa0b4]">Belirli bir kitleye özelleştirilmiş mesaj gönderin.</p>
          </div>
        </div>
        <button @click="$emit('close')" class="p-2 hover:bg-gray-100 dark:hover:bg-white/[0.06] rounded-full transition text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Body -->
      <div class="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
        <!-- 1. Bildirim Türü -->
        <div class="space-y-4">
          <label class="text-sm font-bold text-gray-900 dark:text-[#f1f3f9] uppercase tracking-widest">1. Bildirim Türü</label>
          <div class="grid grid-cols-3 gap-4">
            <div 
              v-for="type in notificationTypes" :key="type.id"
              @click="form.type = type.id"
              class="cursor-pointer p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 group"
              :class="form.type === type.id ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/[0.08]' : 'border-gray-100 dark:border-white/[0.07] hover:border-brand-200'"
            >
              <span class="text-2xl group-hover:scale-110 transition-transform">{{ type.icon }}</span>
              <span class="text-sm font-bold" :class="form.type === type.id ? 'text-brand-700 dark:text-brand-400' : 'text-gray-600 dark:text-[#9aa0b4]'">{{ type.label }}</span>
            </div>
          </div>
        </div>

        <!-- 2. Hedef Kitle -->
        <div class="space-y-4">
          <label class="text-sm font-bold text-gray-900 dark:text-[#f1f3f9] uppercase tracking-widest">2. Hedef Kitle</label>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="form-control">
              <span class="label-text font-semibold mb-2 block">Kime Gönderilecek?</span>
              <select v-model="form.targetType" class="select select-bordered w-full rounded-xl dark:bg-base-200">
                <option value="all">Tüm Kiracılar</option>
                <option value="floor">Belirli Bir Kat</option>
                <option value="tenant">Seçilen Kiracı</option>
              </select>
            </div>

            <!-- Kat Seçimi -->
            <div v-if="form.targetType === 'floor'" class="form-control">
              <span class="label-text font-semibold mb-2 block">Kat Seçiniz</span>
              <select v-model="form.targetId" class="select select-bordered w-full rounded-xl dark:bg-base-200">
                <option v-for="floor in floors" :key="floor" :value="floor">{{ floor }}. Kat</option>
              </select>
            </div>

            <!-- Kiracı Seçimi -->
            <div v-if="form.targetType === 'tenant'" class="form-control">
              <span class="label-text font-semibold mb-2 block">Kiracı Seçiniz</span>
              <select v-model="form.targetId" class="select select-bordered w-full rounded-xl dark:bg-base-200">
                <option v-for="tenant in tenants" :key="tenant.id" :value="tenant.id">{{ tenant.companyName || tenant.fullName }}</option>
              </select>
            </div>
          </div>
        </div>

        <!-- 3. Filtreler (Sadece Borç Hatırlatma için) -->
        <transition name="fade">
          <div v-if="form.type === 'debt'" class="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-3xl border border-amber-100 dark:border-amber-900/30 space-y-4">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-amber-100 dark:bg-amber-900/50 rounded-xl flex items-center justify-center text-amber-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 11-2 0V4H5v12h10v-2a1 1 0 112 0v3a1 1 0 01-1 1H4a1 1 0 01-1-1V3z" clip-rule="evenodd" />
                </svg>
              </div>
              <span class="font-bold text-amber-900 dark:text-amber-200">Gecikme Filtresi</span>
            </div>
            <div class="flex items-center gap-4">
              <span class="text-sm">Ödemesi en az</span>
              <input v-model="form.delayDays" type="number" class="input input-sm input-bordered w-20 rounded-lg text-center font-bold" min="1" />
              <span class="text-sm">gün gecikenlere gönder.</span>
            </div>
          </div>
        </transition>

        <!-- E-posta seçeneği (tüm tipler için) -->
        <label class="flex items-center gap-3 cursor-pointer p-4 rounded-2xl border border-brand-100 dark:border-brand-800/30 bg-brand-50 dark:bg-brand-500/[0.08]">
          <input type="checkbox" v-model="form.sendEmail" class="checkbox checkbox-primary checkbox-sm" />
          <span class="text-sm font-semibold text-brand-800 dark:text-brand-300">
            📧 Ayrıca e-posta ile de gönder
            <span class="text-xs font-normal opacity-70 ml-1">(kiracının kayıtlı e-postasına)</span>
          </span>
        </label>

        <!-- 4. İçerik -->
        <div class="space-y-4">
          <div class="space-y-2">
            <label class="text-sm font-bold text-gray-900 dark:text-[#f1f3f9] uppercase tracking-widest">3. Bildirim İçeriği</label>
            <input 
              v-model="form.title"
              type="text" 
              placeholder="Bildirim Başlığı"
              class="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-white/[0.07] dark:bg-base-200 focus:ring-4 focus:ring-brand-500/10 transition outline-none font-bold"
            />
          </div>

          <div class="space-y-2">
            <textarea 
              v-model="form.message"
              rows="4"
              placeholder="Mesaj içeriğini buraya yazın..."
              class="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-white/[0.07] dark:bg-base-200 focus:ring-4 focus:ring-brand-500/10 transition outline-none resize-none"
            ></textarea>
          </div>
        </div>

        <!-- 5. Rapor/Özet (Preview) -->
        <div class="border-t border-gray-100 dark:border-white/[0.07] pt-8">
          <div class="flex items-center justify-between mb-4">
            <h4 class="font-bold text-gray-900 dark:text-white">Gönderim Özeti</h4>
            <span class="text-xs px-3 py-1 bg-gray-100 dark:bg-[#1c2238] rounded-full font-bold uppercase">{{ form.targetType === 'all' ? 'Kitlesel' : 'Hedefli' }}</span>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700/30 p-5 rounded-2xl text-sm space-y-2">
            <div class="flex justify-between">
              <span class="text-gray-500">Tahmini Alıcı:</span>
              <span class="font-bold">{{ estimatedRecipients }} Kullanıcı</span>
            </div>
            <div class="flex justify-between text-brand-600 dark:text-brand-400">
              <span>Bildirim Türü:</span>
              <span class="font-bold">{{ getTypeName(form.type) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-8 py-6 dark:bg-gray-900/50 border-t border-gray-100 dark:border-white/[0.07] flex justify-end gap-3">
        <button @click="$emit('close')" class="px-6 py-3 rounded-2xl text-gray-600 dark:text-[#9aa0b4] font-bold hover:bg-gray-100 dark:hover:bg-white/[0.04] transition">Vazgeç</button>
        <button 
          @click="handleSubmit"
          :disabled="loading || !isFormValid"
          class="px-10 py-3 rounded-2xl bg-brand-500 text-white font-black hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-blue-500/20 transition-all flex items-center gap-2 active:scale-95"
        >
          <span v-if="loading" class="loading loading-spinner loading-sm"></span>
          {{ loading ? 'Gönderiliyor...' : 'Bildirimi Gönder' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { notificationsService } from '@/infrastructure/services/notificationsService'
import tenantsService from '@/infrastructure/services/tenantsService'
import { useNotify } from '@/application/composables/useNotify'

const props = defineProps({ show: Boolean })
const emit = defineEmits(['close', 'success'])
const { notifySuccess, notifyError } = useNotify()

const loading = ref(false)
const tenants = ref([])
const floors = ref([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

const notificationTypes = [
  { id: 'announcement', label: 'Duyuru', icon: '📢' },
  { id: 'debt', label: 'Borç Hatırlatma', icon: '💰' },
  { id: 'private', label: 'Özel Mesaj', icon: '✉️' }
]

const form = reactive({
  type: 'announcement',
  targetType: 'all',
  targetId: null,
  delayDays: 5,
  title: '',
  message: '',
  sendEmail: false
})

const isFormValid = computed(() => {
  const basicValid = form.title.trim().length >= 3 && form.message.trim().length >= 5
  const targetValid = form.targetType === 'all' || form.targetId
  return basicValid && targetValid
})

const estimatedRecipients = computed(() => {
  if (form.targetType === 'all') return tenants.value.length || 'Tüm'
  if (form.targetType === 'floor') return 'Kattakiler'
  return 1
})

const getTypeName = (id) => notificationTypes.find(t => t.id === id)?.label

const loadTenants = async () => {
  try {
    const data = await tenantsService.getTenants()
    tenants.value = data || []
  } catch (error) {
    console.error('Kiracı yükleme hatası:', error)
  }
}

const handleSubmit = async () => {
  if (!isFormValid.value) return

  loading.value = true
  try {
    await notificationsService.sendTargeted({
      title: form.title,
      message: form.message,
      type: form.type,
      targetType: form.targetType,
      targetId: form.targetId ? String(form.targetId) : null,
      delayDays: form.type === 'debt' ? form.delayDays : null,
      sendEmail: form.sendEmail
    })
    
    notifySuccess('Bildirim başarıyla kuyruğa alındı ve iletiliyor', 'success')
    emit('success')
    emit('close')
    // Reset form
    Object.assign(form, {
      type: 'announcement',
      targetType: 'all',
      targetId: null,
      delayDays: 5,
      title: '',
      message: '',
      sendEmail: false
    })
  } catch (error) {
    notifyError('Bildirim gönderilirken bir hata oluştu', 'error')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadTenants()
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
