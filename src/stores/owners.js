import { defineStore } from 'pinia'
import ownersService from '@/services/ownersService.js'
import { errorHandler } from '@/utils/errorHandler'

export const useOwnersStore = defineStore('owners', {
    state: () => ({
        owners: [],
        loading: false,
        lastFetched: null
    }),

    getters: {
        getOwnerById: (state) => (id) => {
            return state.owners.find(o => o.id === id)
        }
    },

    actions: {
        async fetchOwners(force = false) {
            if (!force && this.owners.length > 0 && this.lastFetched && (Date.now() - this.lastFetched < 300000)) {
                return this.owners
            }

            this.loading = true
            try {
                const data = await ownersService.getOwners()
                this.owners = data || []
                this.lastFetched = Date.now()
                return this.owners
            } catch (err) {
                errorHandler.logError(err, { component: 'OwnersStore', action: 'fetchOwners' })
                throw err
            } finally {
                this.loading = false
            }
        }
    }
})
