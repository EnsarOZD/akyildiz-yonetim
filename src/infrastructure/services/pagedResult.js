import { useNotification } from '@/application/composables/useNotification'

// Backend sayfalama üst sınırı (QueryableExtensions: pageSize > 5000 ise 5000'e çekilir)
export const MAX_PAGE_SIZE = 5000

const { showWarning } = useNotification()

/**
 * PagedResult<T> veya düz dizi yanıtını diziye çevirir.
 * Yanıt toplam kayıt sayısından az kayıt içeriyorsa (sayfalama kırpması) görünür uyarı gösterir;
 * istemci tarafında hesaplanan toplamlar bu durumda eksik olur.
 * @param {Array|{items: Array, totalCount?: number}} response
 * @param {string} label - Uyarı mesajında kullanılacak kayıt adı (ör. 'ödeme')
 * @param {boolean} warn - Kırpma uyarısı gösterilsin mi (yalnızca "tümünü getir" isteklerinde)
 * @returns {Array}
 */
export function unwrapPaged(response, label = 'kayıt', warn = true) {
  if (Array.isArray(response)) return response
  const items = response?.items ?? []
  const total = Number(response?.totalCount)
  if (warn && Number.isFinite(total) && total > items.length) {
    showWarning(
      `Toplam ${total} ${label} kaydından yalnızca ${items.length} tanesi yüklendi. Listelenen toplamlar eksik olabilir; lütfen tarih aralığını daraltın.`,
      { action: 'paged-truncation', total, loaded: items.length }
    )
  }
  return items
}
