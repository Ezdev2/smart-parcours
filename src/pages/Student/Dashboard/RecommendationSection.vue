<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <Card>
      <h3 class="text-lg font-medium text-gray-900 mb-4">
        Filières recommandées (Dernière analyse)
      </h3>
      <div v-if="recommendedPaths.length > 0" class="space-y-3">
        <div v-for="(path, index) in recommendedPaths" :key="index" class="flex items-center p-3 bg-blue-50 rounded-lg">
          <div class="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span class="text-sm font-medium text-blue-600">{{ index + 1 }}</span>
          </div>
          <span class="ml-3 text-sm text-gray-900">{{ path.name }}</span>
          <span class="ml-auto text-sm font-semibold text-blue-700">{{ path.compatibility }}%</span>
        </div>
      </div>
      <div v-else class="text-center text-gray-500 py-4">
        Aucune filière recommandée dans la dernière analyse.
      </div>
    </Card>

    <Card>
      <h3 class="text-lg font-medium text-gray-900 mb-4">
        Vos points forts (Dernière analyse)
      </h3>
      <div v-if="strongestPoints.length > 0" class="space-y-3">
        <div v-for="(strength, index) in strongestPoints.slice(0, 3)" :key="index"
          class="flex items-center p-3 gap-4 bg-green-50 rounded-lg">
           <AcademicCapIcon style="height: 32px;" class="h-6 w-6 text-green-400" />
          <span class="text-sm text-gray-700">{{ strength }}</span>
        </div>
      </div>
      <div v-else class="text-center text-gray-500 py-4">
        Aucun point fort identifié dans la dernière analyse.
      </div>
    </Card>

    <Card class="lg:col-span-2">
      <h3 class="text-lg font-medium text-gray-900 mb-4">
        Progression annuelle (Moyenne générale par bulletin)
      </h3>
      <Line v-if="isValidChartData" :data="chartData" :options="chartOptions" />
      <div v-else class="flex items-center justify-center h-full text-gray-500">
        Pas assez de données pour afficher la progression.
      </div>
    </Card>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Card from '../../../components/UI/Card.vue'
import { Line } from 'vue-chartjs'
import { AcademicCapIcon } from '@heroicons/vue/24/outline';

import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const props = defineProps({
  latestRecommendation: Object,
  chartData: Object,
  chartOptions: Object
})

// Derived data for display
const recommendedPaths = computed(() => {
  if (!props.latestRecommendation || !props.latestRecommendation.suggestedPaths) return [];

  const filiereGroup = props.latestRecommendation.suggestedPaths.find(group => group.groupType === 'filiere_recommandee');
  console.log("filière = ", filiereGroup);
  
  if (filiereGroup && Array.isArray(filiereGroup.suggestions)) {
    return [...filiereGroup.suggestions].sort((a, b) => b.compatibility - a.compatibility).slice(0, 3);
  }
  return [];
});

const strongestPoints = computed(() => {
  return props.latestRecommendation?.strengths || [];
});

const isValidChartData = computed(() => {
  const data = props.chartData;
  return data && Array.isArray(data.labels) && data.labels.length > 0 &&
    data.datasets && Array.isArray(data.datasets) && data.datasets.length > 0 &&
    Array.isArray(data.datasets[0].data) && data.datasets[0].data.length > 0;
});
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 300px;
  width: 100%;
}
</style>