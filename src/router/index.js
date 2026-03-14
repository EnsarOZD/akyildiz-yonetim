import { createRouter, createWebHistory } from 'vue-router'
import authService from '@/services/authService'
import { useAuthStore } from '@/stores/auth'

// Lazy loaded components for better performance
const Dashboard = () => import('../features/dashboard/Dashboard.vue')
const Tenants = () => import('../features/tenants/Tenants.vue')
const Payments = () => import('../features/payments/Payments.vue')
const Expenses = () => import('../features/expenses/Expenses.vue')
const Utilities = () => import('../features/expenses/Utilities.vue')
const TenantDetailPage = () => import('../features/tenants/components/TenantDetailPage.vue')
const AdminDashboard = () => import('../features/dashboard/AdminDashboard.vue')
const LoginView = () => import('../views/LoginView.vue')
const LandingPage = () => import('../views/LandingPage.vue')
const Transactions = () => import('../pages/Transactions.vue')
const OwnerDuesPanel = () => import('../features/expenses/OwnerDuesPanel.vue')
const Owners = () => import('../features/owners/Owners.vue')
const OwnerDues = () => import('../pages/OwnerDues.vue')
const OwnerPayments = () => import('../pages/OwnerPayments.vue')
const OverdueOwnerPayments = () => import('../pages/OverdueOwnerPayments.vue')
const Overdue = () => import('../pages/Overdue.vue')
const Flats = () => import('../features/flats/Flats.vue')
const Reports = () => import('../features/reports/ReportsView.vue')
const Notifications = () => import('../features/notifications/NotificationsView.vue')
const Profile = () => import('../features/users/ProfileView.vue')
const MyProperties = () => import('../features/owners/MyPropertiesView.vue')

const routes = [
  { path: '/', name: 'Landing', component: LandingPage, meta: { public: true, hideLayout: true } },
  { path: '/login', name: 'Login', component: LoginView, meta: { public: true, hideLayout: true } },

  { path: '/dashboard', name: 'Dashboard', component: Dashboard, meta: { requiresAuth: true, roles: ['admin', 'manager', 'observer', 'dataentry'] } },
  { path: '/tenant-dashboard', name: 'TenantDashboard', component: () => import('../features/dashboard/TenantDashboard.vue'), meta: { requiresAuth: true, roles: ['tenant', 'admin', 'manager'] } },
  { path: '/tenants', name: 'Tenants', component: Tenants, meta: { requiresAuth: true, roles: ['admin', 'manager', 'dataentry'] } },
  { path: '/tenants/:id', name: 'TenantDetailPage', component: TenantDetailPage, meta: { requiresAuth: true, roles: ['admin', 'manager', 'dataentry'] } },
  { path: '/payments', name: 'Payments', component: Payments, meta: { requiresAuth: true, roles: ['admin', 'manager', 'dataentry', 'observer'] } },
  { path: '/expenses', name: 'Expenses', component: Expenses, meta: { requiresAuth: true, roles: ['admin', 'manager', 'dataentry'] } },
  { path: '/utilities', name: 'Utilities', component: Utilities, meta: { requiresAuth: true, roles: ['admin', 'manager', 'dataentry'] } },
  { path: '/flats', name: 'Flats', component: Flats, meta: { requiresAuth: true, roles: ['admin', 'manager', 'dataentry'] } },
  { path: '/reports', name: 'Reports', component: Reports, meta: { requiresAuth: true, roles: ['admin', 'manager', 'observer'] } },
  { path: '/notifications', name: 'Notifications', component: Notifications, meta: { requiresAuth: true } },
  { path: '/my-payments', name: 'MyPayments', component: () => import('../features/tenants/MyPaymentsView.vue'), meta: { requiresAuth: true, roles: ['admin', 'manager', 'tenant'] } },

  { path: '/admin', name: 'Admin', component: AdminDashboard, meta: { requiresAuth: true, roles: ['admin', 'manager'] } },

  { path: '/profile', name: 'Profile', component: Profile, meta: { requiresAuth: true } },
  { path: '/my-properties', name: 'MyProperties', component: MyProperties, meta: { requiresAuth: true, roles: ['owner'] } },

  { path: '/set-password', name: 'SetPassword', component: () => import('../views/SetPasswordView.vue'), meta: { public: true, hideLayout: true } },
  { path: '/reset-password', name: 'ResetPassword', component: () => import('../views/SetPasswordView.vue'), meta: { public: true, hideLayout: true } },
  { path: '/invite', name: 'Invite', component: () => import('../views/SetPasswordView.vue'), meta: { public: true, hideLayout: true } },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('../views/NotFound.vue') },
  {
    path: '/transactions',
    name: 'Transactions',
    component: Transactions,
    meta: { requiresAuth: true, roles: ['admin', 'manager', 'dataentry'] }
  },
  {
    path: '/overdue',
    name: 'Overdue',
    component: Overdue,
    meta: { requiresAuth: true, roles: ['admin', 'manager', 'dataentry', 'observer'] }
  },
  { path: '/owner-dues', name: 'OwnerDues', component: OwnerDuesPanel, meta: { requiresAuth: true, roles: ['admin', 'manager', 'dataentry'] } },
  { path: '/owners', name: 'Owners', component: Owners, meta: { requiresAuth: true, roles: ['admin', 'manager', 'dataentry'] } },
  { path: '/owner-dues-list', name: 'OwnerDuesList', component: OwnerDues, meta: { requiresAuth: true, roles: ['admin', 'manager', 'dataentry'] } },
  { path: '/owner-payments', name: 'OwnerPayments', component: OwnerPayments, meta: { requiresAuth: true, roles: ['admin', 'manager', 'dataentry'] } },
  { path: '/overdue-owner-payments', name: 'OverdueOwnerPayments', component: OverdueOwnerPayments, meta: { requiresAuth: true, roles: ['admin', 'manager', 'dataentry'] } },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// PWA / Standalone mod kontrolü
