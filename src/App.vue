<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'

const authStore = useAuthStore()

onMounted(() => {
  authStore.initializeAuth()
})
</script>
<style>
html {
  scroll-behavior: smooth;
}
body {
  font-family: 'Montserrat', sans-serif;
}
/* .container {
  max-width: 1200px;
} */
</style>