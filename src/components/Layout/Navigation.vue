<template>
  <nav class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <div class="flex-shrink-0 flex items-center">
            <h1 class="text-xl font-bold text-blue-600">SmartParcours</h1>
          </div>
          <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
            <router-link
              v-for="item in navItems"
              :key="item.name"
              :to="item.href"
              class="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-blue-600 border-b-2 border-transparent hover:border-blue-300 transition-colors"
              active-class="border-blue-600 text-blue-600"
            >
              <component :is="item.icon" class="h-4 w-4 mr-2" />
              {{ item.name }}
            </router-link>
          </div>
        </div>
        
        <div class="flex items-center space-x-4">
          <span class="text-sm text-gray-700">
            {{ user?.profile.firstName }} {{ user?.profile.lastName }}
          </span>
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {{ user?.role === 'admin' ? 'Administrateur' : 'Étudiant' }}
          </span>
          <button
            @click="handleSignOut"
            class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { 
  HomeIcon, 
  UserIcon, 
  DocumentTextIcon, 
  ChartBarIcon,
  UsersIcon,
  CogIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()

const user = computed(() => authStore.user)

const studentNavItems = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Mon Profil', href: '/profil', icon: UserIcon },
  { name: 'Bulletins', href: '/bulletins', icon: DocumentTextIcon },
  { name: 'Recommandations', href: '/recommandations', icon: ChartBarIcon },
]

const adminNavItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
  { name: 'Gestion Utilisateurs', href: '/admin/users', icon: UsersIcon },
  { name: 'Rapports', href: '/admin/reports', icon: DocumentTextIcon },
  { name: 'Paramètres', href: '/admin/settings', icon: CogIcon },
]

const navItems = computed(() => {
  return user.value?.role === 'admin' ? adminNavItems : studentNavItems
})

const handleSignOut = async () => {
  await authStore.signOut()
  router.push('/login')
}
</script>