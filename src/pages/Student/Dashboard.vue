<template>
  <div class="space-y-6">
    <TitlePage :has-button="true" :has-icon="true" @on-click="gotoRecommendations" title="Tableau de bord - Etudiant"
      btn-text="Analyser mon profil avec l'IA" :loading="loading"
      description="Voici un résumé de votre parcours et de vos recommandations d'orientation." :user="user">
      <SparklesIcon class="h-6 w-6 text-white" />
    </TitlePage>

    <LoadingSpinner v-if="loading" text="Chargement de votre tableau de bord..." color="indigo" class="my-8" />

    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-md p-4">
      <div class="text-red-800">{{ error }}</div>
    </div>

    <div v-else class="flex flex-col gap-6">
      <!-- <div
        class="w-full p-12 rounded-2xl shadow-lg bg-gradient-to-r from-indigo-900 to-indigo-500 relative overflow-hidden">
        <div class="flex flex-col md:flex-row justify-between items-center gap-6 relative">
          <div class="flex-1 text-center md:text-left">
            <h2 class="text-3xl font-bold text-white mb-4">Bienvenue, {{ user?.profile?.firstName }} {{
              user?.profile?.lastName }} !</h2>
            <div class="text-base text-gray-200 flex gap-4">
              <div
                class="flex flex-col gap-1 sm:gap-2 justify-center md:justify-start py-2 px-4 rounded-2xl bg-white/15">
                <p class="font-semibold">Classe actuelle</p>
                <p>{{ className }}</p>
              </div>
              <div v-if="schoolName"
                class="flex flex-col gap-1 sm:gap-2 justify-center md:justify-start py-2 px-4 rounded-2xl bg-white/15">
                <span class="font-semibold">École</span>
                <span>{{ schoolName }}</span>
              </div>
              <div v-if="principalName"
                class="flex flex-col gap-1 sm:gap-2 justify-center md:justify-start py-2 px-4 rounded-2xl bg-white/15">
                <span class="font-semibold">Directeur(trice)</span>
                <span>{{ principalName }}</span>
              </div>
            </div>

            <router-link to="/profil"
              class="mt-6 bg-white hover:bg-indigo-600 text-indigo-900 font-semibold px-6 py-3 rounded-full inline-flex items-center gap-2 transition duration-300">
              Voir les détails
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                  clip-rule="evenodd" />
              </svg>
            </router-link>
          </div>
          <div class="mt-6 md:mt-0">
            <img width="180" height="180" class="rounded-lg shadow-md" :src="schoolLogo" alt="School Logo" />
          </div>
        </div>
      </div> -->

      <UserWelcomeBanner
        :user="user"
        :className="className"
        :schoolName="schoolName"
        :principalName="principalName"
        :schoolLogo="schoolLogo"
        btn-link="/profil"
      />

      <StatsOverview :user="user" :bulletins="bulletins" :dashboard-stats="dashboardStats"
        :latest-recommendation="latestRecommendation" />

      <RecommendationSection :latest-recommendation="latestRecommendation" :chart-data="chartData"
        :chart-options="chartOptions" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { FirebaseService } from '../../services/firebaseService'

import TitlePage from '../../components/UI/Title.vue'
import LoadingSpinner from '../../components/UI/LoadingSpinner.vue'
import UserWelcomeBanner from '../../components/UI/Banner.vue'

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