// src/services/meterReadingsService.js
import api from './api'

const BASE_URL = '/MeterReadings'

/** Yardımcılar */
function safeArray(x) {
  return Array.isArray(x) ? x : []
}

function buildUrl(base, paramsObj = {}) {
  const qp = new URLSearchParams()
  Object.entries(paramsObj).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') qp.append(k, v)
  })
  const qs = qp.toString()
  return qs ? `${base}?${qs}` : base
}

function toNumber(n, def = 0) {
  const v = Number(n)
  return Number.isFinite(v) ? v : def
}

/** MeterType enum mapping */
const MeterType = {
  Electricity: 0,
  Water: 1
}

/** String type'i numeric type'a çevir */
function normalizeType(type) {
  if (typeof type === 'string') {
    return MeterType[type] || 0
  }
  return type
}

/** Numeric type'i string type'a çevir */
function typeToString(type) {
  return type === 1 ? 'Water' : 'Electricity'
}

/** Backend'e gönderilecek payload'ı normalize et */
function toPayload(row) {
  const payload = {
    flatId: row.flatId,
    type: normalizeType(row.type),
    periodYear: row.periodYear,
    periodMonth: row.periodMonth,
    readingValue: toNumber(row.readingValue),
    consumption: toNumber(row.consumption),
    readingDate: row.readingDate,
    note: row.note || null
  }
  
  // Consumption değeri korunmalı - 0 da geçerli bir değer olabilir
  // Backend'in otomatik hesaplama yapması için null gönderilmemeli
  
  return payload
}

