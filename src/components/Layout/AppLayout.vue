<template>
  <div class="min-h-screen bg-gray-50">
    <Navigation />
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import Navigation from './Navigation.vue'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()

// Loading state handled by router guards
</script>