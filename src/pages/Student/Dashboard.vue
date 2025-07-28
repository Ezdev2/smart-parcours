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

    <LoadingSpinner v-if="loading" text="Chargement de votre tableau de bord..." color="indigo" class="my-8" />

    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-md p-4">
      <div class="text-red-800">{{ error }}</div>
    </div>

    <div v-else class="flex flex-col gap-6">
      <StatsOverview 
        :user="user" 
        :bulletins="bulletins" 
        :dashboard-stats="dashboardStats"
        :latest-recommendation="latestRecommendation"
      />

      <RecommendationSection
        :latest-recommendation="latestRecommendation"
        :chart-data="chartData"
        :chart-options="chartOptions"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { FirebaseService } from '../../services/firebaseService'

import TitlePage from '../../components/UI/Title.vue'
import LoadingSpinner from '../../components/UI/LoadingSpinner.vue'

import StatsOverview from './Dashboard/StatsOverview.vue'
import RecommendationSection from './Dashboard/RecommendationSection.vue'

import { SparklesIcon } from '@heroicons/vue/24/outline'
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js'
import { useRouter } from 'vue-router'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const router = useRouter()
const authStore = useAuthStore()
const user = computed(() => authStore.user)
const loading = ref(true)
const error = ref(null)
const dashboardStats = ref({})

const bulletins = ref([])
const latestRecommendation = ref(null)

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

const chartData = computed(() => {
  if (!bulletins.value || bulletins.value.length === 0) {
    return { labels: [], datasets: [] };
  }

  const sortedBulletins = [...bulletins.value].sort((a, b) => a.updatedAt.getTime() - b.updatedAt.getTime());

  const labels = sortedBulletins.map(b => `${b.semester.substring(0, 3)}. ${b.year}`);
  const data = sortedBulletins.map(b => b.generalAverage || 0);

  return {
    labels: labels,
    datasets: [{
      label: 'Progression annuelle',
      data: data,
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
      fill: true
    }]
  };
});

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { position: 'top' },
    title: { display: true, text: 'Progression des notes' }
  },
  scales: {
    y: { beginAtZero: false, min: 0, max: 20 }
  }
};

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

const loadDashboardData = async () => {
  if (!user.value || !user.value.id) {
    error.value = 'Utilisateur non connecté ou ID non disponible.';
    loading.value = false;
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    const [fetchedBulletins, fetchedRecommendations, currentUserData] = await Promise.all([
      FirebaseService.getBulletinsByStudent(user.value.id),
      FirebaseService.getRecommendationsByStudent(user.value.id),
      FirebaseService.getUserById(user.value.id)
    ]);

    bulletins.value = fetchedBulletins;
    latestRecommendation.value = fetchedRecommendations[0] || null; // Get the most recent one
    
    // Update user store with fresh data, especially for overallAverage
    if (currentUserData) {
      authStore.user = {
        ...authStore.user,
        ...currentUserData
      };
    }

    // Prepare stats for StatsOverview
    const totalBulletinsCount = fetchedBulletins.length;
    const overallAvg = user.value.profile?.averageGrade || 'N/A';

    dashboardStats.value = {
      totalBulletins: totalBulletinsCount,
      overallAverage: overallAvg
    };
  } catch (err) {
    console.error('Error loading student dashboard data:', err);
    error.value = 'Erreur lors du chargement de votre tableau de bord: ' + err.message;
    bulletins.value = [];
    latestRecommendation.value = null;
    dashboardStats.value = {};
  } finally {
    loading.value = false;
  }
};

const gotoRecommendations = async () => {
  router.push('/recommandations')
}

onMounted(() => {
  loadBulletins();
  loadDashboardData();
});
</script>