<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="text-center flex flex-col items-center gap-4">
      <h1 class="text-2xl font-bold text-gray-900 mb-4">Accès non autorisé</h1>
      <p class="text-gray-600">Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
      <router-link 
        :to="dashboardPath"
        class="btn-primary flex items-center justify-center font-medium gap-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 px-4 py-2 text-sm" 
      >
        Revenir au tableau de bord
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import Button from '../components/UI/Button.vue';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore()

const user = computed(() => authStore.user)

const dashboardPath = computed(() => {
  switch (user.value?.role) {
    case "admin":
      return "/admin/dashboard";
    case "teacher":
      return "/teacher/dashboard";
    case "student":
      return "/dashboard";
    default:
      return "/";
  }
});
</script>