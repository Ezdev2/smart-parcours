<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900">Tableau de bord - Administration</h1>
      <Button @click="gotoUrl('/admin/users')">
        <PlusIcon class="h-4 w-4 mr-2" /> Ajouter un étudiant
      </Button>
    </div>

    <LoadingSpinner v-if="loading" text="Chargement du tableau de bord..." color="indigo" class="my-8" />

    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-md p-4">
      <div class="text-red-800">{{ error }}</div>
    </div>

    <div class="flex flex-col gap-6" v-else>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div class="flex items-center">
            <div class="p-2 bg-blue-100 rounded-lg">
              <UsersIcon class="h-6 w-6 text-blue-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Étudiants</p>
              <p class="text-2xl font-semibold text-gray-900">{{ dashboardStats.totalStudents }}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div class="flex items-center">
            <div class="p-2 bg-green-100 rounded-lg">
              <ChartBarIcon class="h-6 w-6 text-green-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Moyenne Générale</p>
              <p class="text-2xl font-semibold text-gray-900">{{ dashboardStats.globalAverage !== 0 ? dashboardStats.globalAverage + '/20' : 'N/A' }}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div class="flex items-center">
            <div class="p-2 bg-purple-100 rounded-lg">
              <DocumentTextIcon class="h-6 w-6 text-purple-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total bulletins</p>
              <p class="text-2xl font-semibold text-gray-900">{{ dashboardStats.totalBulletins }}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div class="flex items-center">
            <div class="p-2 bg-orange-100 rounded-lg">
              <AcademicCapIcon class="h-6 w-6 text-orange-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Classes</p>
              <p class="text-2xl font-semibold text-gray-900">{{ Object.keys(dashboardStats.classDistribution).length }}</p>
            </div>
          </div>
        </Card>
        
        <Card>
          <div class="flex items-center">
            <div class="p-2 bg-pink-100 rounded-lg">
              <BriefcaseIcon class="h-6 w-6 text-pink-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Enseignants</p>
              <p class="text-2xl font-semibold text-gray-900">{{ dashboardStats.totalTeachers }}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div class="flex items-center">
            <div class="p-2 bg-teal-100 rounded-lg">
              <SparklesIcon class="h-6 w-6 text-teal-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Recommandations</p>
              <p class="text-2xl font-semibold text-gray-900">{{ dashboardStats.totalRecommendations }}</p>
            </div>
          </div>
        </Card>
        </div>

      <Card>
        <h3 class="text-lg font-medium text-gray-900 mb-4">Actions rapides</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button variant="outline" @click="gotoUrl('/admin/users')" class="h-20 flex-col">
            <UsersIcon />
            Gérer les étudiants
          </Button>
          <Button variant="outline" @click="gotoUrl('/admin/settings')" class="h-20 flex-col">
            <BriefcaseIcon />
            Gérer les enseignants
          </Button>
          <Button variant="outline" @click="gotoUrl('/admin/settings')" class="h-20 flex-col">
            <CogIcon />
            Paramètres de l'école
          </Button>
          <Button variant="outline" class="h-20 flex-col">
            <DocumentArrowDownIcon />
            Exporter les données
          </Button>
        </div>
      </Card>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card class="col-span-2">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            Moyennes par niveau
          </h3>
          <div class="chart-container" style="height: 300px; position: relative;">
            <Bar
              v-if="isValidAverageChartData"
              :data="averageChartData"
              :options="averageChartOptions"
            />
            <div v-else class="flex items-center justify-center h-full text-gray-500">
                Pas assez de données pour les moyennes par niveau.
            </div>
          </div>
        </Card>

        <Card class="col-span-1">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            Distribution par classe
          </h3>
          <div class="space-y-3">
            <template v-if="dashboardStats.totalStudents > 0">
              <div 
                v-for="[className, count] in Object.entries(dashboardStats.classDistribution)" 
                :key="className" 
                class="flex justify-between items-center"
              >
                <span class="text-sm text-gray-700">{{ className }}</span>
                <div class="flex items-center">
                  <div class="w-32 bg-gray-200 rounded-full h-2 mr-3">
                    <div 
                      class="bg-blue-600 h-2 rounded-full" 
                      :style="{width: `${(count / dashboardStats.totalStudents) * 100}%`}"
                    ></div>
                  </div>
                  <span class="text-sm font-medium text-gray-900">{{ count }}</span>
                </div>
              </div>
            </template>
            <div v-else class="text-center text-gray-500 py-4">
                Aucune donnée de distribution par classe.
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <h3 class="text-lg font-medium text-gray-900 mb-4">Activité récente</h3>
        <div class="space-y-3">
          <template v-if="recentActivities.length > 0">
              <div v-for="activity in recentActivities" :key="activity.id" class="flex items-center p-3 bg-gray-50 rounded-lg">
                <div class="flex-shrink-0 w-2 h-2 rounded-full mr-3" :class="getActivityDotColor(activity.type)"></div>
                <span class="text-sm text-gray-700">{{ activity.message }}</span>
                <span class="ml-auto text-sm text-gray-500">{{ formatRelativeTime(activity.timestamp) }}</span>
              </div>
          </template>
          <div v-else class="text-center text-gray-500 py-4">
              Aucune activité récente.
          </div>
        </div>
      </Card>
    </div>
    <ConfirmDialog />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue'
