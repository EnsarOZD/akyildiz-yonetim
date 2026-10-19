import { usePaymentsStore } from './payments'
import { useUtilityDebtsStore } from './utilityDebts'
import { useExpensesStore } from './expenses'
import { useDashboardStore } from './dashboard'

/**
 * Finansal veriyi değiştiren her işlemden sonra (ödeme, borç, gider oluştur/güncelle/sil)
 * ilgili store önbelleklerini TÜM filtre anahtarlarıyla birlikte temizler.
 * Ödeme bir borcu kapatabildiği, borç dağıtımı dashboard özetini değiştirebildiği için
 * hepsi birlikte geçersiz kılınır. Servisler doğrudan çağrıldığında da (sayfa/modal) çalışır.
 */
export function invalidateFinanceCaches() {
  try {
    usePaymentsStore().invalidateCache()
    useUtilityDebtsStore().invalidateCache()
    useExpensesStore().invalidateCache()
    useDashboardStore().invalidateCache()
  } catch (e) {
    // Pinia henüz aktif değilse (ör. uygulama başlamadan) temizlenecek önbellek de yoktur
  }
}
