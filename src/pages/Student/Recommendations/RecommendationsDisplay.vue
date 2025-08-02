<template>
  <div class="space-y-6">
    <Card>
      <div class="flex items-center justify-between gap-6 mb-4">
        <div>
          <div class="flex items-center">
            <component :is="SparklesIcon" class="h-6 w-6 text-blue-600 mr-2" />
            <h2 class="text-xl font-semibold text-gray-900">
              Analyse de votre profil
            </h2>
          </div>
          <p class="text-gray-700 leading-relaxed">{{ recommendation.content }}</p>
          <div class="mt-4 text-sm text-gray-500">
            Générée le {{ formatDate(recommendation.generatedAt) }}
            <!-- <span v-if="recommendation.status === 'reviewed'" class="ml-2 text-green-600 font-medium">
              (Révisée par l'administration le {{ formatDate(recommendation.reviewedAt) }})
            </span>
            <span v-else class="ml-2 text-orange-600 font-medium"> (En attente de révision) </span> -->
          </div>
        </div>
        <div v-if="recommendation.academicProfile?.title"
          class="flex flex-col items-center px-3 py-1 rounded bg-gray-200 transform hover:scale-105 transition-transform duration-200 text-sm whitespace-nowrap">
          <component 
            :is="getAcademicProfileIcon(recommendation.academicProfile?.title)"
            class="h-12 w-12 mr-1 text-purple-500"
          />
          <span class="font-semibold tracking-wide bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
            {{ recommendation.academicProfile.title }}
          </span>
        </div>
      </div>
    </Card>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <div class="flex items-center mb-4">
          <CheckCircleIcon class="h-6 w-6 text-green-600 mr-2" />
          <h3 class="text-lg font-semibold text-gray-900">Vos points forts</h3>
        </div>
        <ul class="space-y-2">
          <li v-for="(strength, index) in recommendation.strengths" :key="index" class="flex items-start">
            <div class="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
            <span class="text-sm text-gray-700">{{ strength }}</span>
          </li>
        </ul>
      </Card>

      <Card>
        <div class="flex items-center mb-4">
          <ExclamationTriangleIcon class="h-6 w-6 text-orange-600 mr-2" />
          <h3 class="text-lg font-semibold text-gray-900">Axes d'amélioration</h3>
        </div>
        <ul class="space-y-2">
          <li v-for="(improvement, index) in recommendation.improvementAreas" :key="index" class="flex items-start">
            <div class="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
            <span class="text-sm text-gray-700">{{ improvement }}</span>
          </li>
        </ul>
      </Card>
    </div>

    <div v-if="recommendation.suggestedPaths && recommendation.suggestedPaths.length > 0" class="flex justify-end mb-4">
      <div class="flex items-center gap-2 p-1 rounded-lg bg-gray-100 border border-gray-200">
        <button @click="suggestedPathsViewMode = 'list'"
          :class="suggestedPathsViewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-200'"
          class="p-2 rounded-md transition-colors duration-200">
          <Bars3Icon class="w-5 h-5" />
        </button>
        <button @click="suggestedPathsViewMode = 'chart'"
          :class="suggestedPathsViewMode === 'chart' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-200'"
          class="p-2 rounded-md transition-colors duration-200">
          <ChartBarIcon class="w-5 h-5" />
        </button>
      </div>
    </div>

    <div v-if="recommendation.suggestedPaths && recommendation.suggestedPaths.length > 0" class="flex flex-col gap-4">
      <div v-for="group in recommendation.suggestedPaths" :key="group.groupType">
        <Card>
          <div class="flex items-center mb-4">
            <component :is="getGroupIcon(group.groupType)" class="h-6 w-6 text-indigo-600 mr-2" />
            <h3 class="text-xl font-semibold text-gray-900">{{ group.groupTitle }}</h3>
          </div>

          <div v-if="suggestedPathsViewMode === 'list'">
            <ul class="space-y-3">
              <template v-if="group.suggestions && group.suggestions.length > 0">
                <li v-for="(suggestion, index) in group.suggestions" :key="index" class="p-3 bg-gray-50 rounded-lg">
                  <p class="text-sm font-medium text-gray-900">{{ suggestion.name }}</p>
                  <p class="text-xs text-gray-600 mt-1 italic">{{ suggestion.rationale }}</p>
                  <div class="flex items-center mt-2">
                    <span class="text-sm font-semibold text-blue-600 mr-2">Compatibilité:</span>
                    <div class="w-full bg-gray-200 rounded-full h-2.5">
                      <div class="bg-blue-400 h-2.5 rounded-full" :style="{ width: suggestion.compatibility + '%' }">
                      </div>
                    </div>
                    <span class="ml-2 text-sm font-semibold text-blue-700">{{ suggestion.compatibility }}%</span>
                  </div>
                </li>
              </template>
              <li v-else class="text-center text-gray-500 py-4">Aucune suggestion pour ce groupe.</li>
            </ul>
          </div>

          <div v-else-if="suggestedPathsViewMode === 'chart'">
            <div v-if="group.suggestions && group.suggestions.length > 0">
              <div class="chart-container" style="height: 500px; position: relative;">
                <Bar v-if="isValidChartData(getChartData(group.suggestions, group.groupTitle))"
                  :data="getChartData(group.suggestions, group.groupTitle)" :options="chartOptions" />
                <div v-else class="flex items-center justify-center h-full text-gray-500">
                  Impossible d'afficher le graphique (données non valides).
                </div>
              </div>
            </div>
            <div v-else class="flex items-center justify-center h-full text-gray-500">
              Pas assez de données pour afficher le graphique.
            </div>
          </div>
        </Card>
      </div>
    </div>
    <div v-else class="text-center text-gray-500 py-6">
      Aucun parcours suggéré disponible pour cette recommandation.
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Card from '@/components/UI/Card.vue';
import {
  SparklesIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  AcademicCapIcon, // Scientific, Literary, Linguistic, Economic and Social, etc.
  CubeTransparentIcon, // Technical, Logical, Creative
  BriefcaseIcon, // Career, Economic and Social, Sports
  Bars3Icon, // For list view toggle
  ChartBarIcon, // For chart view toggle
  BookOpenIcon, // Literary
  PaintBrushIcon, // Artistic
  CogIcon, // Technical (alternative)
  TrophyIcon, // Sports
  LanguageIcon, // Linguistic
  CommandLineIcon, // Informatics
  CalculatorIcon, // Logical (alternative)
  LightBulbIcon // Creative (alternative)
} from '@heroicons/vue/24/outline';

import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const props = defineProps({
  recommendation: {
    type: Object,
    required: true
  },
  formatDate: {
    type: Function,
    required: true
  },
  isLatest: {
    type: Boolean,
    default: true
  }
});

const suggestedPathsViewMode = ref('list');

const getAcademicProfileIcon = (code) => {
  switch (code) {
    case 'Scientifique': return AcademicCapIcon;
    case 'Littéraire': return BookOpenIcon;
    case 'Artistique': return PaintBrushIcon;
    case 'Technique': return CogIcon;
    case 'Économique et Social': return BriefcaseIcon;
    case 'Linguistique': return TrophyIcon;
    case 'linguistic': return LanguageIcon;
    case 'Informatique': return CommandLineIcon;
    case 'Logique': return CalculatorIcon;
    case 'Créatif': return LightBulbIcon;
    default: return SparklesIcon;
  }
};


const getGroupIcon = (groupType) => {
  switch (groupType) {
    case 'filiere_recommandee': return AcademicCapIcon;
    case 'domaine_suggere': return CubeTransparentIcon;
    case 'metier_potentiel': return BriefcaseIcon;
    default: return SparklesIcon;
  }
};

const getChartData = (suggestions, title) => {
  const safeSuggestions = Array.isArray(suggestions) ? suggestions : [];

  if (safeSuggestions.length === 0) {
    return null;
  }

  const labels = safeSuggestions.map(s => s.name || 'Sans nom');
  const data = safeSuggestions.map(s => {
    const compatibility = Number(s.compatibility);
    return isNaN(compatibility) ? 0 : compatibility;
  });

  const backgroundColors = data.map(val => {
    if (val >= 80) return 'rgba(34, 197, 94, 0.8)';
    if (val >= 60) return 'rgba(251, 146, 60, 0.8)';
    return 'rgba(239, 68, 68, 0.8)';
  });

  const borderColors = data.map(val => {
    if (val >= 80) return 'rgba(34, 197, 94, 1)';
    if (val >= 60) return 'rgba(251, 146, 60, 1)';
    return 'rgba(239, 68, 68, 1)';
  });

  return {
    labels: labels,
    datasets: [{
      label: `Compatibilité (${title || 'Sans titre'})`,
      data: data,
      backgroundColor: backgroundColors,
      borderColor: borderColors,
      borderWidth: 1
    }]
  };
};

const isValidChartData = (chartData) => {
  if (!chartData) return false;

  return (
    chartData.labels &&
    Array.isArray(chartData.labels) &&
    chartData.labels.length > 0 &&
    chartData.datasets &&
    Array.isArray(chartData.datasets) &&
    chartData.datasets.length > 0 &&
    chartData.datasets[0].data &&
    Array.isArray(chartData.datasets[0].data) &&
    chartData.datasets[0].data.length > 0
  );
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y', // Horizontal bar chart
  plugins: {
    legend: {
      display: false
    },
    title: {
      display: true,
      text: 'Compatibilité par suggestion',
      font: {
        size: 14,
        weight: 'bold'
      },
      padding: {
        bottom: 20
      }
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          return `${context.label}: ${context.parsed.x}%`;
        }
      }
    }
  },
  scales: {
    x: {
      beginAtZero: true,
      max: 100,
      title: {
        display: true,
        text: 'Pourcentage de compatibilité',
        font: {
          size: 12
        }
      },
      ticks: {
        callback: function (value) {
          return value + '%';
        }
      },
      grid: {
        display: true,
        color: 'rgba(0, 0, 0, 0.1)'
      }
    },
    y: {
      title: {
        display: true,
        text: 'Suggestions',
        font: {
          size: 14
        }
      },
      ticks: {
        font: {
          size: 11
        }
      },
      grid: {
        display: false
      }
    }
  },
  elements: {
    bar: {
      borderRadius: 8
    }
  }
};
</script>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
}

.chart-container canvas {
  max-width: 100%;
  height: auto !important;
}
</style>