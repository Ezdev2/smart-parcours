<template>
  <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
    <Card :is-hovering="true">
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

    <Card :is-hovering="true">
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

    <Card :is-hovering="true">
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

    <Card :is-hovering="true">
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
</template>

<script setup>
import Card from '../../../components/UI/Card.vue'
import { ChartBarIcon, UserIcon, DocumentTextIcon, SparklesIcon } from '@heroicons/vue/24/outline'

defineProps({
  user: Object,
  bulletins: Array
})
</script>
