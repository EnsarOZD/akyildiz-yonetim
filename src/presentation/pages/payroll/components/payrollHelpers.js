// Maaş/personel ekranları için ortak yardımcılar
import { formatCurrency } from '@/core/utils/currencyUtils'

export const MONTH_NAMES = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
]

/** (2026, 9) -> '2026-09' */
export const periodKey = (y, m) => `${y}-${String(m).padStart(2, '0')}`

/** '2026-09' -> { year, month } veya null */
export const parsePeriodKey = (key) => {
  const m = /^(\d{4})-(\d{2})$/.exec(String(key || ''))
  if (!m) return null
  const month = Number(m[2])
  return month >= 1 && month <= 12 ? { year: Number(m[1]), month } : null
}

/** (2026, 9) -> 'Eylül 2026' */
export const monthLabel = (y, m) => `${MONTH_NAMES[m - 1] || ''} ${y}`.trim()

export const currentPeriodKey = () => {
  const d = new Date()
  return periodKey(d.getFullYear(), d.getMonth() + 1)
}

/** Para: tr-TR, 2 ondalık. Boş değer '-' olur. */
export const formatMoney = (v) => (v === null || v === undefined ? '-' : formatCurrency(v))

export const formatDate = (v) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(v || ''))
  return m ? `${m[3]}.${m[2]}.${m[1]}` : '-'
}

/** API hata metni (Türkçe mesaj gövdede düz metin olarak gelir). */
export const errorText = (e, fallback) => {
  const data = e?.response?.data
  return typeof data === 'string' && data.trim() ? data : (e?.message || fallback)
}

// Enum'lar API'de metin (JsonStringEnumConverter) gelir; sayı gelirse de çevrilir.
const STATUS_BY_NUMBER = ['Draft', 'PayrollImported', 'Approved']
export const normalizeStatus = (s) => (typeof s === 'number' ? STATUS_BY_NUMBER[s] : s)

export const STATUS_META = {
  Draft: { label: 'Taslak', cls: 'badge-ghost' },
  PayrollImported: { label: 'Bordro yüklendi', cls: 'badge-info' },
  Approved: { label: 'Onaylı', cls: 'badge-success' }
}

export const PAYMENT_KINDS = [
  { value: 'Advance', label: 'Avans' },
  { value: 'Salary', label: 'Maaş' },
  { value: 'Other', label: 'Diğer' }
]
export const PAYMENT_METHODS = [
  { value: 'Bank', label: 'Banka' },
  { value: 'Cash', label: 'Nakit' }
]
const KIND_BY_NUMBER = ['Advance', 'Salary', 'Other']
const METHOD_BY_NUMBER = ['Bank', 'Cash']
export const kindLabel = (k) => PAYMENT_KINDS.find(x => x.value === (typeof k === 'number' ? KIND_BY_NUMBER[k] : k))?.label || String(k)
export const methodLabel = (k) => PAYMENT_METHODS.find(x => x.value === (typeof k === 'number' ? METHOD_BY_NUMBER[k] : k))?.label || String(k)
