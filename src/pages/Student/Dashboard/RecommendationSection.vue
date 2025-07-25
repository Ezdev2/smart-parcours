<template>
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
      <Line :data="chartData" :options="chartOptions" />
    </Card>
  </div>
</template>

<script setup>
import Card from '../../../components/UI/Card.vue'
import { Line } from 'vue-chartjs'

defineProps({
  recommendedFields: Array,
  strongestSubjects: Array,
  chartData: Object,
  chartOptions: Object
})
</script>
