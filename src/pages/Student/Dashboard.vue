<template>
  <div class="space-y-6">
    <TitlePage 
      :has-button="true" 
      :has-icon="true"
      @on-click="generateAIAnalysis" 
      btn-text="Analyser mon profil avec l'IA" 
      :loading="loading" 
      description="Voici un résumé de votre parcours et de vos recommandations d'orientation." 
      :user="user"
    >
      <SparklesIcon class="h-6 w-6 text-white" />
    </TitlePage>

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
        <div class="">
          <Line :data="chartData" :options="chartOptions" />
        </div>
      </Card>
    </div>

    <!-- Action Buttons -->
    <div class="flex flex-wrap gap-4 actions-grid">
        <div class="action-card">
          <div class="action-header">
              <div class="action-icon" style="background: rgba(139, 69, 19, 0.1); color: #8b4513;">🤖</div>
              <div>
                  <h3 style="font-size: 1.1rem; font-weight: 600; margin-bottom: 0.25rem;">Générer une recommandation</h3>
                  <p style="color: #6b7280; font-size: 0.9rem;">Obtenez des suggestions d'orientation personnalisées basées sur vos résultats.</p>
              </div>
          </div>
          <Button @click="generateAIAnalysis" :disabled="loading">
            {{ loading ? 'Génération...' : 'Analyser mon profil avec l\'IA' }}
          </Button>
      </div>
      <div class="action-card">
          <div class="action-header">
              <div class="action-icon" style="background: rgba(59, 130, 246, 0.1); color: #3b82f6;">📝</div>
              <div>
                  <h3 style="font-size: 1.1rem; font-weight: 600; margin-bottom: 0.25rem;">Compléter mon profil</h3>
                  <p style="color: #6b7280; font-size: 0.9rem;">Ajoutez vos aspirations et centres d'intérêt pour des recommandations plus précises.</p>
              </div>
          </div>
          <Button variant="secondary">
            Mettre à jour mon profil
        </Button>
      </div>
      <div class="action-card">
          <div class="action-header">
              <div class="action-icon" style="background: rgba(16, 185, 129, 0.1); color: #10b981;">📋</div>
              <div>
                  <h3 style="font-size: 1.1rem; font-weight: 600; margin-bottom: 0.25rem;">Mettre à jour mes bulletins</h3>
                  <p style="color: #6b7280; font-size: 0.9rem;">Ajoutez vos dernières notes pour améliorer la précision des analyses.</p>
              </div>
          </div>
          <Button variant="secondary">
            Télécharger/Mettre à jour bulletin
        </Button>
      </div>
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
import TitlePage from '../../components/UI/Title.vue'

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
<style scoped>
/* Action Cards */
.actions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
}

.action-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 20px;
    padding: 1.5rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
    cursor: pointer;
    transition: all 0.3s ease;
}

.action-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.action-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
}

.action-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>