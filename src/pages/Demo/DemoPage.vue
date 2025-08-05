<template>
  <div class="bg-white min-h-[60vh] flex flex-col justify-center items-center mt-8 md:mt-20">

    <div class="md:w-[80%] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Progress Bar -->
      <div v-if="currentStep > 0" class="mb-8 w-full">
        <div class="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>Progression</span>
          <span>{{ Math.round((currentStep / totalSteps) * 100) }}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div class="bg-indigo-600 h-2 rounded-full transition-all duration-300"
            :style="{ width: `${(currentStep / totalSteps) * 100}%` }"></div>
        </div>
        <div class="mt-2 text-xs text-gray-500">
          {{ responsesByBadge.academic + responsesByBadge.personal + responsesByBadge.logic }} questions répondues
        </div>
      </div>

      <!-- Notification de continuation -->
      <div v-if="showContinueNotification" class="mb-6 bg-indigo-50 border border-indigo-200 rounded-lg p-4">
        <div class="flex items-start">
          <svg class="w-5 h-5 text-indigo-500 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div>
            <h4 class="text-sm font-medium text-indigo-800">Reprendre votre test</h4>
            <p class="text-sm text-indigo-700 mt-1">
              Nous avons trouvé un test en cours. Vous pouvez continuer où vous vous êtes arrêté ou recommencer.
            </p>
            <div class="mt-3 flex space-x-3">
              <button @click="showContinueNotification = false"
                class="text-sm bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700">
                Continuer
              </button>
              <button @click="restartDemo"
                class="text-sm text-indigo-600 px-3 py-1 border border-indigo-300 rounded hover:bg-indigo-50">
                Recommencer
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 1: Informations personnelles -->
      <div class="w-full">
        <div v-if="currentStep === 0" class="bg-white rounded-xl shadow-lg md:p-8 p-4">
          <div class="text-center mb-8">
            <h1 class="text-3xl font-bold text-gray-900 mb-4">
              Démonstration SmartParcours
            </h1>
            <p class="text-lg text-gray-600">
              Commençons par quelques informations de base
            </p>
          </div>

          <form @submit.prevent="nextStep" class="space-y-6">
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Prénom *
                </label>
                <input v-model="localUserData.firstName" type="text" required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Votre prénom" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Nom *
                </label>
                <input v-model="localUserData.lastName" type="text" required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Votre nom" />
              </div>
            </div>

            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Âge *
                </label>
                <input v-model.number="localUserData.age" type="number" min="14" max="25" required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Votre âge" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Niveau d'études *
                </label>
                <select v-model="localUserData.level" required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                  <option value="">Sélectionnez votre niveau</option>
                  <option value="3ème">3ème</option>
                  <option value="2nde">2nde</option>
                  <option value="1ère">1ère</option>
                  <option value="Terminale">Terminale</option>
                  <option value="Bac+1">Bac+1</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Classe actuelle *
              </label>
              <select v-model="localUserData.classLevel" required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                <option value="">Sélectionnez votre classe</option>
                <option value="3ème Générale">3ème Générale</option>
                <option value="2nde Générale">2nde Générale</option>
                <option value="1ère S">1ère S (Scientifique)</option>
                <option value="1ère ES">1ère ES (Économique et Social)</option>
                <option value="1ère L">1ère L (Littéraire)</option>
                <option value="Terminale S">Terminale S (Scientifique)</option>
                <option value="Terminale ES">Terminale ES (Économique et Social)</option>
                <option value="Terminale L">Terminale L (Littéraire)</option>
                <option value="Terminale STMG">Terminale STMG</option>
                <option value="Terminale STI2D">Terminale STI2D</option>
              </select>
            </div>

            <div class="text-center">
              <button type="submit"
                class="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
                Commencer le questionnaire
              </button>
            </div>
          </form>
        </div>

        <!-- Step 2-4: Questions -->
        <div v-else-if="currentStep <= 3" class="bg-white rounded-xl shadow-lg md:p-8 p-4">
          <div class="mb-8">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center space-x-3">
                <span :class="badgeClasses[currentBadge]">
                  {{ badgeLabels[currentBadge] }}
                </span>
                <span class="text-sm text-gray-500">
                  Question {{ currentQuestionIndex + 1 }} sur {{ currentQuestions.length }}
                </span>
              </div>
              <div class="text-xs text-gray-400">
                {{ responsesByBadge[currentBadge] }}/{{ currentQuestions.length }} répondues
              </div>
            </div>

            <h2 class="text-2xl font-bold text-gray-900 mb-2">
              {{ currentQuestion.question }}
            </h2>
          </div>

          <div class="space-y-4">
            <!-- Questions à échelle -->
            <div v-if="currentQuestion.type === 'scale'" class="space-y-6">
              <div class="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>{{ currentQuestion.scale.labels[0] }}</span>
                <span>{{ currentQuestion.scale.labels[1] }}</span>
              </div>
              <div class="flex items-center space-x-4">
                <div class="flex-1 flex justify-between">
                  <div v-for="value in scaleRange" :key="value" @click="selectAnswer(value)"
                    class="md:w-10 md:h-10 w-8 h-8 rounded-full border-2 cursor-pointer transition-all flex items-center justify-center text-sm font-medium"
                    :class="selectedAnswer === value
                      ? 'border-indigo-500 bg-indigo-500 text-white'
                      : 'border-gray-300 hover:border-indigo-300'">
                    {{ value }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Questions à choix multiple -->
            <div v-else-if="currentQuestion.type === 'select'" class="space-y-3">
              <div v-for="option in currentQuestion.options" :key="option" @click="selectAnswer(option)"
                class="p-4 border-2 rounded-lg cursor-pointer transition-all" :class="selectedAnswer === option
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-indigo-300'">
                <div class="flex items-center space-x-3">
                  <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                    :class="selectedAnswer === option ? 'border-indigo-500' : 'border-gray-300'">
                    <div v-if="selectedAnswer === option" class="w-3 h-3 rounded-full bg-indigo-500"></div>
                  </div>
                  <span class="text-gray-900">{{ option }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between mt-8">
            <button @click="previousQuestion" :disabled="currentQuestionIndex === 0 && currentStep === 1"
              class="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              Précédent
            </button>
            <button @click="nextQuestion" :disabled="!selectedAnswer"
              class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {{ isLastQuestion ? 'Terminer' : 'Suivant' }}
            </button>
          </div>
        </div>

        <!-- Step 5: Chargement -->
        <div v-else-if="currentStep === 4" class="bg-white rounded-xl shadow-lg p-8 text-center">
          <div class="animate-spin w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full mx-auto mb-6">
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-4">
            Analyse en cours...
          </h2>
          <p class="text-gray-600 mb-4">
            Notre IA analyse vos {{ responses.length }} réponses pour générer vos recommandations personnalisées.
          </p>
          <div class="text-sm text-gray-500">
            {{ loadingMessage }}
          </div>
        </div>

        <!-- Step 6: Résultats -->
        <div v-else-if="currentStep === 5 && results" class="space-y-8">
          <!-- Profil académique -->
          <div class="bg-white rounded-xl shadow-lg p-8">
            <div class="text-center mb-8">
              <h2 class="text-3xl font-bold text-gray-900 mb-4">
                {{ results.title }}
              </h2>
              <p class="text-lg text-gray-600">
                {{ results.content }}
              </p>
            </div>

            <div class="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl p-6 text-white mb-8">
              <h3 class="text-xl font-bold mb-2">Votre Profil Académique</h3>
              <div class="text-2xl font-bold mb-2">{{ results.academicProfile.title }}</div>
              <p class="text-indigo-100">{{ results.academicProfile.description }}</p>
            </div>

            <!-- Points forts et axes d'amélioration -->
            <div class="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg class="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Points Forts
                </h4>
                <ul class="space-y-2">
                  <li v-for="strength in results.strengths" :key="strength" class="flex items-start">
                    <span class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span class="text-gray-700">{{ strength }}</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg class="w-5 h-5 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Axes d'Amélioration
                </h4>
                <ul class="space-y-2">
                  <li v-for="area in results.improvementAreas" :key="area" class="flex items-start">
                    <span class="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span class="text-gray-700">{{ area }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Recommandations -->
          <div class="space-y-6">
            <div v-for="pathGroup in results.suggestedPaths" :key="pathGroup.groupType"
              class="bg-white rounded-xl shadow-lg p-8">
              <h3 class="text-xl font-bold text-gray-900 mb-6">{{ pathGroup.groupTitle }}</h3>

              <div class="space-y-4">
                <div v-for="suggestion in pathGroup.suggestions" :key="suggestion.name" class="border rounded-lg p-4"
                  :class="pathGroup.isBlurred ? 'relative overflow-hidden' : ''">

                  <!-- Contenu flouté pour inciter à l'inscription -->
                  <div v-if="pathGroup.isBlurred"
                    class="absolute inset-0 bg-white bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-10">
                    <div class="text-center">
                      <svg class="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z">
                        </path>
                      </svg>
                      <p class="text-gray-600 font-medium">Contenu disponible <span class="text-sm text-gray-500">(après
                          inscription)</span></p>

                    </div>
                  </div>

                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <h4 class="font-semibold text-gray-900 mb-2">{{ suggestion.name }}</h4>
                      <p class="text-gray-600 text-sm">{{ suggestion.rationale }}</p>
                    </div>
                    <div v-if="!pathGroup.isBlurred" class="ml-4 text-right">
                      <div class="text-2xl font-bold text-indigo-600">{{ suggestion.compatibility }}%</div>
                      <div class="text-xs text-gray-500">Compatibilité</div>
                    </div>
                    <div v-else class="ml-4 text-right">
                      <div class="text-2xl font-bold text-gray-400">XX%</div>
                      <div class="text-xs text-gray-400">Compatibilité</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Call to action -->
          <div class="bg-gradient-to-r from-indigo-600 to-indigo-600 rounded-xl p-8 text-white text-center">
            <h3 class="text-2xl font-bold mb-4">Vous voulez en savoir plus ?</h3>
            <p class="text-lg text-indigo-100 mb-6">
              Débloquez l'analyse complète avec tous les domaines et métiers recommandés pour votre profil.
            </p>
            <div class="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
              <button @click="$emit('add-school')"
                class="w-full sm:w-auto px-8 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition-colors">
                Inscrire votre établissement
              </button>
              <router-link to="/"
                class="w-full sm:w-auto inline-block px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-indigo-600 transition-colors">
                Retour à l'accueil
              </router-link>
            </div>

            <!-- Option pour refaire le test -->
            <div class="mt-6 pt-6 border-t border-indigo-500">
              <button @click="restartDemo" class="text-indigo-200 hover:text-white underline text-sm">
                Refaire le test avec d'autres réponses
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAppStore } from '../../stores/app';
import { DemoOrientationService } from '../../services/demoOrientationService';

const emit = defineEmits(['add-school']);
const appStore = useAppStore();

const localUserData = ref({ ...appStore.getDemoUserData });

// État local réactif basé sur le store
const totalSteps = 5;
const loadingMessage = ref('Initialisation...');
const showContinueNotification = ref(false);

// Getters du store
const currentStep = computed(() => appStore.getDemoCurrentStep);
const currentBadge = computed(() => appStore.getDemoCurrentBadge);
const currentQuestionIndex = computed(() => appStore.getDemoCurrentQuestionIndex);
const selectedAnswer = computed(() => appStore.getDemoSelectedAnswer);
const userData = computed(() => appStore.getDemoUserData);
const responses = computed(() => appStore.getDemoResponses);
const results = computed(() => appStore.getDemoResults);
const hasDemoInProgress = computed(() => appStore.hasDemoInProgress);
const hasDemoCompleted = computed(() => appStore.hasDemoCompleted);
const responsesByBadge = computed(() => appStore.getDemoResponsesByBadge);

// Configuration des badges
const badgeLabels = {
  academic: 'Academic',
  personal: 'Aspiration',
  logic: 'Logique'
};

const badgeClasses = {
  academic: 'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800',
  personal: 'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800',
  logic: 'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800'
};

// Questions actuelles selon l'étape
const currentQuestions = computed(() => {
  switch (currentStep.value) {
    case 1: return DemoOrientationService.DEMO_QUESTIONS.academic;
    case 2: return DemoOrientationService.DEMO_QUESTIONS.personal;
    case 3: return DemoOrientationService.DEMO_QUESTIONS.logic;
    default: return [];
  }
});

const currentQuestion = computed(() => {
  if (currentQuestions.value.length > 0 && currentQuestionIndex.value < currentQuestions.value.length) {
    return currentQuestions.value[currentQuestionIndex.value];
  }
  return null;
});

const scaleRange = computed(() => {
  if (currentQuestion.value?.type === 'scale') {
    const { min, max } = currentQuestion.value.scale;
    return Array.from({ length: max - min + 1 }, (_, i) => min + i);
  }
  return [];
});

const isLastQuestion = computed(() => {
  return currentQuestionIndex.value === currentQuestions.value.length - 1 && currentStep.value === 3;
});

// Navigation
const nextStep = () => {
  if (currentStep.value === 0) {
    appStore.updateDemoUserData(localUserData.value);
    appStore.updateDemoStep(1);
    appStore.updateDemoBadge('academic');
    appStore.updateDemoQuestionIndex(0);
    appStore.setDemoSelectedAnswer(null);
  }
};

const nextQuestion = () => {
  if (!selectedAnswer.value) {
    return;
  }

  // First, add the response
  const responseToAdd = {
    questionId: currentQuestion.value.id,
    questionText: currentQuestion.value.question,
    answer: selectedAnswer.value,
    badge: currentBadge.value,
  };
  appStore.addDemoResponse(responseToAdd);

  // Now, manage the step and index
  if (isLastQuestion.value) {
    appStore.updateDemoStep(4);
    
    // Asynchronously generate results
    analyzeResponses();
  } else {
    if (currentQuestionIndex.value < currentQuestions.value.length - 1) {
      appStore.updateDemoQuestionIndex(currentQuestionIndex.value + 1);
    } else {
      // Passer à la série suivante
      appStore.updateDemoStep(currentStep.value + 1);

      // Move to the next badge
      const badges = ['academic', 'personal', 'logic'];
      const nextBadgeIndex = badges.indexOf(currentBadge.value) + 1;
      if (nextBadgeIndex < badges.length) {
        appStore.updateDemoBadge(badges[nextBadgeIndex]);
        appStore.updateDemoQuestionIndex(0);
      }
    }
  }

  // Reset the selected answer for the next question
  appStore.setDemoSelectedAnswer(null);
};

const previousQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    appStore.updateDemoQuestionIndex(currentQuestionIndex.value - 1);
    // Récupérer la réponse précédente si elle existe
    const removedResponse = appStore.removeDemoResponse();
    if (removedResponse) {
      appStore.setDemoSelectedAnswer(removedResponse.answer);
    }
  } else if (currentStep.value > 1) {
    // Retour à la série précédente
    const newStep = currentStep.value - 1;
    appStore.updateDemoStep(newStep);

    // Mettre à jour le badge et l'index
    switch (newStep) {
      case 1:
        appStore.updateDemoBadge('academic');
        appStore.updateDemoQuestionIndex(DemoOrientationService.DEMO_QUESTIONS.academic.length - 1);
        break;
      case 2:
        appStore.updateDemoBadge('personal');
        appStore.updateDemoQuestionIndex(DemoOrientationService.DEMO_QUESTIONS.personal.length - 1);
        break;
    }

    // Récupérer la réponse précédente
    const removedResponse = appStore.removeDemoResponse();
    if (removedResponse) {
      appStore.setDemoSelectedAnswer(removedResponse.answer);
    }
  }
};

