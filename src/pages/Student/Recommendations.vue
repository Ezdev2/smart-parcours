<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900">Recommandations d'Orientation</h1>
      <Button @click="generateNewRecommendation" :disabled="loading">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
          class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
        </svg>

        {{ loading ? 'Génération...' : 'Nouvelle analyse IA' }}
      </Button>
    </div>

    <Card v-if="!latestRecommendation">
      <div class="text-center py-12">
        <svg class="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.847a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.847.813a4.5 4.5 0 0 0-3.09 3.09Z" />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">
          Aucune recommandation disponible
        </h3>
        <p class="text-gray-600 mb-4">
          Générez votre première analyse d'orientation personnalisée avec l'IA.
        </p>
        <Button @click="generateNewRecommendation" :disabled="loading">
          Générer mes recommandations
        </Button>
      </div>
    </Card>

    <template v-else>
      <!-- Analysis Overview -->
      <Card>
        <div class="flex items-center mb-4">
          <svg class="h-6 w-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.847a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.847.813a4.5 4.5 0 0 0-3.09 3.09Z" />
          </svg>
          <h2 class="text-xl font-semibold text-gray-900">Analyse de votre profil</h2>
        </div>
        <p class="text-gray-700 leading-relaxed">
          {{ latestRecommendation.analysis }}
        </p>
        <div class="mt-4 text-sm text-gray-500">
          Générée le {{ formatDate(latestRecommendation.generatedAt) }}
        </div>
      </Card>

      <!-- Recommended Fields -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div class="flex items-center mb-4">
            <svg class="h-6 w-6 text-yellow-600 mr-2" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
            </svg>
            <h3 class="text-lg font-semibold text-gray-900">Filières recommandées</h3>
          </div>
          <div class="space-y-3">
            <div v-for="(rec, index) in latestRecommendation.recommendations" :key="index"
              class="p-4 bg-blue-50 rounded-lg">
              <div class="flex items-start">
                <div class="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span class="text-sm font-semibold text-blue-600">{{ index + 1 }}</span>
                </div>
                <p class="text-sm text-gray-900">{{ rec }}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div class="flex items-center mb-4">
            <svg class="h-6 w-6 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
            </svg>
            <h3 class="text-lg font-semibold text-gray-900">Domaines suggérés</h3>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div v-for="(field, index) in latestRecommendation.suggestedFields" :key="index"
              class="p-3 bg-green-50 rounded-lg text-center">
              <span class="text-sm font-medium text-green-800">{{ field }}</span>
            </div>
          </div>
        </Card>
      </div>

      <!-- Strengths and Improvements -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div class="flex items-center mb-4">
            <svg class="h-6 w-6 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
            </svg>
            <h3 class="text-lg font-semibold text-gray-900">Vos points forts</h3>
          </div>
          <ul class="space-y-2">
            <li v-for="(strength, index) in latestRecommendation.strengths" :key="index" class="flex items-start">
              <div class="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span class="text-sm text-gray-700">{{ strength }}</span>
            </li>
          </ul>
        </Card>

        <Card>
          <div class="flex items-center mb-4">
            <svg class="h-6 w-6 text-orange-600 mr-2" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
            <h3 class="text-lg font-semibold text-gray-900">Axes d'amélioration</h3>
          </div>
          <ul class="space-y-2">
            <li v-for="(improvement, index) in latestRecommendation.improvements" :key="index" class="flex items-start">
              <div class="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span class="text-sm text-gray-700">{{ improvement }}</span>
            </li>
          </ul>
        </Card>
      </div>

      <!-- Historical Recommendations -->
      <Card v-if="recommendations.length > 1">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Historique des analyses</h3>
        <div class="space-y-3">
          <div v-for="(rec, index) in recommendations.slice(1)" :key="rec.id" class="p-4 bg-gray-50 rounded-lg">
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm font-medium text-gray-900">
                Analyse #{{ recommendations.length - index }}
              </span>
              <span class="text-sm text-gray-500">
                {{ formatDate(rec.generatedAt) }}
              </span>
            </div>
            <p class="text-sm text-gray-700 line-clamp-2">
              {{ rec.analysis }}
            </p>
          </div>
        </div>
      </Card>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { FirebaseService } from '../../services/firebaseService'
import { OrientationService } from '../../services/orientationService'
import Card from '../../components/UI/Card.vue'
import Button from '../../components/UI/Button.vue'

const authStore = useAuthStore()
const user = computed(() => authStore.user)
const recommendations = ref([])
const loading = ref(false)

const latestRecommendation = computed(() => recommendations.value[0] || null)

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fr-FR')
}

const loadRecommendations = async () => {
  if (!user.value) return
  try {
    const data = await FirebaseService.getRecommendationsByStudent(user.value.id)
    recommendations.value = data
  } catch (error) {
    console.error('Error loading recommendations:', error)
    // Mock data for demo - exact same as React version
    recommendations.value = [
      {
        id: '1',
        analysis: "L'étudiant montre de très bonnes aptitudes en sciences et mathématiques avec une moyenne générale de 15.2/20. Les résultats en physique et mathématiques sont particulièrement remarquables, indiquant une forte capacité d'analyse et de résolution de problèmes complexes.",
        recommendations: [
          "Classe préparatoire scientifique (CPGE) - Filière MPSI/PCSI",
          "École d'ingénieur avec prépa intégrée (INSA, UTC, etc.)",
          "Licence Sciences et Technologies mention Physique"
        ],
        suggestedFields: [
          "Ingénierie informatique",
          "Recherche scientifique",
          "Technologies de l'information",
          "Aérospatial"
        ],
        strengths: [
          "Excellence en mathématiques et physique",
          "Capacité d'analyse et de résolution de problèmes",
          "Intérêt marqué pour la recherche et l'innovation",
          "Rigueur scientifique"
        ],
        improvements: [
          "Développer les compétences en communication orale",
          "Renforcer les langues étrangères (notamment l'anglais technique)",
          "Élargir la culture générale scientifique",
          "Travailler les techniques de présentation"
        ],
        generatedAt: new Date('2024-01-20')
      }
    ]
  }
}

const generateNewRecommendation = async () => {
  loading.value = true
  try {
    // Get user bulletins first
    const bulletins = await FirebaseService.getBulletinsByStudent(user.value.id)
    const prompt = OrientationService.buildPromptFromProfile(user.value, bulletins)
    const result = await OrientationService.generateRecommendations(prompt)

    await FirebaseService.createRecommendation({
      studentId: user.value.id,
      ...result
    })

    await loadRecommendations()
    alert('Nouvelles recommandations IA générées avec succès !')
  } catch (error) {
    console.error('Error generating recommendations:', error)
    alert('Erreur lors de la génération des recommandations IA. Veuillez vérifier votre configuration API.')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadRecommendations()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>