<template>
  <div id="app">
    <TheHeader v-if="!authStore.user"/>
    <router-view />
    <TheFooter  v-if="!authStore.user" />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'

import TheHeader from './components/UI/TheHeader.vue'
import TheFooter from './components/UI/TheFooter.vue'

const authStore = useAuthStore()

onMounted(() => {
  authStore.initializeAuth()
})
</script>
<style>
html {
  scroll-behavior: smooth;
}
body, h1 {
  font-family: 'Montserrat', 'Inter', 'League Spartan', sans-serif;
}
</style>