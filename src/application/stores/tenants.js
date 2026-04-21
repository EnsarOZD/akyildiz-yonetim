import { defineStore } from 'pinia'
import tenantsService from '@/infrastructure/services/tenantsService.js'
import { errorHandler } from '@/core/utils/errorHandler'

export const useTenantsStore = defineStore('tenants', {
    state: () => ({
        itemsByKey: {},
        statsByKey: {},
        loadingByKey: {},
        errorByKey: {},
        lastFetchedByKey: {},
        pendingPromisesByKey: {}
    }),

    getters: {
        getTenantById: (state) => (id) => {
            const allItemsList = Object.values(state.itemsByKey).flat()
            return allItemsList.find(t => t.id === id)
        },
        activeTenants: (state) => {
            const defaultItems = state.itemsByKey['default'] || []
            return defaultItems.filter(t => t.isActive)
        }
    },

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

            if (!force && this.itemsByKey[cacheKey] && this.lastFetchedByKey[cacheKey] && (Date.now() - this.lastFetchedByKey[cacheKey] < 300000)) {
                return this.itemsByKey[cacheKey]
            }

            if (this.pendingPromisesByKey[cacheKey]) {
                return this.pendingPromisesByKey[cacheKey]
            }

            this.loadingByKey[cacheKey] = true
            this.errorByKey[cacheKey] = null

            const promise = (async () => {
                try {
                    const [tenantsData, statsData] = await Promise.all([
                        tenantsService.getTenants(filters),
                        Object.keys(filters).length === 0 ? tenantsService.getTenantStats() : Promise.resolve(null)
                    ])
                    this.itemsByKey[cacheKey] = tenantsData || []
                    if (statsData) {
                        this.statsByKey[cacheKey] = statsData
                    }
                    this.lastFetchedByKey[cacheKey] = Date.now()
                    return this.itemsByKey[cacheKey]
                } catch (err) {
                    this.errorByKey[cacheKey] = err.message || 'Kiracılar yüklenemedi.'
                    errorHandler.logError(err, { component: 'TenantsStore', action: 'fetchIfNeeded' })
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
                delete this.statsByKey[cacheKey]
            } else {
                this.itemsByKey = {}
                this.lastFetchedByKey = {}
                this.pendingPromisesByKey = {}
                this.loadingByKey = {}
                this.errorByKey = {}
                this.statsByKey = {}
            }
        },

        async fetchStats() {
            try {
                const data = await tenantsService.getTenantStats()
                this.statsByKey['default'] = data || this.statsByKey['default']
                return this.statsByKey['default']
            } catch (err) {
                console.error('İstatistikler çekilemedi:', err)
                return this.statsByKey['default']
            }
        },

        async createTenant(tenantData) {
            try {
                const newTenant = await tenantsService.createTenant(tenantData)
                this.invalidateCache()
                await this.fetchIfNeeded({}, true)
                return newTenant
            } catch (err) {
                throw err
            }
        },

        async updateTenant(id, tenantData) {
            try {
                await tenantsService.updateTenant(id, tenantData)
                this.invalidateCache()
                await this.fetchIfNeeded({}, true)
            } catch (err) {
                throw err
            }
        },

        async deleteTenant(id) {
            try {
                await tenantsService.deleteTenant(id)
                this.invalidateCache()
                await this.fetchIfNeeded({}, true)
            } catch (err) {
                throw err
            }
        }
    }
})
