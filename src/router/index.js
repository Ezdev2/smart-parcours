import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

// Auth Pages
import Login from '../pages/Auth/Login.vue'

// Student Pages
import StudentDashboard from '../pages/Student/Dashboard.vue'
import StudentProfile from '../pages/Student/Profile.vue'
import BulletinsPage from '../pages/Student/Bulletins.vue'
import RecommendationsPage from '../pages/Student/Recommendations.vue'

// Admin Pages
import AdminDashboard from '../pages/Admin/Dashboard.vue'
import UserManagement from '../pages/Admin/UserManagement.vue'
import AdminSettings from '../pages/Admin/Settings.vue'

// Layout
import AppLayout from '../components/Layout/AppLayout.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true }
  },
  {
    path: '/',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/dashboard'
      },
      // Student routes
      {
        path: '/dashboard',
        name: 'StudentDashboard',
        component: StudentDashboard,
        meta: { requiresAuth: true, role: 'student' }
      },
      {
        path: '/profil',
        name: 'StudentProfile',
        component: StudentProfile,
        meta: { requiresAuth: true, role: 'student' }
      },
      {
        path: '/bulletins',
        name: 'Bulletins',
        component: BulletinsPage,
        meta: { requiresAuth: true, role: 'student' }
      },
      {
        path: '/recommandations',
        name: 'Recommendations',
        component: RecommendationsPage,
        meta: { requiresAuth: true, role: 'student' }
      },
      // Admin routes
      {
        path: '/admin/dashboard',
        name: 'AdminDashboard',
        component: AdminDashboard,
        meta: { requiresAuth: true, role: 'admin' }
      },
      {
        path: '/admin/users',
        name: 'UserManagement',
        component: UserManagement,
        meta: { requiresAuth: true, role: 'admin' }
      },
      {
        path: '/admin/settings',
        name: 'AdminSettings',
        component: AdminSettings,
        meta: { requiresAuth: true, role: 'admin' }
      }
    ]
  },
  {
    path: '/unauthorized',
    name: 'Unauthorized',
    component: () => import('../pages/Unauthorized.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  if (authStore.loading) {
    // Wait for auth to initialize
    await new Promise(resolve => {
      const unwatch = authStore.$subscribe(() => {
        if (!authStore.loading) {
          unwatch()
          resolve()
        }
      })
    })
  }

  if (to.meta.requiresAuth && !authStore.user) {
    next('/login')
  } else if (to.meta.requiresGuest && authStore.user) {
    next('/dashboard')
  } else if (to.meta.role && authStore.user?.role !== to.meta.role) {
    next('/unauthorized')
  } else {
    next()
  }
})

export default router