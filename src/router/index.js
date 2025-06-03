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
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/tenants', name: 'Tenants', component: Tenants },
  { path: '/payments', name: 'Payments', component: Payments },
  { path: '/expenses', name: 'Expenses', component: Expenses },
  { path: '/utilities', name: 'Utilities', component: Utilities },
  { path: '/tenant/:id', name: 'TenantDetail', component: TenantDetailPage },
  { path: '/admin', name: 'Admin', component: AdminDashboard, meta: { requiresAdmin: true } },
  { path: '/login', name: 'Login', component: LoginView, meta: { public: true, hideLayout: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const requiresAuth = !to.meta.public
  const requiresAdmin = to.meta.requiresAdmin

  const unsubscribe = onAuthStateChanged(getAuth(), async (user) => {
    unsubscribe()

    if (!user && requiresAuth) {
      return next('/login')
    }

    if (requiresAdmin) {
      const userDocRef = doc(db, 'users', user.uid)
      const userDocSnap = await getDoc(userDocRef)
      const role = userDocSnap.exists() ? userDocSnap.data().role : null

      if (role !== 'admin') {
        return next('/dashboard')
      }
    }

    return next()
  })
})

export default router
