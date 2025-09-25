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