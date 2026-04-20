import { defineStore } from 'pinia'
import paymentsService from '@/infrastructure/services/paymentsService'
import { errorHandler } from '@/core/utils/errorHandler'
import { useCachedQuery } from '@/application/composables/useCachedQuery'

const TTL_MS = 5 * 60 * 1000 // 5 dakika

// Eş zamanlı fetch çağrılarını tek isteğe indir
let _fetchPromise = null

export const usePaymentsStore = defineStore('payments', {
    state: () => ({
        payments: [],
        advanceAccounts: [],
        loading: false,
        lastFetched: null
    }),

    actions: {
        async fetchPayments(force = false) {
            // TTL kontrolü — 5 dakika içinde yeniden çekilmez
            if (!force && this.payments.length > 0 && this.lastFetched && (Date.now() - this.lastFetched < TTL_MS)) {
                return this.payments
            }

            if (_fetchPromise) return _fetchPromise

            this.loading = true
            _fetchPromise = (async () => {
                try {
                    const data = await paymentsService.getPayments()
                    this.payments = data || []
                    this.lastFetched = Date.now()
                    return this.payments
                } catch (err) {
                    errorHandler.logError(err, { component: 'PaymentsStore', action: 'fetchPayments' })
                    throw err
                } finally {
                    this.loading = false
                    _fetchPromise = null
                }
            })()

            return _fetchPromise
        },

        /** Cache'i geçersiz kılarak yeniden yükle */
        async invalidateAndRefetch() {
            this.lastFetched = null
            return this.fetchPayments(true)
        },

        async fetchAdvanceAccounts() {
            this.loading = true
            try {
                const raw = await paymentsService.getAdvanceAccounts()
                const list = Array.isArray(raw) ? raw : (raw?.items || [])
                this.advanceAccounts = list
                    .map(a => ({ ...a, balance: Number(a.balance ?? 0) }))
                    .filter(a => a.balance > 0)
                return this.advanceAccounts
            } catch (err) {
                errorHandler.logError(err, { component: 'PaymentsStore', action: 'fetchAdvanceAccounts' })
                throw err
            } finally {
                this.loading = false
            }
        },

        async deletePayment(id) {
            try {
                await paymentsService.deletePayment(id)
                this.payments = this.payments.filter(p => p.id !== id)
                // Silme sonrası cache'i sıfırla
                this.lastFetched = null
                await this.fetchAdvanceAccounts()
            } catch (err) {
                throw err
            }
        },

        async bulkDeletePayments(ids) {
            try {
                await paymentsService.bulkDeletePayments(ids)
                this.payments = this.payments.filter(p => !ids.includes(p.id))
                this.lastFetched = null
                await this.fetchAdvanceAccounts()
            } catch (err) {
                errorHandler.logError(err, { component: 'PaymentsStore', action: 'bulkDeletePayments' })
                throw err
            }
        }
    }
})
