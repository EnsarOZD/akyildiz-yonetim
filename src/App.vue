<template>
  <div class="min-h-screen bg-base-200">
    <div class="max-w-6xl mx-auto bg-base-100 shadow-lg rounded-xl overflow-hidden">

      <!-- Header -->
      <Header />

      <!-- Menü (Yeni TabMenu) -->
      <TabMenu />

      <!-- İçerik -->
      <router-view class="p-6" />

    </div>
  </div>
</template>

<script setup>
import Header from './components/Header.vue'
import TabMenu from './components/TabMenu.vue'
</script>
