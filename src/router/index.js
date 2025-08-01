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

// Teacher Pages
import TeacherDashboard from '../pages/Teacher/Dashboard.vue'
import TeacherStudents from '../pages/Teacher/TeacherStudents.vue'

// Layout
import AppLayout from '../components/Layout/AppLayout.vue'
import Home from '../pages/HomePage/Home.vue'
import TermsAndConditions from '../pages/TermsAndConditions.vue'
import DemoPage from '../pages/Demo/DemoPage.vue'

const routes = [
  {
    path: '/terms-conditions',
    name: 'condition',
    component: TermsAndConditions,
    meta: { requiresAuth: false }
  },
  {
    path: '/demo',
    name: 'demo',
    component: DemoPage,
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: false }
  },
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
      },
      // Teacher routes
      {
        path: '/teacher/dashboard',
        name: 'TeacherDashboard',
        component: TeacherDashboard,
        meta: { requiresAuth: true, role: 'teacher' }
      },
      {
        path: '/teacher/students',
        name: 'TeacherStudents',
        component: TeacherStudents,
        meta: { requiresAuth: true, role: 'teacher' }
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
    next(getDashboardPath(authStore.user.role)) 
  } else {
    next()
  }
})

function getDashboardPath(role) {
  switch (role) {
    case 'admin':
      return '/admin/dashboard'
    case 'teacher':
      return '/teacher/dashboard'
    case 'student':
      return '/dashboard'
    default:
      return '/unauthorized'
  }
}

export default router