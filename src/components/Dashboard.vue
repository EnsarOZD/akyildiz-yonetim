<template>
  <section class="min-h-screen bg-base-200 p-6">
    <div class="max-w-6xl mx-auto space-y-8">

      <!-- Özet Kartları -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="card bg-base-100 shadow-md">
          <div class="card-body text-center">
            <h3 class="text-center text-sm text-base-content/70 font-medium uppercase tracking-wide">Kasa Bakiyesi</h3>
            <p class="text-3xl font-bold text-green-600">₺12.450</p>
          </div>
        </div>
        <div class="card bg-base-100 shadow-md">
          <div class="card-body text-center">
            <h3 class="text-center text-sm text-base-content/70 font-medium uppercase tracking-wide">Toplam Gelir</h3>
            <p class="text-3xl font-bold text-blue-600">₺20.000</p>
          </div>
        </div>
        <div class="card bg-base-100 shadow-md">
          <div class="card-body text-center">
            <h3 class="text-center text-sm text-base-content/70 font-medium uppercase tracking-wide">Toplam Gider</h3>
            <p class="text-3xl font-bold text-red-600">₺7.550</p>
          </div>
        </div>
      </div>

      <!-- Son İşlemler Tablosu -->
      <div class="card bg-base-100 shadow-md">
        <div class="card-body">
          <h4 class="text-center text-lg font-semibold text-base-content mb-4">Son İşlemler</h4>
          <div class="overflow-x-auto">
            <div class="overflow-x-auto rounded-lg border border-base-300">
            <table class="table table-zebra w-full text-sm">
              <thead>
                <tr>
                  <th class="text-center">Tarih</th>
                  <th class="text-center">Açıklama</th>
                  <th class="text-center">Tutar</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="text-center">2024-05-25</td>
                  <td class="text-center">Elektrik Faturası</td>
                  <td class="text-center text-red-600 font-medium">-₺1.250</td>
                </tr>
                <tr>
                  <td class="text-center">2024-05-24</td>
                  <td class="text-center">Aidat Tahsilatı</td>
                  <td class="text-center text-green-600 font-medium">₺4.000</td>
                </tr>
                <tr>
                  <td class="text-center">2024-05-23</td>
                  <td class="text-center">Temizlik Gideri</td>
                  <td class="text-center text-red-600 font-medium">-₺800</td>
                </tr>
              </tbody>
            </table>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
// İleride props veya API'den veri almak için buraya kod eklenebilir
</script>
