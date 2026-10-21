// Elektrik ekranları için ortak yardımcılar

/**
 * Okuma satırı uyarısı.
 * - currentIndex < previousIndex → 'error' (kırmızı, dönem onaylanamaz)
 * - previousConsumption > 0 ve consumption > 3 × previousConsumption → 'high' (sarı)
 * - previousConsumption > 0 ve consumption < 0.3 × previousConsumption → 'low' (sarı)
 * @returns {null|'error'|'high'|'low'}
 */
export function readingWarning(reading) {
  if (!reading) return null
  const prev = Number(reading.previousIndex) || 0
  const cur = Number(reading.currentIndex) || 0
  if (cur < prev) return 'error'
  const pc = Number(reading.previousConsumption) || 0
  const c = Number(reading.consumption) || 0
  if (pc > 0 && c > 3 * pc) return 'high'
  if (pc > 0 && c < 0.3 * pc) return 'low'
  return null
}

export const STATUS_LABELS = { Draft: 'Taslak', Finalized: 'Onaylı' }

/** Sunucu tarihini ('2026-07-31T00:00:00') 'YYYY-MM-DD' olarak döndürür. */
export function dateOnly(value) {
  if (!value) return ''
  return String(value).slice(0, 10)
}

/** 'YYYY-MM-DD...' → 'dd.MM.yyyy' */
export function formatDate(value) {
  const d = dateOnly(value)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return '-'
  const [y, m, day] = d.split('-')
  return `${day}.${m}.${y}`
}

/** Borç ayı/yılı → 'MM/yyyy' */
export function periodLabel(p) {
  if (!p) return ''
  return `${String(p.debtMonth).padStart(2, '0')}/${p.debtYear}`
}

/** İki 'YYYY-MM-DD' tarihi arasındaki gün farkı (UTC, saat dilimi kaymasız). */
export function daysBetween(a, b) {
  const da = Date.parse(`${dateOnly(a)}T00:00:00Z`)
  const db = Date.parse(`${dateOnly(b)}T00:00:00Z`)
  if (isNaN(da) || isNaN(db)) return 0
  return Math.round((db - da) / 86400000)
}

/** İki tarihin orta günü ('YYYY-MM-DD'). */
export function midpointDate(a, b) {
  const da = Date.parse(`${dateOnly(a)}T00:00:00Z`)
  const db = Date.parse(`${dateOnly(b)}T00:00:00Z`)
  if (isNaN(da) || isNaN(db)) return dateOnly(a)
  const mid = new Date(da + Math.floor((db - da) / 86400000 / 2) * 86400000)
  return mid.toISOString().slice(0, 10)
}

const numFmt = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 3 })
const moneyFmt = new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const rateFmt = new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 6 })

/** kWh / endeks gösterimi */
export function formatNumber(v) {
  if (v === null || v === undefined || v === '' || isNaN(Number(v))) return '-'
  return numFmt.format(Number(v))
}

/** Tutar gösterimi (₺ simgesiz, 2 hane) */
export function formatMoney(v) {
  if (v === null || v === undefined || v === '' || isNaN(Number(v))) return '-'
  return moneyFmt.format(Number(v))
}

/** Birim fiyat / oran gösterimi (6 haneye kadar) */
export function formatRate(v) {
  if (v === null || v === undefined || v === '' || isNaN(Number(v))) return '-'
  return rateFmt.format(Number(v))
}

/** Sunucu 400 hataları düz metin döner. */
export function errorText(e, fallback) {
  const data = e?.response?.data
  return typeof data === 'string' && data.trim() ? data : (e?.message || fallback)
}

/** Kiracı/malik görünen adı */
export function partyName(x) {
  return x?.companyName || x?.company || x?.contactPersonName || x?.fullName ||
    [x?.firstName, x?.lastName].filter(Boolean).join(' ') || x?.name || x?.email || `#${x?.id}`
}

/**
 * Sayaç düzeyi tüketim uyarısı (yalnız 'high' | 'low').
 * Sayacın tüm satırlarının toplam tüketimi (Σ current − previous) önceki dönem tüketimiyle karşılaştırılır.
 * Sayacın hiçbir satırına henüz okuma girilmemişse (her satırda current == previous) uyarı verilmez.
 * Satır bazlı 'error' için readingWarning kullanılır.
 * @param {{previousIndex:number, currentIndex:number}[]} rows
 * @param {number|null} previousConsumption
 * @returns {null|'high'|'low'}
 */
export function meterConsumptionWarning(rows, previousConsumption) {
  if (!rows?.length) return null
  if (rows.every(r => (Number(r.currentIndex) || 0) === (Number(r.previousIndex) || 0))) return null
  const total = rows.reduce((s, r) => s + ((Number(r.currentIndex) || 0) - (Number(r.previousIndex) || 0)), 0)
  const w = readingWarning({ previousIndex: 0, currentIndex: 0, consumption: total, previousConsumption })
  return w === 'high' || w === 'low' ? w : null
}

/**
 * Fatura raporunu Excel'e aktarır (sayılar sayı hücresi).
 * Dosya: Elektrik_{DebtYear}_{MM}.xlsx, sayfa: "Fatura Raporu"
 */
export async function exportReportExcel(detail) {
  const XLSX = await import('xlsx')
  const header = [
    'Kat', 'Cari', 'Sayaç', 'Başlangıç', 'Bitiş', 'Gün', 'İlk Okuma', 'Son Okuma', 'Tüketim',
    'Kendi Tutar', 'Havuz Payı', 'KDV Hariç', 'KDV Dahil', 'Fatura No', 'Okuma Metni', 'Gider Metni'
  ]
  const n = (v) => (v === null || v === undefined || v === '' || isNaN(Number(v)) ? null : Number(v))
  const aoa = [header]
  for (const r of detail?.reportRows || []) {
    aoa.push([
      r.flatCode, r.debtorName || '', r.meterName, formatDate(r.startDate), formatDate(r.endDate), n(r.days),
      n(r.previousIndex), n(r.currentIndex), n(r.consumption), n(r.ownAmount), n(r.poolShare), n(r.exclVat), n(r.total),
      r.invoiceNumber || '', r.readingText || '', r.expenseText || ''
    ])
  }
  const ws = XLSX.utils.aoa_to_sheet(aoa)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Fatura Raporu')
  XLSX.writeFile(wb, `Elektrik_${detail.debtYear}_${String(detail.debtMonth).padStart(2, '0')}.xlsx`)
}
