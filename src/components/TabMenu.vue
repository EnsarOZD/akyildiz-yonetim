<template>
  <nav class="bg-base-100 px-6 py-4 border-b border-base-300 flex flex-col md:flex-row justify-center items-center gap-3">
    
    <!-- Sekmeler -->
    <div class="flex flex-wrap justify-center gap-4">
      <button 
  v-for="tab in tabs"
  :key="tab.value"
  @click="$emit('change-tab', tab.value)"
  :class="[
    'btn btn-md transition',
    theme === 'dark'
      ? (activeTab === tab.value ? 'btn-primary btn-outline' : 'btn-outline btn-info')     
      : (activeTab === tab.value ? 'btn-primary btn-soft' : 'btn-neutral btn-soft') 
  ]"
>
  {{ tab.label }}
</button>
    </div>

    <!-- Tema Değiştir Butonu -->
    <button class="btn btn-outline btn-md ml-auto md:absolute right-6 top-4" @click="toggleTheme">
      {{ theme === 'light' ? '🌙 Koyu' : '☀️ Açık' }}
    </button>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  activeTab: String
})

const tabs = [
  { label: 'Özet', value: 'dashboard' },
  { label: 'Kiracılar', value: 'tenants' },
  { label: 'Ödemeler', value: 'payments' },
  { label: 'Giderler', value: 'expenses' },
  { label: 'Sayaçlar', value: 'utilities' },
]

// 🌓 Tema yönetimi
const theme = ref('dark')

const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  document.documentElement.setAttribute('data-theme', theme.value)
  localStorage.setItem('theme', theme.value) // ⬅️ Tema kalıcı
}

onMounted(() => {
  theme.value = localStorage.getItem('theme') || 'dark'
  document.documentElement.setAttribute('data-theme', theme.value)
})

</script>
