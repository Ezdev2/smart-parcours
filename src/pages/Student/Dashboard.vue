<template>
  <div class="space-y-6">
    <TitlePage 
      :has-button="true"
      :has-icon="true"
      @on-click="gotoRecommendations" 
      title="Tableau de bord - Etudiant"
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
      <Card>
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-xl font-semibold text-gray-900 mb-2">Bienvenue, {{ user?.profile?.firstName }} {{
              user?.profile?.lastName }} !</h2>
            <p class="text-gray-600 mb-4">Voici un résumé de votre école</p>
            <div class="text-sm text-gray-700 space-y-1">
              <div class="flex gap-2">
                <p><strong>Classe actuelle :</strong></p>
                <p>
                    {{ className }}
                </p>
              </div>

              <p v-if="schoolName"><strong>École :</strong> {{ schoolName }}</p>
              <p v-if="principalName"><strong>Directeur(trice) :</strong> {{ principalName }}</p>
            </div>
          </div>
          <img width="150" :src="schoolLogo" alt="logo">
        </div>
      </Card>

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
import Card from '../../components/UI/Card.vue'

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

const schoolName = ref('');
const schoolLogo = ref('');
const principalName = ref('');
const className = ref('')

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

    // Get Class name and level
    if (user.value.profile?.class) {
      const classById = await FirebaseService.getClassById(user.value.profile?.class)
      className.value = classById.name + " (" + classById.level + ")";
    }

    // Fetch School and Principal Information
    if (user.value.profile?.school) {
      const adminSettings = await FirebaseService.getOrCreateSettingsForAdmin(user.value.profile.school);
      if (adminSettings) {
        schoolName.value = adminSettings.name || 'Nom de l\'Établissement';
        schoolLogo.value = adminSettings.logoUrl || 'Logo de l\'établissement';
        const principalUser = await FirebaseService.getUserById(adminSettings.admin);
        if (principalUser) {
          principalName.value = `${principalUser.profile?.firstName || ''} ${principalUser.profile?.lastName || ''}`;
        } else {
          principalName.value = 'Non renseigné';
        }
      } else {
        schoolName.value = 'Nom de l\'Établissement';
        principalName.value = 'Non renseigné';
      }
    } else {
      schoolName.value = 'Non renseigné';
      principalName.value = 'Non renseigné';
    }

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