<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900">Mon Profil</h1>
      <Button @click="editing = !editing">
        {{ editing ? 'Annuler' : 'Modifier' }}
      </Button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Personal Information -->
      <Card>
        <h2 class="text-lg font-medium text-gray-900 mb-4">
          Informations personnelles
        </h2>

        <form v-if="editing" @submit="handleSubmit" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">
                Prénom
              </label>
              <input
                type="text"
                v-model="formData.firstName"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">
                Nom
              </label>
              <input
                type="text"
                v-model="formData.lastName"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              Date de naissance
            </label>
            <input
              type="date"
              v-model="formData.dateOfBirth"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              Classe
            </label>
            <input
              type="text"
              v-model="formData.class"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <Button type="submit">Sauvegarder</Button>
        </form>

        <div v-else class="space-y-4">
          <div>
            <span class="text-sm font-medium text-gray-500">
              Nom complet
            </span>
            <p class="text-gray-900">
              {{ user?.profile.firstName }} {{ user?.profile.lastName }}
            </p>
          </div>
          <div>
            <span class="text-sm font-medium text-gray-500">Email</span>
            <p class="text-gray-900">{{ user?.email }}</p>
          </div>
          <div>
            <span class="text-sm font-medium text-gray-500">
              Date de naissance
            </span>
            <p class="text-gray-900">
              {{ formatDate(user?.profile.dateOfBirth) }}
            </p>
          </div>
          <div>
            <span class="text-sm font-medium text-gray-500">
              Classe
            </span>
            <p class="text-gray-900">{{ user?.profile.class }}</p>
          </div>
        </div>
      </Card>

      <!-- Academic Information -->
      <Card>
        <h2 class="text-lg font-medium text-gray-900 mb-4">
          Informations académiques
        </h2>

        <div class="space-y-4">
          <div>
            <span class="text-sm font-medium text-gray-500">
              Moyenne générale
            </span>
            <p class="text-2xl font-bold text-blue-600">
              {{ user?.profile.averageGrade }}/20
            </p>
          </div>

          <div>
            <span class="text-sm font-medium text-gray-500">Niveau</span>
            <p class="text-gray-900">{{ user?.profile.level }}</p>
          </div>
        </div>
      </Card>

      <!-- Filières d'intérêt -->
      <Card>
        <h2 class="text-lg font-medium text-gray-900 mb-4">
          Filières d'intérêt
        </h2>

        <div v-if="editing" class="space-y-3">
          <label 
            v-for="filiere in availableFilieres" 
            :key="filiere" 
            class="flex items-center"
          >
            <input
              type="checkbox"
              :checked="formData.filieres.includes(filiere)"
              @change="toggleFiliere(filiere)"
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span class="ml-2 text-sm text-gray-900">{{ filiere }}</span>
          </label>
        </div>

        <div v-else class="flex flex-wrap gap-2">
          <span
            v-for="filiere in user?.profile.filieres"
            :key="filiere"
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
          >
            {{ filiere }}
          </span>
        </div>
      </Card>

      <!-- Centres d'intérêt -->
      <Card>
        <h2 class="text-lg font-medium text-gray-900 mb-4">
          Centres d'intérêt
        </h2>

        <div v-if="editing" class="grid grid-cols-2 gap-3">
          <label 
            v-for="interest in availableInterests" 
            :key="interest" 
            class="flex items-center"
          >
            <input
              type="checkbox"
              :checked="formData.interests.includes(interest)"
              @change="toggleInterest(interest)"
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span class="ml-2 text-sm text-gray-900">{{ interest }}</span>
          </label>
        </div>

        <div v-else class="flex flex-wrap gap-2">
          <span
            v-for="interest in user?.profile.interests"
            :key="interest"
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
          >
            {{ interest }}
          </span>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { useAuthStore } from '../../stores/auth'
import Card from '../../components/UI/Card.vue'
import Button from '../../components/UI/Button.vue'

const authStore = useAuthStore()
const user = computed(() => authStore.user)

const editing = ref(false)

const availableFilieres = [
  "Sciences",
  "Littéraire",
  "Économique et Social",
  "Technologique",
  "Arts",
  "Sport",
]

const availableInterests = [
  "Mathématiques",
  "Physique",
  "Chimie",
  "Biologie",
  "Informatique",
  "Histoire",
  "Géographie",
  "Littérature",
  "Langues",
  "Arts",
  "Sport",
  "Musique",
]

const formData = reactive({
  firstName: user.value?.profile.firstName || "",
  lastName: user.value?.profile.lastName || "",
  dateOfBirth: user.value?.profile.dateOfBirth || "",
  class: user.value?.profile.class || "",
  filieres: user.value?.profile.filieres || [],
  interests: user.value?.profile.interests || [],
})

const handleSubmit = (e) => {
  e.preventDefault()
  // Here you would update the user profile in Firestore
  editing.value = false
  alert("Profil mis à jour avec succès !")
}

const toggleFiliere = (filiere) => {
  if (formData.filieres.includes(filiere)) {
    formData.filieres = formData.filieres.filter(f => f !== filiere)
  } else {
    formData.filieres = [...formData.filieres, filiere]
  }
}

const toggleInterest = (interest) => {
  if (formData.interests.includes(interest)) {
    formData.interests = formData.interests.filter(i => i !== interest)
  } else {
    formData.interests = [...formData.interests, interest]
  }
}

const formatDate = (timestamp) => {
  if (!timestamp?.seconds) return "Non renseignée"
  const date = new Date(timestamp.seconds * 1000)
  return date.toLocaleDateString("fr-FR")
}
</script>