const selectAnswer = (answer) => {
  appStore.setDemoSelectedAnswer(answer);
};

const analyzeResponses = async () => {
  appStore.updateDemoStep(4); // Étape de chargement

  const loadingMessages = [
    'Analyse de vos réponses...',
    'Identification de votre profil...',
    'Génération des recommandations...',
    'Finalisation de l\'analyse...'
  ];

  let messageIndex = 0;
  const loadingInterval = setInterval(() => {
    loadingMessage.value = loadingMessages[messageIndex];
    messageIndex = (messageIndex + 1) % loadingMessages.length;
  }, 1500);

  try {
    // Appel à l'IA pour analyser les réponses
    const recommendations = await DemoOrientationService.generateDemoRecommendations(
      userData.value,
      responses.value
    );

    appStore.setDemoResults(recommendations);
    appStore.updateDemoStep(5); // Afficher les résultats

  } catch (error) {
    console.error('Erreur lors de l\'analyse:', error);
    // En cas d'erreur, utiliser les données mock
    const mockResults = DemoOrientationService.getMockDemoRecommendations(userData.value);
    appStore.setDemoResults(mockResults);
    appStore.updateDemoStep(5);
  } finally {
    clearInterval(loadingInterval);
  }
};

const restartDemo = () => {
  appStore.restartDemo();
  showContinueNotification.value = false;
};

onMounted(() => {
  // Initialiser les données de démo depuis localStorage
  appStore.initializeDemo();

  localUserData.value = { ...appStore.getDemoUserData };

  // Vérifier s'il y a une démo en cours et proposer de continuer
  if (hasDemoInProgress.value && currentStep.value > 0) {
    showContinueNotification.value = true;
  }

  // Si on a des résultats complétés, aller directement aux résultats
  if (hasDemoCompleted.value && currentStep.value < 5) {
    appStore.updateDemoStep(5);
  }
});
</script>