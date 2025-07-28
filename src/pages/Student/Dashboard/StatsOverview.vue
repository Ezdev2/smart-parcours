<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <Card>
      <div class="flex items-center">
        <div class="p-2 bg-blue-100 rounded-lg">
          <UserIcon class="h-6 w-6 text-blue-600" />
        </div>
        <div class="ml-4">
          <p class="text-sm font-medium text-gray-600">Moyenne Générale (Globale)</p>
          <p class="text-2xl font-semibold text-gray-900">
            {{ dashboardStats?.overallAverage !== 'N/A' ? dashboardStats?.overallAverage + '/20' : 'N/A' }}
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
          <p class="text-sm font-medium text-gray-600">Bulletins Enregistrés</p>
          <p class="text-2xl font-semibold text-gray-900">{{ dashboardStats?.totalBulletins }}</p>
        </div>
      </div>
    </Card>

    <Card>
      <div class="flex items-center">
        <div class="p-2 bg-purple-100 rounded-lg">
          <SparklesIcon class="h-6 w-6 text-purple-600" />
        </div>
        <div class="ml-4">
          <p class="text-sm font-medium text-gray-600">Dernière Recommandation IA</p>
          <p class="text-md font-semibold text-gray-900 line-clamp-2">
            {{ formatDate(latestRecommendation?.generatedAt) || 'Aucune' }}
          </p>
        </div>
      </div>
    </Card>
  </div>
</template>

<script setup>
import Card from '@/components/UI/Card.vue'
import { UserIcon, DocumentTextIcon, SparklesIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  user: Object,
  bulletins: Array,
  dashboardStats: Object,
  latestRecommendation: Object,
})

const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>