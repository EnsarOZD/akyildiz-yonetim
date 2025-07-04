/**
 * Akıllı Sayaç Yönetimi Sistemi
 * - Veri tutarlılığını sağlar
 * - Performansı artırır
 * - Audit trail oluşturur
 */

export class MeterManager {
  constructor() {
    this.cache = new Map()
    this.batchSize = 10
  }

  /**
   * Birim için son sayaç okumasını getir
   * @param {string} unit - Birim adı
   * @param {string} type - Sayaç tipi (electricity/water)
   * @returns {Promise<Object>} Son okuma verisi
   */
  async getLastReading(unit, type) {
    const cacheKey = `${unit}_${type}`
    
    // Cache kontrolü
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)
    }

    const q = query(
      collection(db, 'readings'),
      where('unit', '==', unit),
      where('type', '==', type),
      orderBy('endDate', 'desc'),
      limit(1)
    )
    
    const snap = await getDocs(q)
    const lastReading = !snap.empty ? snap.docs[0].data() : null
    
    // Cache'e kaydet
    this.cache.set(cacheKey, lastReading)
    return lastReading
  }

  /**
   * Tüm birimler için son okumaları toplu getir
   * @param {Array} units - Birim listesi
   * @param {string} type - Sayaç tipi
   * @returns {Promise<Map>} Birim-son okuma eşleşmesi
   */
  async getLastReadingsBatch(units, type) {
    const readingsMap = new Map()
    
    // Batch işlemi için gruplar oluştur
    const batches = []
    for (let i = 0; i < units.length; i += this.batchSize) {
      batches.push(units.slice(i, i + this.batchSize))
    }

    // Her batch için paralel sorgu
    const promises = batches.map(async (batchUnits) => {
      const q = query(
        collection(db, 'readings'),
        where('unit', 'in', batchUnits),
        where('type', '==', type),
        orderBy('endDate', 'desc')
      )
      
      const snap = await getDocs(q)
      const readings = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      
      // Her birim için en son okumayı bul
      batchUnits.forEach(unit => {
        const unitReadings = readings.filter(r => r.unit === unit)
        if (unitReadings.length > 0) {
          const lastReading = unitReadings.sort((a, b) => 
            new Date(b.endDate) - new Date(a.endDate)
          )[0]
          readingsMap.set(unit, lastReading)
        } else {
          readingsMap.set(unit, null)
        }
      })
    })

    await Promise.all(promises)
    return readingsMap
  }

  /**
   * Sayaç okuması için önerilen değerleri hesapla
   * @param {string} unit - Birim adı
   * @param {string} type - Sayaç tipi
   * @param {Date} targetDate - Hedef tarih
   * @returns {Promise<Object>} Önerilen değerler
   */
  async getSuggestedReadings(unit, type, targetDate) {
    const lastReading = await this.getLastReading(unit, type)
    
    if (!lastReading) {
      return {
        previousValue: 0,
        suggestedCurrent: 0,
        lastReadingDate: null,
        warning: 'Bu birim için önceki okuma bulunamadı.'
      }
    }

    const lastDate = new Date(lastReading.endDate)
    const target = new Date(targetDate)
    const daysDiff = Math.floor((target - lastDate) / (1000 * 60 * 60 * 24))

    // Ortalama günlük tüketim hesapla (son 3 ay)
    const avgDailyUsage = await this.calculateAverageDailyUsage(unit, type)
    
    // Önerilen yeni değer
    const suggestedCurrent = Math.round(
      lastReading.currentValue + (avgDailyUsage * daysDiff)
    )

    return {
      previousValue: lastReading.currentValue,
      suggestedCurrent,
      lastReadingDate: lastReading.endDate,
      daysSinceLastReading: daysDiff,
      averageDailyUsage: avgDailyUsage,
      warning: daysDiff > 90 ? 'Son okuma 90 günden eski. Dikkatli kontrol edin.' : null
    }
  }

  /**
   * Ortalama günlük tüketim hesapla
   * @param {string} unit - Birim adı
   * @param {string} type - Sayaç tipi
   * @returns {Promise<number>} Ortalama günlük tüketim
   */
  async calculateAverageDailyUsage(unit, type) {
    const threeMonthsAgo = new Date()
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)

    const q = query(
      collection(db, 'readings'),
      where('unit', '==', unit),
      where('type', '==', type),
      where('endDate', '>=', threeMonthsAgo.toISOString().split('T')[0]),
      orderBy('endDate', 'desc'),
      limit(10)
    )

    const snap = await getDocs(q)
    const readings = snap.docs.map(doc => doc.data())

    if (readings.length < 2) return 0

    let totalUsage = 0
    let totalDays = 0

    for (let i = 0; i < readings.length - 1; i++) {
      const current = readings[i]
      const previous = readings[i + 1]
      
      const usage = current.currentValue - previous.currentValue
      const days = Math.floor(
        (new Date(current.endDate) - new Date(previous.endDate)) / (1000 * 60 * 60 * 24)
      )
      
      if (days > 0 && usage >= 0) {
        totalUsage += usage
        totalDays += days
      }
    }

    return totalDays > 0 ? totalUsage / totalDays : 0
  }

  /**
   * Sayaç okuması düzenleme için validasyon
   * @param {Object} oldRecord - Eski kayıt
   * @param {Object} newRecord - Yeni kayıt
   * @returns {Object} Validasyon sonucu
   */
  validateReadingEdit(oldRecord, newRecord) {
    const issues = []
    const warnings = []

    // Temel kontroller
    if (newRecord.currentValue < newRecord.previousValue) {
      issues.push('Yeni endeks önceki endeksten küçük olamaz.')
    }

    if (newRecord.currentValue < 0 || newRecord.previousValue < 0) {
      issues.push('Endeks değerleri negatif olamaz.')
    }

    // Anormal tüketim kontrolü
    const oldUsage = oldRecord.currentValue - oldRecord.previousValue
    const newUsage = newRecord.currentValue - newRecord.previousValue
    const usageDiff = Math.abs(newUsage - oldUsage)
    const usageChangePercent = (usageDiff / oldUsage) * 100

    if (usageChangePercent > 50) {
      warnings.push(`Tüketim değişimi %${usageChangePercent.toFixed(1)} - Anormal olabilir.`)
    }

    // Tarih kontrolü
    if (newRecord.endDate < oldRecord.endDate) {
      warnings.push('Yeni bitiş tarihi eski tarihten önce olamaz.')
    }

    return {
      isValid: issues.length === 0,
      issues,
      warnings,
      usageChange: {
        old: oldUsage,
        new: newUsage,
        difference: newUsage - oldUsage,
        percentChange: usageChangePercent
      }
    }
  }

  /**
   * Audit trail oluştur
   * @param {Object} oldRecord - Eski kayıt
   * @param {Object} newRecord - Yeni kayıt
   * @param {string} userId - Düzenleyen kullanıcı
   * @returns {Object} Audit kaydı
   */
  createAuditTrail(oldRecord, newRecord, userId) {
    const changes = {}
    
    Object.keys(newRecord).forEach(key => {
      if (oldRecord[key] !== newRecord[key]) {
        changes[key] = {
          from: oldRecord[key],
          to: newRecord[key]
        }
      }
    })

    return {
      recordId: oldRecord.id,
      recordType: oldRecord.type,
      unit: oldRecord.unit,
      changes,
      modifiedBy: userId,
      modifiedAt: new Date(),
      reason: 'manual_edit'
    }
  }

  /**
   * Cache'i temizle
   */
  clearCache() {
    this.cache.clear()
  }

  /**
   * Belirli bir birim için cache'i temizle
   * @param {string} unit - Birim adı
   * @param {string} type - Sayaç tipi
   */
  clearCacheForUnit(unit, type) {
    const cacheKey = `${unit}_${type}`
    this.cache.delete(cacheKey)
  }
}

// Singleton instance
export const meterManager = new MeterManager()

/**
 * Yardımcı fonksiyonlar
 */

export const formatMeterValue = (value, type) => {
  if (value === null || value === undefined || isNaN(value)) return '0.00'
  
  const formatted = Number(value).toFixed(2)
  const unit = type === 'electricity' ? ' kWh' : ' m³'
  return formatted + unit
}

export const calculateConsumption = (current, previous) => {
  return Math.max(0, current - previous)
}

export const calculateVAT = (amount, vatRate = 0.20) => {
  return +(amount * vatRate).toFixed(2)
}

export const calculateTotalWithVAT = (amount, vatRate = 0.20) => {
  return +(amount * (1 + vatRate)).toFixed(2)
} 