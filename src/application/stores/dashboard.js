import { defineStore } from 'pinia'
import dashboardService from '@/infrastructure/services/dashboardService'

const TTL_MS = 5 * 60 * 1000 // 5 minutes

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    summaryByKey: {},
    debtsSummaryByKey: {},
    pendingSummaryByKey: {},
    pendingDebtsByKey: {},
    lastFetchedSummaryByKey: {},
    lastFetchedDebtsByKey: {}
  }),

  actions: {
    async fetchSummary(dateFilter = 'all', force = false) {
      const cacheKey = dateFilter;
      
      if (!force && this.summaryByKey[cacheKey] && this.lastFetchedSummaryByKey[cacheKey] && (Date.now() - this.lastFetchedSummaryByKey[cacheKey] < TTL_MS)) {
        return this.summaryByKey[cacheKey];
      }

      if (this.pendingSummaryByKey[cacheKey]) {
        return this.pendingSummaryByKey[cacheKey];
      }

      const promise = (async () => {
        try {
          const data = await dashboardService.getDashboardSummary(cacheKey);
          this.summaryByKey[cacheKey] = data || {};
          this.lastFetchedSummaryByKey[cacheKey] = Date.now();
          return this.summaryByKey[cacheKey];
        } finally {
          this.pendingSummaryByKey[cacheKey] = null;
        }
      })();

      this.pendingSummaryByKey[cacheKey] = promise;
      return promise;
    },

    async fetchDebtsSummary(year = null, force = false) {
      const cacheKey = year ? year.toString() : 'all';
      
      if (!force && this.debtsSummaryByKey[cacheKey] && this.lastFetchedDebtsByKey[cacheKey] && (Date.now() - this.lastFetchedDebtsByKey[cacheKey] < TTL_MS)) {
        return this.debtsSummaryByKey[cacheKey];
      }

      if (this.pendingDebtsByKey[cacheKey]) {
        return this.pendingDebtsByKey[cacheKey];
      }

      const promise = (async () => {
        try {
          const data = await dashboardService.getDebtsSummary(year);
          this.debtsSummaryByKey[cacheKey] = data || [];
          this.lastFetchedDebtsByKey[cacheKey] = Date.now();
          return this.debtsSummaryByKey[cacheKey];
        } finally {
          this.pendingDebtsByKey[cacheKey] = null;
        }
      })();

      this.pendingDebtsByKey[cacheKey] = promise;
      return promise;
    },
    
    invalidateCache() {
        this.summaryByKey = {};
        this.debtsSummaryByKey = {};
        this.pendingSummaryByKey = {};
        this.pendingDebtsByKey = {};
        this.lastFetchedSummaryByKey = {};
        this.lastFetchedDebtsByKey = {};
    }
  }
})
