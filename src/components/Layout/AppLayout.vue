<template>
  <div class="h-screen bg-gray-50 flex overflow-hidden">
    <!-- Sidebar (fixed size, not scrollable) -->
    <Navigation />

    <!-- Main content (scrollable) -->
    <main class="flex-1 overflow-y-auto py-6 sm:px-6 lg:px-8">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import Navigation from './Navigation.vue'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()
</script>
