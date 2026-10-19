// Demo modu / backend modu kararı — tek merkez.
// Demo modunda auth sabit bir 'admin' kullanıcıyla taklit edilir ve router guard'ları atlanır.
// Bu yüzden demo modu YALNIZCA geliştirme sunucusunda (import.meta.env.DEV) açılabilir;
// production build'de VITE_API_BASE_URL eksik olsa bile asla demo moduna girilmez.

const LOCAL_DEMO_API_URL = 'http://localhost:5000/api'

/**
 * Demo modu aktif mi?
 * Dev: VITE_API_BASE_URL yoksa, localhost:5000 ise veya VITE_DEMO_MODE=true ise demo.
 * Prod build: her zaman false.
 * @returns {boolean}
 */
export function isDemoMode() {
  if (!import.meta.env.DEV) return false
  const url = import.meta.env.VITE_API_BASE_URL
  return !url || url === LOCAL_DEMO_API_URL || import.meta.env.VITE_DEMO_MODE === 'true'
}

/**
 * Gerçek backend (auth + guard'lar) kullanılıyor mu?
 * @returns {boolean}
 */
export function isBackendActive() {
  return !isDemoMode()
}