const isStandalone = () => {
  return window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone ||
    document.referrer.includes('android-app://');
};

// Güvenlik için rate limiting
const authAttempts = new Map()
const MAX_AUTH_ATTEMPTS = 5
const AUTH_TIMEOUT = 15 * 60 * 1000 // 15 dakika

let loginRedirectCount = 0;

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.meta.requiresAuth;
  const isPublic = to.meta.public;

  // Clear chunk retry logic on successful navigation
  const retryKey = 'chunk_load_retry_' + to.path;
  if (window.sessionStorage.getItem(retryKey)) {
    window.sessionStorage.removeItem(retryKey);
  }

  // PWA Modunda Landing'den Login'e yönlendir
  if (to.path === '/' && isStandalone()) {
    return next('/login');
  }

  if (to.path === '/login' && (from.path === '/login' || !requiresAuth)) {
    return next();
  }
  if (isPublic) {
    return next();
  }

  const isBackendActive = import.meta.env.VITE_API_BASE_URL &&
    import.meta.env.VITE_API_BASE_URL !== 'http://localhost:5000/api';

  if (isBackendActive) {
    const authStore = useAuthStore();

    // Fast path: store already initialized — use cached state, no API call
    let user = null;
    let userRole = '';

    if (authStore.isInitialized && authStore.role) {
      userRole = authStore.role.toLowerCase();
      user = { role: userRole };
    } else {
      // Slow path: first load or after logout — verify with backend
      await authStore.fetchUserProfile();
      // After fetchUserProfile, authStore is updated — use it directly
      if (authStore.isInitialized && authStore.role) {
        userRole = authStore.role.toLowerCase();
        user = { role: userRole };
      }
    }

    // Auth required but not logged in
    if (!user && requiresAuth) {
      if (to.path !== '/login') return next('/login');
      return next();
    }

    // Role check
    if (user && to.meta.roles) {
      const allowedRoles = to.meta.roles.map(r => r.toLowerCase());

      if (!allowedRoles.includes(userRole)) {
        console.warn(`Access denied for role: ${userRole}. Allowed: ${allowedRoles}`);
        if (userRole === 'tenant') return next('/tenant-dashboard');
        if (userRole === 'owner') return next('/my-properties');
        return next('/dashboard');
      }
    }

    // Giriş yapmış kullanıcı ana sayfa veya login'e gitmeye çalışırsa
    if (user && (to.path === '/' || to.path === '/login')) {
      let target = '/dashboard';
      if (userRole === 'admin') target = '/admin';
      else if (userRole === 'tenant') target = '/tenant-dashboard';
      else if (userRole === 'owner') target = '/my-properties';
      else if (userRole === 'observer') target = '/dashboard';

      if (to.path !== target) return next(target);
      return next();
    }

    return next();
  } else {
    return next();
  }
});

router.onError((error, to) => {
  const isChunkError = error.message.includes('Failed to fetch dynamically imported module') || 
                       error.message.includes('Importing a zipped bundle') ||
                       error.message.includes('chunk') ||
                       error.message.includes('Failed to load module script') ||
                       error.message.includes('expected a JavaScript module');

  if (isChunkError) {
    console.error('🚀 Chunk Load Failure detected. Forcing page reload to clear cache...', error);
    const retryKey = 'chunk_load_retry_' + to.path;
    if (!window.sessionStorage.getItem(retryKey)) {
      window.sessionStorage.setItem(retryKey, 'true');
      window.location.reload(true);
    } else {
      console.error('Chunk load retry limit reached for', to.path, '. Please clear your cache.');
      window.sessionStorage.removeItem(retryKey);
    }
  } else {
    console.error('Router navigation error:', error);
  }
});

export default router
