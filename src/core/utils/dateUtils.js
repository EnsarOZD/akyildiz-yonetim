import { format, isValid, parseISO } from 'date-fns'
import { tr } from 'date-fns/locale'

/**
 * Güvenli tarih formatlama fonksiyonu
 * @param {string|Date} date - Formatlanacak tarih
 * @param {string} formatString - Format string (varsayılan: 'dd.MM.yyyy')
 * @returns {string} - Formatlanmış tarih veya "Geçersiz tarih"
 */
export function safeFormatDate(date, formatString = 'dd.MM.yyyy') {
  if (!date) return 'Tarih belirtilmedi'
  
  try {
    let dateObj
    if (typeof date === 'string') {
      // ISO string'i parse et
      dateObj = parseISO(date)
    } else if (date instanceof Date) {
      dateObj = date
    } else {
      return 'Geçersiz tarih'
    }
    
    // Tarih geçerli mi kontrol et
    if (!isValid(dateObj)) {
      return 'Geçersiz tarih'
    }
    
    // Varsayılan tarih kontrolü (0001-01-01)
    if (dateObj.getFullYear() <= 1900) {
      return 'Tarih belirtilmedi'
    }
    
    return format(dateObj, formatString, { locale: tr })
  } catch (error) {
    console.error('Tarih formatlama hatası:', error)
    return 'Geçersiz tarih'
  }
}

/**
 * Tarih aralığı kontrolü
 * @param {string|Date} date - Kontrol edilecek tarih
 * @param {number} minYear - Minimum yıl
 * @param {number} maxYear - Maksimum yıl
 * @returns {boolean} - Tarih aralıkta mı
 */
export function isDateInRange(date, minYear = 1900, maxYear = 2100) {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    if (!isValid(dateObj)) return false
    
    const year = dateObj.getFullYear()
    return year >= minYear && year <= maxYear
  } catch (error) {
    return false
  }
}

/**
 * Güncel tarih formatı
 * @returns {string} - Bugünün tarihi
 */
export function getCurrentDate() {
  return format(new Date(), 'yyyy-MM-dd')
}

/**
 * Tarih karşılaştırma
 * @param {string|Date} date1 - İlk tarih
 * @param {string|Date} date2 - İkinci tarih
 * @returns {number} - Karşılaştırma sonucu
 */
export function compareDates(date1, date2) {
  try {
    const d1 = typeof date1 === 'string' ? parseISO(date1) : date1
    const d2 = typeof date2 === 'string' ? parseISO(date2) : date2
    
    if (!isValid(d1) || !isValid(d2)) return 0
    
    return d1.getTime() - d2.getTime()
  } catch (error) {
    return 0
  }
}

/**
 * Gecikme günü hesaplama
 * @param {string|Date} dueDate - Vade tarihi
 * @returns {number} - Gecikme günü (negatif = henüz vadesi gelmemiş)
 */
export function getDaysOverdue(dueDate) {
  try {
    const due = typeof dueDate === 'string' ? parseISO(dueDate) : dueDate
    if (!isValid(due)) return 0
    
    const today = new Date()
    const diffTime = today.getTime() - due.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    return diffDays
  } catch (error) {
    return 0
  }
} 

/**
 * Date nesnesini yerel takvim gününe göre 'YYYY-MM-DD' formatına çevirir.
 * toISOString() UTC'ye çevirdiği için Türkiye'de (UTC+3) gece yarısı civarında
 * bir önceki güne kayar; takvim tarihi üretirken bunu kullanın.
 * @param {Date} [date=new Date()]
 * @returns {string}
 */
export function toLocalIsoDate(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date)
  if (isNaN(d.getTime())) return ''
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/**
 * Bugünün yerel tarihi ('YYYY-MM-DD')
 * @returns {string}
 */
export function todayLocalIso() {
  return toLocalIsoDate(new Date())
}

/**
 * Bir tarih değerinin takvim gün kısmını ('YYYY-MM-DD') döndürür.
 * - 'YYYY-MM-DD...' string ise ilk 10 karakter alınır (saat/UTC dönüşümü yapılmaz)
 * - Date ise yerel takvim günü alınır
 * @param {string|Date} value
 * @returns {string}
 */
export function datePart(value) {
  if (!value) return ''
  if (value instanceof Date) return toLocalIsoDate(value)
  const s = String(value)
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10)
  return toLocalIsoDate(new Date(s))
}

/**
 * Vade geçmiş mi? Yalnızca takvim günü karşılaştırılır:
 * vade tarihi (gün kısmı) bugünün yerel tarihinden küçükse gecikmiştir.
 * Vade günü içinde (saatten bağımsız) gecikmiş sayılmaz.
 * @param {string|Date} dueDate
 * @returns {boolean}
 */
export function isPastDue(dueDate) {
  const d = datePart(dueDate)
  if (!d) return false
  return d < todayLocalIso()
}

/**
 * Takvim günü bazında gecikme günü (vade günü = 0, ertesi gün = 1)
 * @param {string|Date} dueDate
 * @returns {number}
 */
export function daysPastDue(dueDate) {
  const d = datePart(dueDate)
  if (!d) return 0
  const [y, m, day] = d.split('-').map(Number)
  const due = new Date(y, m - 1, day)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return Math.round((today - due) / 86400000)
}
