<template>
  <div v-if="hasDemoData" class="fixed bottom-4 right-4 z-50">
    <div class="bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm">
      <div class="flex items-start space-x-3">
        <div class="flex-shrink-0">
          <svg class="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
        </div>
        <div class="flex-1">
          <h4 class="text-sm font-medium text-gray-900">Test en cours</h4>
          <p class="text-xs text-gray-600 mt-1">
            Vous avez un test d'orientation en cours avec {{ progressText }}.
          </p>
          <div class="mt-3 flex space-x-2">
            <router-link
              to="/demo"
              class="text-xs bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition-colors"
            >
              Continuer
            </router-link>
            <button
              @click="dismissDemo"
              class="text-xs text-gray-600 px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              Ignorer
            </button>
          </div>
        </div>
        <button
          @click="closeNotification"
          class="flex-shrink-0 text-gray-400 hover:text-gray-600"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useAppStore } from '@/stores/app';
import { useRoute } from 'vue-router';

const appStore = useAppStore();
const route = useRoute();

const showNotification = ref(false);

// Computed properties
const hasDemoData = computed(() => {
  return appStore.hasDemoInProgress && showNotification.value && route.path !== '/demo';
});

const progressText = computed(() => {
  const responses = appStore.getDemoResponses.length;
  const step = appStore.getDemoCurrentStep;
  
  if (responses === 0) {
    return 'informations de base complétées';
  }
  
  return `${responses} question${responses > 1 ? 's' : ''} répondue${responses > 1 ? 's' : ''}`;
});

// Methods
const closeNotification = () => {
  showNotification.value = false;
  // Sauvegarder la préférence de ne pas afficher pendant cette session
  sessionStorage.setItem('demo_notification_dismissed', 'true');
};

const dismissDemo = () => {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce test en cours ?')) {
    appStore.clearDemoData();
    showNotification.value = false;
  }
};

// Lifecycle
onMounted(() => {
  // Initialiser les données de démo
  appStore.initializeDemo();
  
  // Vérifier si la notification a été ignorée dans cette session
  const dismissed = sessionStorage.getItem('demo_notification_dismissed');
  
  // Afficher la notification si il y a des données et qu'elle n'a pas été ignorée
  if (appStore.hasDemoInProgress && !dismissed) {
    // Attendre un peu avant d'afficher pour éviter l'effet de flash
    setTimeout(() => {
      showNotification.value = true;
    }, 1000);
  }
});

onUnmounted(() => {
  // Nettoyer si nécessaire
});
</script>