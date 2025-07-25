<template>
  <div class="space-y-6">
    <TitlePage 
      :has-button="true"
      :has-icon="true"
      @on-click="gotoRecommendations" 
      btn-text="Analyser mon profil avec l'IA"
      :loading="loading"
      description="Voici un résumé de votre parcours et de vos recommandations d'orientation."
      :user="user"
    >
      <SparklesIcon class="h-6 w-6 text-white" />
    </TitlePage>

    <StatsOverview :user="user" :bulletins="bulletins" />

    <RecommendationSection
      :recommended-fields="recommendedFields"
      :strongest-subjects="strongestSubjects"
      :chart-data="chartData"
      :chart-options="chartOptions"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { FirebaseService } from '../../services/firebaseService'

import TitlePage from '../../components/UI/Title.vue'
import StatsOverview from './Dashboard/StatsOverview.vue'
import RecommendationSection from './Dashboard/RecommendationSection.vue'

import { SparklesIcon } from '@heroicons/vue/24/outline'
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { useRouter } from 'vue-router'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const router = useRouter()
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
  datasets: [{
    label: 'Progression annuelle',
    data: [14.2, 14.8, 15.1, 15.2, 15.5, 15.8],
    borderColor: 'rgb(59, 130, 246)',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    tension: 0.4,
  }]
})

const chartOptions = ref({
  responsive: true,
  plugins: {
    legend: { position: 'top' },
    title: { display: true, text: 'Progression des notes' }
  },
  scales: {
    y: { beginAtZero: false, min: 10, max: 20 }
  }
})

const loadBulletins = async () => {
  if (!user.value) return
  try {
    const data = await FirebaseService.getBulletinsByStudent(user.value.id)
    bulletins.value = data
  } catch (error) {
    console.error('Error loading bulletins:', error)
    bulletins.value = [{}]
  }
}

const gotoRecommendations = async () => {
  router.push('/recommandations')
}

onMounted(loadBulletins)
</script>