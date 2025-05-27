import { createRouter, createWebHistory } from 'vue-router'

import Dashboard from '../components/Dashboard.vue'
import Tenants from '../components/Tenants.vue'
import Payments from '../components/Payments.vue'
import Expenses from '../components/Expenses.vue'
import Utilities from '../components/Utilities.vue'
import TenantDetailPage from '../components/TenantDetailPage.vue'

const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/tenants', name: 'Tenants', component: Tenants },
  { path: '/payments', name: 'Payments', component: Payments },
  { path: '/expenses', name: 'Expenses', component: Expenses },
  { path: '/utilities', name: 'Utilities', component: Utilities },
  { path: '/tenant/:id', name: 'TenantDetail', component: TenantDetailPage }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