export default {
  /** Tüm sayaç okumaları (filtreli) */
  async getMeterReadings(params = {}) {
    try {
      const url = buildUrl(BASE_URL, {
        flatId: params.flatId,
        type: params.type !== undefined ? normalizeType(params.type) : undefined,
        periodYear: params.periodYear,
        periodMonth: params.periodMonth,
        startDate: params.startDate,
        endDate: params.endDate
      })
      const response = await api.get(url)
      
      // API servisi direkt array döndürüyor, .data property'si yok
      const result = safeArray(response)
      
      return result
    } catch (error) {
      console.error('❌ Sayaç okumaları alınırken hata:', error)
      throw error
    }
  },

  /** ID ile tek okuma */
  async getMeterReadingById(id) {
    try {
      const response = await api.get(`${BASE_URL}/${id}`)
      return response // API servisi direkt objeyi döndürüyor
    } catch (error) {
      console.error('Sayaç okuması alınırken hata:', error)
      throw error
    }
  },

  /** Yeni okuma oluştur */
  async createMeterReading(meterReadingData) {
    try {
      const payload = toPayload(meterReadingData)
      const response = await api.post(BASE_URL, payload)
      return response // API servisi direkt objeyi döndürüyor
    } catch (error) {
      console.error('Sayaç okuması oluşturulurken hata:', error)
      throw error
    }
  },

  /** Okuma güncelle */
  async updateMeterReading(id, meterReadingData) {
    try {
      const payload = toPayload({ ...meterReadingData, id })
      const response = await api.put(`${BASE_URL}/${id}`, payload)
      return response // API servisi direkt objeyi döndürüyor
    } catch (error) {
      console.error('Sayaç okuması güncellenirken hata:', error)
      throw error
    }
  },

  /** Okuma sil */
  async deleteMeterReading(id) {
    try {
      const response = await api.delete(`${BASE_URL}/${id}`)
      return response // API servisi direkt objeyi döndürüyor
    } catch (error) {
      console.error('Sayaç okuması silinirken hata:', error)
      throw error
    }
  },

  /** Son okuma (flat+type) */
  async getLastReading(flatId, type) {
    try {
      const normalizedType = normalizeType(type)
      const response = await api.get(`${BASE_URL}/last-readings/${flatId}/${normalizedType}`)
      
      // 204 No Content durumunda null döndür
      if (!response) {
        return null
      }
      
      return response // API servisi direkt objeyi döndürüyor
    } catch (error) {
      // 404 Not Found durumunda da null döndür (son okuma yok)
      if (error?.response?.status === 404 || error?.response?.status === 204) {
        return null
      }
      
      console.error('Son sayaç okuması alınırken hata:', error)
      throw error
    }
  },

  /** İstatistikler */
  async getMeterReadingStats(params = {}) {
    try {
      const url = buildUrl(`${BASE_URL}/stats`, {
        year: params.year,
        month: params.month,
        type: params.type !== undefined ? normalizeType(params.type) : undefined
      })
      const response = await api.get(url)
      return response ?? {} // API servisi direkt objeyi döndürüyor
    } catch (error) {
      console.error('Sayaç okuma istatistikleri alınırken hata:', error)
      throw error
    }
  },

  /** Dönem bazlı liste */
  async getMeterReadingsByPeriod(year, month, type = null) {
    try {
      const params = { periodYear: year, periodMonth: month }
      if (type) params.type = type
      return await this.getMeterReadings(params)
    } catch (error) {
      console.error('Dönem bazlı sayaç okumaları alınırken hata:', error)
      throw error
    }
  },

  /** Daire bazlı liste */
  async getMeterReadingsByFlat(flatId, type = null) {
    try {
      const params = { flatId }
      if (type) params.type = type
      return await this.getMeterReadings(params)
    } catch (error) {
      console.error('Daire bazlı sayaç okumaları alınırken hata:', error)
      throw error
    }
  },

  /** Ortak tüketim dağıt */
  async distributeSharedConsumption(command) {
    try {
      const payload = {
        sharedAreaConsumption: toNumber(command.sharedAreaConsumption),
        mescitConsumption: toNumber(command.mescitConsumption),
        periodYear: command.periodYear,
        periodMonth: command.periodMonth,
        sharedElectricityFlatIds: command.sharedElectricityFlatIds || undefined
      }
      const response = await api.post(`${BASE_URL}/distribute-shared-consumption`, payload)
      return response // API servisi direkt objeyi döndürüyor
    } catch (error) {
      console.error('Ortak tüketim dağıtılırken hata:', error)
      throw error
    }
  },

  /** Ortak tüketim uygula */
  async applySharedConsumption(command) {
    try {
      const payload = {
        operationId: command.operationId,
        periodYear: command.periodYear,
        periodMonth: command.periodMonth,
        dueDate: command.dueDate,
        vatRate: toNumber(command.vatRate),
        btvRate: toNumber(command.btvRate),
        defaultUnitPrice: toNumber(command.defaultUnitPrice),
        items: command.items.map(item => ({
          flatId: item.flatId,
          shareCount: toNumber(item.shareCount),
          distributedConsumption: toNumber(item.distributedConsumption),
          unitPrice: item.unitPrice ? toNumber(item.unitPrice) : undefined
        }))
      }
      const response = await api.post(`${BASE_URL}/apply-shared-consumption`, payload)
      return response // API servisi direkt objeyi döndürüyor
    } catch (error) {
      console.error('Ortak tüketim uygulanırken hata:', error)
      throw error
    }
  },

  /** Toplu ekleme/güncelleme */
  async bulkUpsertMeterReadings(items) {
    try {
      // ✅ DOĞRU FORMAT - command wrapper OLMADAN
      const payload = {
        items: items.map(item => ({
          id: item.id || null,
          flatId: item.flatId,
          type: normalizeType(item.type),
          periodYear: item.periodYear,
          periodMonth: item.periodMonth,
          readingValue: toNumber(item.readingValue),
          consumption: item.consumption !== undefined && item.consumption !== null ? toNumber(item.consumption) : 0,
          readingDate: item.readingDate,
          note: item.note || null
        }))
      }
      
      
      const response = await api.post(`${BASE_URL}/bulk-upsert`, payload)
      return response // API servisi direkt objeyi döndürüyor
    } catch (error) {
      console.error('Toplu sayaç okuması işlenirken hata:', error)
      throw error
    }
  },

  /** 
   * (Legacy) Backend batch endpoint'i varsa kullan
   * Body: [{ flatId, type, periodYear, periodMonth, previousValue, currentValue, ... }]
   */
  async createMeterReadingsBatch(list) {
    const body = list.map(toPayload)
    const response = await api.post(`${BASE_URL}/batch`, body)
    return response // API servisi direkt objeyi döndürüyor
  },

  /**
   * Toplu upsert (Legacy):
   * - preferBatch=true: /meterreadings/batch dener; 404/405 ise tek tek POST/PUT
   * - her item için: id varsa PUT, yoksa POST
   */
  async upsertMeterReadings(list, { preferBatch = true } = {}) {
    const rows = safeArray(list)
    if (!rows.length) return { ok: 0, fail: 0 }

    if (preferBatch) {
      try {
        await this.createMeterReadingsBatch(rows)
        return { ok: rows.length, fail: 0 }
      } catch (err) {
        const status = err?.response?.status
        const methodNotAllowed = status === 404 || status === 405
        if (!methodNotAllowed) {
          console.error('Batch kaydetme hatası:', err)
          throw err
        }
        // 404/405 ise tek tek devam…
      }
    }

    const ops = rows.map(r => {
      const payload = toPayload(r)
      return r.id
        ? api.put(`${BASE_URL}/${r.id}`, payload)
        : api.post(BASE_URL, payload)
    })

    const results = await Promise.allSettled(ops)
    const failed = results.filter(x => x.status === 'rejected')
    if (failed.length) {
      throw new Error(`Bazı kayıtlar kaydedilemedi (${rows.length - failed.length}/${rows.length} başarılı).`)
    }
    return { ok: rows.length, fail: 0 }
  },

  // Sistem fiyatlandırma bilgilerini getir
  async getPricing(year, month, type = 0) {
    try {
      console.log(`🔄 Fiyatlandırma bilgileri getiriliyor: ${year}/${month}/${type}`)
      
      const response = await api.get(`${BASE_URL}/pricing/${year}/${month}/${type}`)
      console.log('✅ Fiyatlandırma bilgileri alındı:', response)
      return response
    } catch (error) {
      console.error('❌ Fiyatlandırma bilgileri alınırken hata:', error)
      throw error
    }
  },

  // Ortak tüketim dağıtımı hesaplama
  async distributeSharedConsumption(request) {
    try {
      console.log('🔄 Ortak tüketim dağıtımı hesaplanıyor:', request)
      
      const response = await api.post(`${BASE_URL}/distribute-shared-consumption`, request)
      console.log('✅ Ortak tüketim dağıtımı hesaplandı:', response)
      return response
    } catch (error) {
      console.error('❌ Ortak tüketim dağıtımı hesaplanırken hata:', error)
      throw error
    }
  },

  // Ortak tüketim uygulama
  async applySharedConsumption(request) {
    try {
      console.log('🔄 Ortak tüketim uygulanıyor:', request)
      
      const response = await api.post(`${BASE_URL}/apply-shared-consumption`, request)
      console.log('✅ Ortak tüketim uygulandı:', response)
      return response
    } catch (error) {
      console.error('❌ Ortak tüketim uygulanırken hata:', error)
      throw error
    }
  },

  /** MeterType enum'ını export et */
  MeterType
}
