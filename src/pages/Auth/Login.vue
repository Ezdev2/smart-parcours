<template>
  <div class="min-h-screen md:bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
      <Logo type="sigle" class="w-1/2" />
      <p class="hidden md:block mt-2 text-center text-sm text-gray-600">
        Connexion à votre compte
      </p>
    </div>

    <div class="md:mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white rounded-2xl p-6 p-6 md:border border-gray-100">
        <h2 class="text-center text-3xl font-bold text-gray-900">
          Connexion
        </h2>
        <form class="space-y-6 py-8" @submit.prevent="handleSubmit">
          <div v-if="authStore.error" class="rounded-md bg-red-50 p-4">
            <div class="text-sm text-red-800">{{ authStore.error }}</div>
          </div>
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div class="mt-1">
              <input
                id="email"
                v-model="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <div class="mt-1">
              <input
                id="password"
                v-model="password"
                name="password"
                type="password"
                autocomplete="current-password"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              :disabled="authStore.loading"
              class="w-full"
            >
              {{ authStore.loading ? 'Connexion...' : 'Se connecter' }}
            </Button>
          </div>

          <!-- <div class="mt-6">
            <div class="text-sm text-gray-600">
              <strong>Comptes de démonstration :</strong>
            </div>
            <div class="mt-2 space-y-2 text-sm">
              <div class="bg-gray-50 p-3 rounded">
                <div class="font-medium">Étudiant :</div>
                <div>eleve@test.com / password123</div>
              </div>
              <div class="bg-gray-50 p-3 rounded">
                <div class="font-medium">Administrateur :</div>
                <div>direction@test.com / adminsecure</div>
              </div>
            </div>
          </div> -->
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import Button from '../../components/UI/Button.vue'
import Card from '../../components/UI/Card.vue'

import Logo from '../../assets/logo.vue'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')

const handleSubmit = async () => {
  try {
    const user = await authStore.signIn(email.value, password.value)
    // Redirect based on user role
    // if (user?.role === 'admin') {
    //   router.push('/admin/dashboard')
    // } else {
    //   router.push('/dashboard')
    // }
    switch (user?.role) {
      case "admin":
        router.push('/admin/dashboard')
        break;
      case "student":
        router.push('/dashboard')
        break;
      case "teacher":
        router.push('/teacher/dashboard')
        break;
    }
  } catch (error) {
    console.error('Login failed:', error)
  }
}
</script>