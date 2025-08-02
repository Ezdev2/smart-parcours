import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

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

  // État pour la démonstration
  const demoState = ref({
    userData: {
      firstName: '',
      lastName: '',
      age: null,
      level: '',
      classLevel: ''
    },
    responses: [],
    currentStep: 0,
    currentBadge: 'academic',
    currentQuestionIndex: 0,
    selectedAnswer: null,
    results: null,
    isCompleted: false,
    completedAt: null
  })

  // Clés pour le localStorage
  const DEMO_STORAGE_KEY = 'smartparcours_demo_state'
  const DEMO_RESULTS_KEY = 'smartparcours_demo_results'

  // Computed pour vérifier si une démo est en cours
  const hasDemoInProgress = computed(() => {
    return demoState.value.currentStep > 0 && !demoState.value.isCompleted
  })

  const hasDemoCompleted = computed(() => {
    return demoState.value.isCompleted && demoState.value.results !== null
  })

  // Actions principales existantes
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

  // Actions pour la gestion de la démo
  const initializeDemo = () => {
    try {
      const savedState = localStorage.getItem(DEMO_STORAGE_KEY)
      const savedResults = localStorage.getItem(DEMO_RESULTS_KEY)
      
      if (savedState) {
        const parsedState = JSON.parse(savedState)
        // Vérifier que les données ne sont pas trop anciennes (24h)
        const savedTime = new Date(parsedState.savedAt || 0)
        const now = new Date()
        const hoursDiff = (now - savedTime) / (1000 * 60 * 60)
        
        if (hoursDiff < 24) {
          demoState.value = { ...demoState.value, ...parsedState }
          console.log('État de démo restauré depuis localStorage')
        } else {
          clearDemoData()
          console.log('Données de démo expirées, réinitialisation')
        }
      }
      
      if (savedResults && demoState.value.isCompleted) {
        const parsedResults = JSON.parse(savedResults)
        demoState.value.results = parsedResults
        console.log('Résultats de démo restaurés depuis localStorage')
      }
    } catch (error) {
      console.error('Erreur lors de la restauration des données de démo:', error)
      clearDemoData()
    }
  }

  const saveDemoState = () => {
    try {
      const stateToSave = {
        ...demoState.value,
        savedAt: new Date().toISOString()
      }
      localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(stateToSave))
      
      if (demoState.value.results) {
        localStorage.setItem(DEMO_RESULTS_KEY, JSON.stringify(demoState.value.results))
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des données de démo:', error)
    }
  }

  const updateDemoUserData = (userData) => {
    demoState.value.userData = { ...userData }
    saveDemoState()
  }

  // const updateDemoStep = (step) => {
  //   demoState.value.currentStep = step
  //   saveDemoState()
  // }

  const updateDemoStep = (step) => {
  // Add a log to see when this is called
    console.log(`Updating step to: ${step}`);
    if (demoState.value.currentStep === step) {
      // If the step hasn't actually changed, return early
      return;
    }
    demoState.value.currentStep = step
    saveDemoState()
  }

  const updateDemoBadge = (badge) => {
    demoState.value.currentBadge = badge
    saveDemoState()
  }

  const updateDemoQuestionIndex = (index) => {
    demoState.value.currentQuestionIndex = index
    saveDemoState()
  }

  const setDemoSelectedAnswer = (answer) => {
    demoState.value.selectedAnswer = answer
    // Ne pas sauvegarder la réponse sélectionnée temporaire
  }

  const addDemoResponse = (response) => {
    demoState.value.responses.push(response)
    saveDemoState()
  }

  const removeDemoResponse = () => {
    if (demoState.value.responses.length > 0) {
      const removedResponse = demoState.value.responses.pop()
      saveDemoState()
      return removedResponse
    }
    return null
  }

  const setDemoResults = (results) => {
    demoState.value.results = results
    demoState.value.isCompleted = true
    demoState.value.completedAt = new Date().toISOString()
    saveDemoState()
  }

  const clearDemoData = () => {
    demoState.value = {
      userData: {
        firstName: '',
        lastName: '',
        age: null,
        level: '',
        classLevel: ''
      },
      responses: [],
      currentStep: 0,
      currentBadge: 'academic',
      currentQuestionIndex: 0,
      selectedAnswer: null,
      results: null,
      isCompleted: false,
      completedAt: null
    }
    
    try {
      localStorage.removeItem(DEMO_STORAGE_KEY)
      localStorage.removeItem(DEMO_RESULTS_KEY)
    } catch (error) {
      console.error('Erreur lors de la suppression des données de démo:', error)
    }
  }

  const restartDemo = () => {
    clearDemoData()
    console.log('Démo redémarrée')
  }

  // Getters pour la démo
  const getDemoUserData = computed(() => demoState.value.userData)
  const getDemoResponses = computed(() => demoState.value.responses)
  const getDemoCurrentStep = computed(() => demoState.value.currentStep)
  const getDemoCurrentBadge = computed(() => demoState.value.currentBadge)
  const getDemoCurrentQuestionIndex = computed(() => demoState.value.currentQuestionIndex)
  const getDemoSelectedAnswer = computed(() => demoState.value.selectedAnswer)
  const getDemoResults = computed(() => demoState.value.results)
  const getDemoProgress = computed(() => {
    const totalQuestions = 25 // Nombre total approximatif de questions
    const answeredQuestions = demoState.value.responses.length
    return Math.round((answeredQuestions / totalQuestions) * 100)
  })

  // Fonction utilitaire pour obtenir le nombre de réponses par badge
  const getDemoResponsesByBadge = computed(() => {
    const responsesByBadge = {
      academic: 0,
      personal: 0,
      logic: 0
    }
    
    demoState.value.responses.forEach(response => {
      if (response.badge && responsesByBadge.hasOwnProperty(response.badge)) {
        responsesByBadge[response.badge]++
      }
    })
    
    return responsesByBadge
  })

  return {
    // État existant
    bulletins,
    recommendations,
    settings,
    loading,
    
    // État démo
    demoState,
    hasDemoInProgress,
    hasDemoCompleted,
    
    // Actions existantes
    setBulletins,
    setRecommendations,
    setSettings,
    setLoading,
    
    // Actions démo
    initializeDemo,
    saveDemoState,
    updateDemoUserData,
    updateDemoStep,
    updateDemoBadge,
    updateDemoQuestionIndex,
    setDemoSelectedAnswer,
    addDemoResponse,
    removeDemoResponse,
    setDemoResults,
    clearDemoData,
    restartDemo,
    
    // Getters démo
    getDemoUserData,
    getDemoResponses,
    getDemoCurrentStep,
    getDemoCurrentBadge,
    getDemoCurrentQuestionIndex,
    getDemoSelectedAnswer,
    getDemoResults,
    getDemoProgress,
    getDemoResponsesByBadge
  }
})