import { FirebaseService } from '../../services/firebaseService'
import Card from '../../components/UI/Card.vue'
import Button from '../../components/UI/Button.vue'
import LoadingSpinner from '../../components/UI/LoadingSpinner.vue'
import ConfirmDialog from '../../components/UI/ConfirmDialog.vue'
import { useGotoUrl } from '../../composables/useGotoUrl'
import { useAuthStore } from '../../stores/auth' // Import auth store

// Chart.js imports
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Heroicons
import { UsersIcon, ChartBarIcon, DocumentTextIcon, AcademicCapIcon, PlusIcon, BriefcaseIcon, SparklesIcon, LightBulbIcon, DocumentArrowDownIcon, CogIcon } from '@heroicons/vue/24/outline';


const { gotoUrl } = useGotoUrl()
const authStore = useAuthStore()
const user = computed(() => authStore.user)

const dashboardStats = ref(null)
const loading = ref(true)
const error = ref(null)
const recentActivities = ref([])

// Chart Data for "Moyennes par niveau"
const averageChartData = computed(() => {
  if (!dashboardStats.value || !dashboardStats.value.averagesByLevel) {
    return { labels: [], datasets: [] };
  }

  // Define a consistent order for levels
  const levelOrder = ["6ème", "5ème", "4ème", "3ème", "Seconde", "Première", "Terminale"];
  const labels = levelOrder.filter(level => dashboardStats.value.averagesByLevel[level] !== undefined);
  const data = labels.map(level => dashboardStats.value.averagesByLevel[level]);

  // If no data points, return an empty but valid structure
  if (labels.length === 0) {
      return { labels: [], datasets: [] };
  }

  return {
    labels: labels,
    datasets: [
      {
        label: 'Moyenne par niveau',
        data: data,
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };
});

const isValidAverageChartData = computed(() => {
  return averageChartData.value &&
         Array.isArray(averageChartData.value.labels) &&
         averageChartData.value.labels.length >= 1 &&
         averageChartData.value.datasets &&
         averageChartData.value.datasets.length >= 1;
});

const averageChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Moyennes par niveau de classe',
    },
  },
  scales: {
    y: {
      beginAtZero: false,
      min: 0,
      max: 20,
    },
  },
};

// --- Data Loading ---
const loadDashboardData = async () => {
  if (!user.value || !user.value.id) {
    error.value = 'ID administrateur non disponible.';
    loading.value = false;
    return;
  }
  loading.value = true;
  error.value = null;
  try {
    const data = await FirebaseService.getAdminDashboard(user.value.id);
    dashboardStats.value = data;

    // --- Mock recent activities ---
    recentActivities.value = [
      { id: 'act1', type: 'bulletin_uploaded', message: 'Marie Dubois a mis à jour un bulletin', timestamp: new Date(Date.now() - 2 * 3600 * 1000) },
      { id: 'act2', type: 'recommendation_generated', message: 'Pierre Martin a généré une analyse IA', timestamp: new Date(Date.now() - 4 * 3600 * 1000) },
      { id: 'act3', type: 'student_created', message: 'Nouveau compte étudiant créé : Sophie Bernard', timestamp: new Date(Date.now() - 24 * 3600 * 1000) },
      { id: 'act4', type: 'teacher_created', message: 'Nouvel enseignant ajouté : M. Jean', timestamp: new Date(Date.now() - 48 * 3600 * 1000) },
    ];
    // --- End mock ---

  } catch (err) {
    console.error('Error loading admin dashboard data:', err);
    error.value = 'Erreur lors du chargement du tableau de bord: ' + err.message;
    dashboardStats.value = null;
  } finally {
    loading.value = false;
  }
};

// --- Utility Functions ---
const formatRelativeTime = (timestamp) => {
  if (!timestamp) return 'N/A';
  // Ensure timestamp is a Date object
  const date = timestamp instanceof Date ? timestamp : (timestamp.toDate ? timestamp.toDate() : new Date(timestamp));
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.round(diffMs / (1000 * 60));
  const diffHours = Math.round(diffMinutes / 60);
  const diffDays = Math.round(diffHours / 24);

  if (diffMinutes < 1) return "À l'instant";
  if (diffMinutes < 60) return `Il y a ${diffMinutes} min`;
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  if (diffDays < 7) return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
  return date.toLocaleDateString('fr-FR');
};

const getActivityDotColor = (type) => {
  switch(type) {
    case 'student_created': return 'bg-purple-400';
    case 'bulletin_uploaded': return 'bg-green-400';
    case 'recommendation_generated': return 'bg-blue-400';
    case 'teacher_created': return 'bg-orange-400';
    default: return 'bg-gray-400';
  }
};

onMounted(() => {
  loadDashboardData();
  
});
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 300px;
  width: 100%;
}
</style>