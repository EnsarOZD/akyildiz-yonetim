import { createRouter, createWebHistory } from 'vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { db } from '../firebase'
import { doc, getDoc } from 'firebase/firestore'

// Sayfa bileşenleri
import Dashboard from '../components/Dashboard.vue'
import Tenants from '../components/Tenants.vue'
import Payments from '../components/Payments.vue'
import Expenses from '../components/Expenses.vue'
import Utilities from '../components/Utilities.vue'
import TenantDetailPage from '../components/TenantDetailPage.vue'
import AdminDashboard from '../components/AdminDashboard.vue'
import LoginView from '../views/LoginView.vue'

const routes = [
  { path: '/', redirect: '/dashboard' },

  { path: '/dashboard', name: 'Dashboard', component: Dashboard, meta: { requiresAuth: true, roles: ['admin', 'manager'] } },
  { path: '/tenants', name: 'Tenants', component: Tenants, meta: { requiresAuth: true, roles: ['admin', 'manager'] } },
  { path: '/payments', name: 'Payments', component: Payments, meta: { requiresAuth: true, roles: ['admin', 'manager'] } },
  { path: '/expenses', name: 'Expenses', component: Expenses, meta: { requiresAuth: true, roles: ['admin', 'manager'] } },
  { path: '/utilities', name: 'Utilities', component: Utilities, meta: { requiresAuth: true, roles: ['admin', 'manager'] } },
  { path: '/tenant/:id', name: 'TenantDetail', component: TenantDetailPage, meta: { requiresAuth: true, roles: ['admin', 'manager'] } },

  { path: '/admin', name: 'Admin', component: AdminDashboard, meta: { requiresAuth: true, roles: ['admin'] } },

  { path: '/profile', name: 'Profile', component: () => import('../components/TenantSummary.vue'), meta: { requiresAuth: true, roles: ['tenant'] } },

  { path: '/login', name: 'Login', component: LoginView, meta: { public: true, hideLayout: true } }
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
        return next('/dashboard') // veya rolüne göre başka bir sayfa
      }
    }

    return next()
  })
})

export default router
