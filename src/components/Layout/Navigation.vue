<template>
  <aside
    class="w-[280px] bg-white/95 backdrop-blur-xl border-r border-white/20 pt-8 flex flex-col h-screen"
  >
    <!-- Logo -->
    <div class="px-8 pb-8 border-b border-black/10 mb-8">
      <Logo class="w-full" />
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-4">
      <router-link
        v-for="item in navItems"
        :key="item.name"
        :to="item.href"
        class="flex items-center p-4 my-1 rounded-xl text-gray-500 transition-all duration-300 hover:bg-indigo-100 hover:text-indigo-600 active-nav-item"
        active-class="bg-indigo-100 text-indigo-600 translate-x-1"
      >
        <component :is="item.icon" class="w-5 h-5 mr-3" />
        {{ item.name }}
      </router-link>
    </nav>

    <!-- Profile Section -->
    <div class="flex flex-col gap-4 px-8 py-4 border-t border-black/10">
      <div class="flex items-center gap-3">
        <div
          class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white font-semibold flex items-center justify-center"
        >
          {{ userInitials }}
        </div>
        <div>
          <div class="font-semibold text-sm">
            {{ user?.profile.firstName }} {{ user?.profile.lastName }}
          </div>
          <div class="text-gray-500 text-xs">
            {{ user?.role === 'admin' ? 'Administrateur' : 'Étudiant' }}
          </div>
        </div>
      </div>
      <button
        @click="handleSignOut"
        class="inline-flex items-center justify-center px-3 py-1.5 border border-red-100 text-sm font-medium rounded-md text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors"
      >
        Déconnexion
      </button>
    </div>
  </aside>
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
  CogIcon,
} from '@heroicons/vue/24/solid'
import Logo from '../../assets/logo.vue'

const router = useRouter()
const authStore = useAuthStore()

const user = computed(() => authStore.user)

const userInitials = computed(() => {
  if (!user.value?.profile) return ''
  const { firstName, lastName } = user.value.profile
  return `${firstName?.charAt(0) ?? ''}${lastName?.charAt(0) ?? ''}`.toUpperCase()
})

const studentNavItems = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Mon Profil', href: '/profil', icon: UserIcon },
  { name: 'Bulletins', href: '/bulletins', icon: DocumentTextIcon },
  { name: 'Recommandations', href: '/recommandations', icon: ChartBarIcon },
]

const adminNavItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
  { name: 'Gestion Utilisateurs', href: '/admin/users', icon: UsersIcon },
  // { name: 'Rapports', href: '/admin/reports', icon: DocumentTextIcon },
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
<style scoped>
.active-nav-item.router-link-exact-active {
  transform: translateX(4px);
}
</style>