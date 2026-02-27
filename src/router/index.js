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

const routes = [
  { path: '/', name: 'Landing', component: LandingPage, meta: { public: true, hideLayout: true } },
  { path: '/login', name: 'Login', component: LoginView, meta: { public: true, hideLayout: true } },

  { path: '/dashboard', name: 'Dashboard', component: Dashboard, meta: { requiresAuth: true, roles: ['admin', 'manager', 'viewer', 'observer', 'dataentry'] } },
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
  { path: '/OwnerDues', name: 'OwnerDuesPage', component: OwnerDues, meta: { requiresAuth: true, roles: ['admin', 'manager', 'dataentry'] } },
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
    const user = await authService.checkAuthStatus();

    // Auth required but not logged in
    if (!user && requiresAuth) {
      if (to.path !== '/login') return next('/login');
      return next();
    }

    // Role check
    if (user && to.meta.roles) {
      const userRole = (user.role || '').toLowerCase();
      const allowedRoles = to.meta.roles.map(r => r.toLowerCase());

      if (!allowedRoles.includes(userRole)) {
        console.warn(`Access denied for role: ${userRole}. Allowed: ${allowedRoles}`);
        // Redirect based on role
        if (userRole === 'tenant') return next('/tenant-dashboard');
        if (to.path !== '/dashboard') return next('/dashboard');
        return next();
      }
    }

    // Already logged in tries to access landing page, login page or root
    if (user && (to.path === '/' || to.path === '/login')) {
      let target = '/dashboard';
      if (user.role === 'admin') target = '/admin';
      else if (user.role === 'manager') target = '/dashboard';
      else if (user.role === 'viewer') target = '/overdue';
      else if (user.role === 'tenant') target = '/tenant-dashboard';

      if (to.path !== target) return next(target);
      return next();
    }

    return next();
  } else {
    return next();
  }
});

export default router
