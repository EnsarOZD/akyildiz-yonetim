import { defineStore } from 'pinia'
import utilityDebtsService from '@/infrastructure/services/utilityDebtsService'

const TTL_MS = 5 * 60 * 1000 // 5 minutes

export const useUtilityDebtsStore = defineStore('utilityDebts', {
  state: () => ({
    itemsByKey: {},
    loadingByKey: {},
    errorByKey: {},
    lastFetchedByKey: {},
    pendingPromisesByKey: {}
  }),

  actions: {
    getCacheKey(filters = {}) {
      const normalizedFilters = { ...filters }
      const keys = Object.keys(normalizedFilters).sort()
      const sortedFilters = {}
      for (const key of keys) {
        if (normalizedFilters[key] !== undefined && normalizedFilters[key] !== null && normalizedFilters[key] !== '') {
          sortedFilters[key] = normalizedFilters[key]
        }
      }
      return Object.keys(sortedFilters).length ? JSON.stringify(sortedFilters) : 'default'
    },

    async fetchIfNeeded(filters = {}, force = false) {
      const cacheKey = this.getCacheKey(filters)

      if (!force && this.itemsByKey[cacheKey] && this.lastFetchedByKey[cacheKey] && (Date.now() - this.lastFetchedByKey[cacheKey] < TTL_MS)) {
        return this.itemsByKey[cacheKey]
      }

      if (this.pendingPromisesByKey[cacheKey]) {
        return this.pendingPromisesByKey[cacheKey]
      }

      this.loadingByKey[cacheKey] = true
      this.errorByKey[cacheKey] = null

      const promise = (async () => {
        try {
          const data = await utilityDebtsService.getUtilityDebts(filters)
          this.itemsByKey[cacheKey] = data || []
          this.lastFetchedByKey[cacheKey] = Date.now()
          return this.itemsByKey[cacheKey]
        } catch (err) {
          this.errorByKey[cacheKey] = err.message || 'Borçlar yüklenemedi.'
          throw err
        } finally {
          this.loadingByKey[cacheKey] = false
          this.pendingPromisesByKey[cacheKey] = null
        }
      })()

      this.pendingPromisesByKey[cacheKey] = promise
      return promise
    },

    async forceRefresh(filters = {}) {
      return this.fetchIfNeeded(filters, true)
    },

    invalidateCache(filters = null) {
      if (filters !== null) {
        const cacheKey = this.getCacheKey(filters)
        delete this.itemsByKey[cacheKey]
        delete this.lastFetchedByKey[cacheKey]
        delete this.pendingPromisesByKey[cacheKey]
        delete this.loadingByKey[cacheKey]
        delete this.errorByKey[cacheKey]
      } else {
        this.itemsByKey = {}
        this.lastFetchedByKey = {}
        this.pendingPromisesByKey = {}
        this.loadingByKey = {}
        this.errorByKey = {}
      }
    }
  }
})
