import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const bulletins = ref([])
  const recommendations = ref([])
  const settings = ref({
    schoolName: 'SmartParcours Academy',
    brandColor: '#3B82F6',
    academicYear: '2024-2025',
    classes: ['6ème', '5ème', '4ème', '3ème', 'Seconde', 'Première', 'Terminale'],
    subjects: ['Mathématiques', 'Français', 'Sciences', 'Histoire-Géographie', 'Anglais', 'Physique-Chimie', 'SVT', 'Philosophie']
  })
  const loading = ref(false)

  const setBulletins = (newBulletins) => {
    bulletins.value = newBulletins
  }

  const setRecommendations = (newRecommendations) => {
    recommendations.value = newRecommendations
  }

  const setSettings = (newSettings) => {
    settings.value = newSettings
  }

  const setLoading = (isLoading) => {
    loading.value = isLoading
  }

  return {
    bulletins,
    recommendations,
    settings,
    loading,
    setBulletins,
    setRecommendations,
    setSettings,
    setLoading
  }
})