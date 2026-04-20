import { ref, computed } from 'vue'

// Module-level in-memory cache — tüm store'lar paylaşır, sayfa yenilenince temizlenir
const _cache = new Map()

/**
 * TTL destekli API sorgu cache'i.
 *
 * @param {string|(() => string)} key - Cache anahtarı veya reaktif döndüren fonksiyon
 * @param {() => Promise<any>} fetcher - Veriyi çeken async fonksiyon
 * @param {object} options
 * @param {number}  options.ttlMs              - Cache geçerlilik süresi (ms). Varsayılan: 5 dakika
 * @param {boolean} options.staleWhileRevalidate - Eski veri varsa önce göster, arka planda yenile. Varsayılan: true
 */
export function useCachedQuery(key, fetcher, options = {}) {
  const { ttlMs = 5 * 60 * 1000, staleWhileRevalidate = true } = options

  const data = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  function resolveKey() {
    return typeof key === 'function' ? key() : key
  }

  function getCached() {
    const entry = _cache.get(resolveKey())
    if (!entry) return null
    return entry
  }

  function isFresh() {
    const entry = getCached()
    if (!entry) return false
    return Date.now() - entry.fetchedAt < ttlMs
  }

  async function fetch(force = false) {
    const cacheEntry = getCached()

    // Cache geçerliyse API çağırma
    if (!force && isFresh()) {
      data.value = cacheEntry.data
      return data.value
    }

    // Stale-while-revalidate: eski veri varsa önce göster
    if (staleWhileRevalidate && cacheEntry) {
      data.value = cacheEntry.data
    }

    isLoading.value = true
    error.value = null

    try {
      const result = await fetcher()
      data.value = result
      _cache.set(resolveKey(), { data: result, fetchedAt: Date.now() })
      return result
    } catch (e) {
      error.value = e?.response?.data?.message || e?.message || 'Beklenmeyen hata'
      // Hata durumunda stale veri varsa göstermeye devam et
      if (!data.value && cacheEntry) {
        data.value = cacheEntry.data
      }
      throw e
    } finally {
      isLoading.value = false
    }
  }

  function invalidate() {
    _cache.delete(resolveKey())
  }

  /** Belirli prefix ile başlayan tüm cache girdilerini temizle */
  function invalidatePattern(prefix) {
    for (const k of _cache.keys()) {
      if (k.startsWith(prefix)) _cache.delete(k)
    }
  }

  /** Tüm cache'i temizle (logout vb.) */
  function invalidateAll() {
    _cache.clear()
  }

  return {
    data,
    isLoading,
    error,
    fetch,
    invalidate,
    invalidatePattern,
    invalidateAll,
    isFresh,
  }
}

/** Sadece invalidation işlemleri için yardımcı */
export function useCacheInvalidator() {
  function invalidate(key) {
    _cache.delete(key)
  }

  function invalidatePattern(prefix) {
    for (const k of _cache.keys()) {
      if (k.startsWith(prefix)) _cache.delete(k)
    }
  }

  function invalidateAll() {
    _cache.clear()
  }

  return { invalidate, invalidatePattern, invalidateAll }
}
