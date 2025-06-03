<template>
  <div class="min-h-screen bg-base-200">
    <div class="max-w-6xl mx-auto bg-base-100 shadow-lg rounded-xl overflow-hidden">

      <!-- Header sadece login dışındaki sayfalarda gösterilir -->
      <Header v-if="!route.meta.hideLayout" />

      <!-- Menü sadece login dışındaki sayfalarda gösterilir -->
      <TabMenu v-if="!route.meta.hideLayout" />

      <!-- İçerik -->
      <router-view class="p-6" />

    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import Header from './components/Header.vue'
import TabMenu from './components/TabMenu.vue'

const route = useRoute()
</script>
