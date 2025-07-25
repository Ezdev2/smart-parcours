<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900">Recommandations d'Orientation</h1>
      <Button @click="generateNewRecommendation" :disabled="loading || !canGenerateRecommendation" class="flex items-center">
        <SparklesIcon class="h-5 w-5 mr-2" />
        {{ loading ? 'Génération...' : 'Nouvelle analyse IA' }}
        <span 
          v-if="!loading" 
          class="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800"
        >
          {{ LATEST_RECOMMENDATION_LIMIT - weeklyGenerationCount }}
        </span>
      </Button> 
    </div>

    <div v-if="!loading && latestRecommendation" class="text-sm text-gray-600">
      Quota de génération cette semaine :
      <span class="font-semibold" :class="{ 'text-red-600': weeklyGenerationCount >= LATEST_RECOMMENDATION_LIMIT, 'text-green-600': weeklyGenerationCount < LATEST_RECOMMENDATION_LIMIT }">
        {{ weeklyGenerationCount }} / {{ LATEST_RECOMMENDATION_LIMIT }}
      </span>
      ({{ LATEST_RECOMMENDATION_LIMIT - weeklyGenerationCount }} restantes)
      <p v-if="!canGenerateRecommendation" class="text-red-500 text-xs mt-1">Vous avez atteint la limite de générations pour cette semaine.</p>
    </div>


    <LoadingSpinner v-if="loading" text="Génération de vos recommandations, cela peut prendre quelques instants..." color="indigo" class="my-8" />

    <div v-else-if="generationError" class="bg-red-50 border border-red-200 rounded-md p-4">
      <div class="text-red-800">{{ generationError }}</div>
    </div>

    <Card v-else-if="!latestRecommendation">
      <EmptyState :icon="SparklesIcon" title="Aucune recommandation disponible"
        description="Générez votre première analyse d'orientation personnalisée avec l'IA."
        buttonText="Générer mes recommandations" @action="generateNewRecommendation" />
    </Card>

    <div v-else>
      <RecommendationsDisplay :recommendation="currentRecommendation" :formatDate="formatDate" :is-latest="selectedIndex === 0" />

      <Card v-if="recommendations.length > 1" class="mt-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Historique des analyses</h3>
        <div class="space-y-3">
          <div
            v-for="(rec, index) in recommendations"
            :key="rec.id"
            @click="selectRecommendation(index)"
            class="p-4 rounded-lg cursor-pointer transition duration-200 border border-gray-200 hover:bg-blue-50"
            :class="{
              'bg-blue-100 border-blue-400': index === selectedIndex
            }"
          >
            <div class="flex justify-between items-center mb-1">
              <span class="text-sm font-medium text-gray-900">
                Analyse #{{ recommendations.length - index }}
                <span v-if="index === 0" class="text-xs text-blue-600 font-semibold">(Dernière)</span>
              </span>
              <span class="text-sm text-gray-500">
                {{ formatDate(rec.generatedAt) }}
              </span>
            </div>
            <p class="text-sm text-gray-700 line-clamp-2">
              {{ rec.content }}
            </p>
          </div>
        </div>
      </Card>
    </div>

    <ConfirmDialog />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { FirebaseService } from '../../services/firebaseService'
import { OrientationService } from '../../services/orientationService'
import Card from '../../components/UI/Card.vue'
import Button from '../../components/UI/Button.vue'
import EmptyState from '../../components/UI/EmptyState.vue'
import LoadingSpinner from '../../components/UI/LoadingSpinner.vue';
import ConfirmDialog from '../../components/UI/ConfirmDialog.vue';
import RecommendationsDisplay from './Recommendations/RecommendationsDisplay.vue'
import { useConfirm } from '../../composables/useConfirm';

// Icons
import { SparklesIcon, AcademicCapIcon, BookOpenIcon, PaintBrushIcon, CogIcon, BriefcaseIcon, TrophyIcon, LanguageIcon, CommandLineIcon, CalculatorIcon, LightBulbIcon } from '@heroicons/vue/24/outline'; // Importing more icons for academic profiles

const authStore = useAuthStore()
const user = computed(() => authStore.user)
const { showAlert } = useConfirm();

const recommendations = ref([])
const loading = ref(false)
const generationError = ref(null);
const selectedIndex = ref(0);
const weeklyGenerationCount = ref(0);

const LATEST_RECOMMENDATION_LIMIT = OrientationService.MAX_WEEKLY_RECOMMENDATIONS;

const latestRecommendation = computed(() => recommendations.value[0] || null);
const currentRecommendation = computed(() => recommendations.value[selectedIndex.value]);

const canGenerateRecommendation = computed(() => {
  return weeklyGenerationCount.value < LATEST_RECOMMENDATION_LIMIT;
});

const formatDate = (date) => {
  if (!date) return 'N/A';
  let d = date instanceof Date ? date : (date.toDate ? date.toDate() : new Date(date));
  return d.toLocaleDateString('fr-FR', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
};

// --- Data Loading ---
const loadRecommendationsAndCount = async () => {
  if (!user.value || !user.value.id) return;
  loading.value = true;
  generationError.value = null;

  try {
    const [fetchedRecommendations, count] = await Promise.all([
      FirebaseService.getRecommendationsByStudent(user.value.id),
      FirebaseService.getWeeklyRecommendationCount(user.value.id)
    ]);
    recommendations.value = fetchedRecommendations;
    weeklyGenerationCount.value = count;

    if (selectedIndex.value >= recommendations.value.length) {
      selectedIndex.value = 0;
    }
  } catch (error) {
    console.error('Error loading recommendations or count:', error);
    showAlert('Erreur', 'Impossible de charger les recommandations ou de vérifier le quota: ' + error.message, 'Compris');
  } finally {
    loading.value = false;
  }
};

// --- Recommendation Generation ---
const generateNewRecommendation = async () => {
  if (!user.value || !user.value.id) {
    showAlert('Erreur', 'Utilisateur non connecté.', 'Ok');
    return;
  }
  if (!canGenerateRecommendation.value) {
    showAlert('Limite de génération', `Vous avez atteint la limite de ${LATEST_RECOMMENDATION_LIMIT} recommandations par semaine. Veuillez réessayer la semaine prochaine.`, 'Ok');
    return;
  }

  loading.value = true;
  generationError.value = null;

  try {
    const studentProfile = await FirebaseService.getUserById(user.value.id);
    if (!studentProfile) {
      throw new Error("Profil étudiant non trouvé.");
    }

    const bulletins = await FirebaseService.getBulletinsByStudent(user.value.id);

    const age = studentProfile.profile?.dateOfBirth
      ? (new Date().getFullYear() - new Date(studentProfile.profile.dateOfBirth).getFullYear())
      : null;

    const prompt = OrientationService.buildPromptFromProfile(user.value, bulletins, age);
    const result = await OrientationService.generateRecommendations(prompt);

    await FirebaseService.createRecommendation({
      studentId: user.value.id,
      ...result
    });

    await loadRecommendationsAndCount();
    selectedIndex.value = 0;
    showAlert('Succès', 'Nouvelles recommandations IA générées avec succès !', 'Super');

  } catch (error) {
    console.error('Error generating recommendations:', error);
    generationError.value = `Erreur lors de la génération: ${error.message}.`;
    showAlert('Erreur', generationError.value, 'Compris');
  } finally {
    loading.value = false;
  }
};

// --- History Management ---
function selectRecommendation(index) {
  selectedIndex.value = index;
}

// --- Lifecycle ---
onMounted(() => {
  loadRecommendationsAndCount();
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>