<template>
  <div class="space-y-6">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">
        Bonjour {{ user?.profile.firstName }} !
      </h1>
      <p class="text-gray-600">
        Voici un résumé de votre parcours et de vos recommandations d'orientation.
      </p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg">
            <ChartBarIcon class="h-6 w-6 text-blue-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Moyenne générale</p>
            <p class="text-2xl font-semibold text-gray-900">
              {{ user?.profile.averageGrade }}/20
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <div class="flex items-center">
          <div class="p-2 bg-green-100 rounded-lg">
            <DocumentTextIcon class="h-6 w-6 text-green-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Bulletins</p>
            <p class="text-2xl font-semibold text-gray-900">
              {{ bulletins.length }}
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <div class="flex items-center">
          <div class="p-2 bg-purple-100 rounded-lg">
            <UserIcon class="h-6 w-6 text-purple-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Classe</p>
            <p class="text-lg font-semibold text-gray-900">
              {{ user?.profile.class }}
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <div class="flex items-center">
          <div class="p-2 bg-orange-100 rounded-lg">
            <SparklesIcon class="h-6 w-6 text-orange-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Filières</p>
            <p class="text-lg font-semibold text-gray-900">
              {{ user?.profile.filieres?.length || 0 }}
            </p>
          </div>
        </div>
      </Card>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recommended Fields -->
      <Card>
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          Filières recommandées
        </h3>
        <div class="space-y-3">
          <div 
            v-for="(field, index) in recommendedFields" 
            :key="index"
            class="flex items-center p-3 bg-blue-50 rounded-lg"
          >
            <div class="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span class="text-sm font-medium text-blue-600">{{ index + 1 }}</span>
            </div>
            <span class="ml-3 text-sm text-gray-900">{{ field }}</span>
          </div>
        </div>
      </Card>

      <!-- Strongest Subjects -->
      <Card>
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          Matières les plus fortes
        </h3>
        <div class="space-y-3">
          <div 
            v-for="(subject, index) in strongestSubjects" 
            :key="index"
            class="flex justify-between items-center p-3 bg-green-50 rounded-lg"
          >
            <span class="text-sm text-gray-900">{{ subject.subject }}</span>
            <span class="text-sm font-semibold text-green-600">
              {{ subject.grade }}/20
            </span>
          </div>
        </div>
      </Card>

      <!-- Progress Chart -->
      <Card class="lg:col-span-2">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          Progression annuelle
        </h3>
        <div class="h-64">
          <Line :data="chartData" :options="chartOptions" />
        </div>
      </Card>
    </div>

    <!-- Action Buttons -->
    <div class="flex flex-wrap gap-4">
      <Button @click="generateAIAnalysis" :disabled="loading">
        {{ loading ? 'Génération...' : 'Analyser mon profil avec l\'IA' }}
      </Button>
      <Button variant="outline">
        Mettre à jour mon profil
      </Button>
      <Button variant="outline">
        Télécharger/Mettre à jour bulletin
      </Button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { FirebaseService } from '../../services/firebaseService'
import { OrientationService } from '../../services/orientationService'
import Card from '../../components/UI/Card.vue'
import Button from '../../components/UI/Button.vue'
import { ChartBarIcon, UserIcon, DocumentTextIcon, SparklesIcon } from '@heroicons/vue/24/outline'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const authStore = useAuthStore()
const user = computed(() => authStore.user)

const bulletins = ref([])
const loading = ref(false)

const recommendedFields = ref([
  'Ingénierie informatique',
  'Sciences physiques',
  'Mathématiques appliquées'
])

const strongestSubjects = ref([
  { subject: 'Mathématiques', grade: 16.5 },
  { subject: 'Physique', grade: 17.0 },
  { subject: 'Informatique', grade: 16.8 }
])

const chartData = ref({
  labels: ['Sep', 'Oct', 'Nov', 'Déc', 'Jan', 'Fév'],
  datasets: [
    {
      label: 'Progression annuelle',
      data: [14.2, 14.8, 15.1, 15.2, 15.5, 15.8],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
    },
  ],
})

const chartOptions = ref({
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Progression des notes',
    },
  },
  scales: {
    y: {
      beginAtZero: false,
      min: 10,
      max: 20,
    },
  },
})

const loadBulletins = async () => {
  if (!user.value) return
  try {
    const data = await FirebaseService.getBulletinsByStudent(user.value.id)
    bulletins.value = data
  } catch (error) {
    console.error('Error loading bulletins:', error)
    // Use mock data for demo
    bulletins.value = [
      {
        id: '1',
        period: 'Trimestre 1',
        year: '2024',
        averageGrade: 15.2,
        subjects: [
          { subject: 'Mathématiques', grade: 16.5 },
          { subject: 'Physique', grade: 17.0 },
          { subject: 'Français', grade: 13.5 }
        ]
      }
    ]
  }
}

const generateAIAnalysis = async () => {
  loading.value = true
  try {
    const prompt = OrientationService.buildPromptFromProfile(user.value, bulletins.value)
    const recommendations = await OrientationService.generateRecommendations(prompt)
    
    // Save recommendations to Firestore
    await FirebaseService.createRecommendation({
      studentId: user.value.id,
      ...recommendations
    })
    
    alert('Analyse IA générée avec succès ! Consultez vos recommandations.')
  } catch (error) {
    console.error('Error generating AI analysis:', error)
    alert('Erreur lors de la génération de l\'analyse IA. Veuillez réessayer.')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadBulletins()
})
</script>