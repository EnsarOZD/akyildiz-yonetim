
<template>
  <div class="min-h-screen bg-base-200">
    <!-- Kart tipi dış çerçeve -->
    <div class="max-w-6xl mx-auto bg-base-100 shadow-lg rounded-xl overflow-hidden">
      
      <!-- Header -->
      <Header />

      <!-- Sekme Menü -->
      <TabMenu :activeTab="activeTab" @change-tab="activeTab = $event" />

      <!-- İçerik -->
      <div class="p-6">
        <Dashboard v-if="activeTab === 'dashboard'" />
        <Tenants v-if="activeTab === 'tenants'" />
        <Payments v-if="activeTab === 'payments'" />
        <Expenses v-if="activeTab === 'expenses'" />
        <Utilities v-if="activeTab === 'utilities'" />
      </div>
      
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Header from './components/Header.vue'
import TabMenu from './components/TabMenu.vue'
import Dashboard from './components/Dashboard.vue'
import Tenants from './components/Tenants.vue'
import Payments from './components/Payments.vue'
import Expenses from './components/Expenses.vue'
import Utilities from './components/Utilities.vue'

const activeTab = ref('dashboard')
</script>

<style scoped>

</style>
