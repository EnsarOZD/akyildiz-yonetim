import { createRouter, createWebHistory } from 'vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { db } from '../firebase'
import { doc, getDoc } from 'firebase/firestore'

// Sayfa bileşenleri
import Dashboard from '../features/dashboard/Dashboard.vue'
import Tenants from '../features/tenants/Tenants.vue'
import Payments from '../features/payments/Payments.vue'
import Expenses from '../features/expenses/Expenses.vue'
import Utilities from '../features/expenses/Utilities.vue'
import TenantDetailPage from '../features/tenants/components/TenantDetailPage.vue'
import AdminDashboard from '../features/dashboard/AdminDashboard.vue'
import LoginView from '../views/LoginView.vue'
import Transactions from '../pages/Transactions.vue'
import OwnerDuesPanel from '../features/expenses/OwnerDuesPanel.vue'
import Owners from '../features/owners/Owners.vue'
import OwnerDues from '../pages/OwnerDues.vue'
import OwnerPayments from '../pages/OwnerPayments.vue'
import OverdueOwnerPayments from '../pages/OverdueOwnerPayments.vue'
import Overdue from '../pages/Overdue.vue'

const routes = [
  { path: '/', redirect: '/dashboard' },

  { path: '/dashboard', name: 'Dashboard', component: Dashboard, meta: { requiresAuth: true, roles: ['admin', 'manager'] } },
  { path: '/tenants', name: 'Tenants', component: Tenants, meta: { requiresAuth: true, roles: ['admin', 'manager'] } },
  { path: '/tenants/:id', name: 'TenantDetailPage', component: TenantDetailPage, meta: { requiresAuth: true, roles: ['admin', 'manager'] } },
  { path: '/payments', name: 'Payments', component: Payments, meta: { requiresAuth: true, roles: ['admin', 'manager'] } },
  { path: '/expenses', name: 'Expenses', component: Expenses, meta: { requiresAuth: true, roles: ['admin', 'manager'] } },
  { path: '/utilities', name: 'Utilities', component: Utilities, meta: { requiresAuth: true, roles: ['admin', 'manager'] } },

  { path: '/admin', name: 'Admin', component: AdminDashboard, meta: { requiresAuth: true, roles: ['admin'] } },

  { path: '/profile', name: 'Profile', component: TenantDetailPage, meta: { requiresAuth: true, roles: ['tenant'] } },

  { path: '/login', name: 'Login', component: LoginView, meta: { public: true, hideLayout: true } },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('../views/NotFound.vue') },
  {
    path: '/transactions',
    name: 'Transactions',
    component: Transactions
  },
  {
    path: '/overdue',
    name: 'Overdue',
    component: Overdue
  },
  { path: '/owner-dues', name: 'OwnerDues', component: OwnerDuesPanel, meta: { requiresAuth: true, roles: ['admin', 'manager'] } },
  { path: '/owners', name: 'Owners', component: Owners, meta: { requiresAuth: true, roles: ['admin', 'manager'] } },
  { path: '/owner-dues-list', name: 'OwnerDuesList', component: OwnerDues, meta: { requiresAuth: true, roles: ['admin', 'manager'] } },
  { path: '/OwnerDues', name: 'OwnerDuesPage', component: OwnerDues, meta: { requiresAuth: true, roles: ['admin', 'manager'] } },
  { path: '/owner-payments', name: 'OwnerPayments', component: OwnerPayments, meta: { requiresAuth: true, roles: ['admin', 'manager'] } },
  { path: '/overdue-owner-payments', name: 'OverdueOwnerPayments', component: OverdueOwnerPayments, meta: { requiresAuth: true, roles: ['admin', 'manager'] } },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.meta.requiresAuth
  const allowedRoles = to.meta.roles

  const unsubscribe = onAuthStateChanged(getAuth(), async (user) => {
    unsubscribe()

    if (!user && requiresAuth) {
      return next('/login')
    }

    if (user && allowedRoles) {
      const userDocRef = doc(db, 'users', user.uid)
      const userDocSnap = await getDoc(userDocRef)
      const role = userDocSnap.exists() ? userDocSnap.data().role : null

      if (!allowedRoles.includes(role)) {
        if (to.path !== '/dashboard') {
          return next('/dashboard')
        } else {
          return next(false)
        }
      }
    }

    return next()
  })
})


export default router
