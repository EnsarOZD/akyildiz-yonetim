import { defineStore } from 'pinia'
import tenantsService from '@/features/tenants/services/tenantsService.js'
import { errorHandler } from '@/utils/errorHandler'

export const useTenantsStore = defineStore('tenants', {
    state: () => ({
        tenants: [],
        stats: {
            activeCount: 0,
            occupancyRate: 0,
            totalDebt: 0,
            totalFlats: 0,
            occupiedFlats: 0
        },
        loading: false,
        lastFetched: null
    }),

    getters: {
        getTenantById: (state) => (id) => {
            return state.tenants.find(t => t.id === id)
        },
        activeTenants: (state) => {
            return state.tenants.filter(t => t.isActive)
        }
    },

    actions: {
        async fetchTenants(force = false) {
            // 5 dakikadan önce tekrar çekme (force değilse)
            if (!force && this.tenants.length > 0 && this.lastFetched && (Date.now() - this.lastFetched < 300000)) {
                return this.tenants
            }

            this.loading = true
            try {
                // Paralel olarak hem kiracıları hem istatistikleri çek
                const [tenantsData, statsData] = await Promise.all([
                    tenantsService.getTenants(),
                    tenantsService.getTenantStats()
                ])
                this.tenants = tenantsData || []
                this.stats = statsData || this.stats
                this.lastFetched = Date.now()
                return this.tenants
            } catch (err) {
                errorHandler.logError(err, { component: 'TenantsStore', action: 'fetchTenants' })
                throw err
            } finally {
                this.loading = false
            }
        },

        async fetchStats() {
            try {
                const data = await tenantsService.getTenantStats()
                this.stats = data || this.stats
                return this.stats
            } catch (err) {
                console.error('İstatistikler çekilemedi:', err)
                return this.stats
            }
        },

        async createTenant(tenantData) {
            try {
                const newTenant = await tenantsService.createTenant(tenantData)
                // Listeyi güncellemek için cache'i temizle veya ekle
                // Şimdilik listeyi tekrar çekmek en güvenlisi (ilişkili veriler vb. için)
                await this.fetchTenants(true)
                return newTenant
            } catch (err) {
                throw err
            }
        },

        async updateTenant(id, tenantData) {
            try {
                await tenantsService.updateTenant(id, tenantData)
                await this.fetchTenants(true)
            } catch (err) {
                throw err
            }
        },

        async deleteTenant(id) {
            try {
                await tenantsService.deleteTenant(id)
                this.tenants = this.tenants.filter(t => t.id !== id)
            } catch (err) {
                throw err
            }
        }
    }
})
