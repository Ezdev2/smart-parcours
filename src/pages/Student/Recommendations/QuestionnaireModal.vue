<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" @click="closeModal"></div>

      <!-- Modal panel -->
      <div class="inline-block w-full max-w-4xl px-6 py-8 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-2xl font-bold text-gray-900">Questionnaire d'orientation</h3>
            <p class="text-sm text-gray-600 mt-1">
              Répondez à ces questions pour affiner vos recommandations
            </p>
          </div>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <XMarkIcon class="h-6 w-6" />
          </button>
        </div>

        <!-- Progress bar -->
        <div class="mb-8">
          <div class="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {{ currentQuestionIndex + 1 }} sur {{ totalQuestions }}</span>
            <span>{{ Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100) }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div 
              class="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              :style="{ width: ((currentQuestionIndex + 1) / totalQuestions) * 100 + '%' }"
            ></div>
          </div>
        </div>

        <!-- Question section -->
        <div v-if="currentQuestion" class="mb-8">
          <!-- Badge -->
          <div class="mb-4">
            <span 
              class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
              :class="getBadgeClass(currentQuestion.badge)"
            >
              <component :is="getBadgeIcon(currentQuestion.badge)" class="h-4 w-4 mr-1" />
              {{ getBadgeLabel(currentQuestion.badge) }}
            </span>
          </div>

          <!-- Question -->
          <h4 class="text-lg font-semibold text-gray-900 mb-6">
            {{ currentQuestion.question }}
          </h4>

          <!-- Scale type question -->
          <div v-if="currentQuestion.type === 'scale'" class="space-y-4">
            <div class="flex justify-between text-sm text-gray-600 mb-2">
              <span>{{ currentQuestion.scale.labels[0] }}</span>
              <span>{{ currentQuestion.scale.labels[1] }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <div class="flex-1 flex justify-between">
                <button
                  v-for="value in getScaleValues(currentQuestion.scale)"
                  :key="value"
                  @click="selectAnswer(value)"
                  class="w-8 h-8 rounded-full border-2 transition-all duration-200 hover:scale-110"
                  :class="selectedAnswer === value 
                    ? 'bg-indigo-600 border-indigo-600 text-white' 
                    : 'border-gray-300 hover:border-indigo-400'"
                >
                  {{ value }}
                </button>
              </div>
            </div>
          </div>

          <!-- Select type question -->
          <div v-else-if="currentQuestion.type === 'select'" class="space-y-3">
            <button
              v-for="option in currentQuestion.options"
              :key="option"
              @click="selectAnswer(option)"
              class="w-full p-4 text-left border border-gray-200 rounded-lg transition-all duration-200 hover:border-indigo-400 hover:bg-indigo-50"
              :class="selectedAnswer === option 
                ? 'border-indigo-600 bg-indigo-50 text-indigo-900' 
                : 'text-gray-700'"
            >
              <div class="flex items-center">
                <div 
                  class="w-4 h-4 rounded-full border-2 mr-3 transition-all duration-200"
                  :class="selectedAnswer === option 
                    ? 'border-indigo-600 bg-indigo-600' 
                    : 'border-gray-300'"
                >
                  <div v-if="selectedAnswer === option" class="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                </div>
                {{ option }}
              </div>
            </button>
          </div>
        </div>

        <!-- Navigation buttons -->
        <div class="flex justify-between items-center pt-6 border-t border-gray-200">
          <button
            @click="previousQuestion"
            :disabled="currentQuestionIndex === 0"
            class="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeftIcon class="h-4 w-4 mr-1" />
            Précédent
          </button>

          <div class="text-sm text-gray-500">
            {{ answeredQuestions.size }} / {{ totalQuestions }} réponses
          </div>

          <button
            @click="nextQuestion"
            :disabled="!selectedAnswer"
            class="flex items-center px-6 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isLastQuestion ? 'Terminer' : 'Suivant' }}
            <ChevronRightIcon v-if="!isLastQuestion" class="h-4 w-4 ml-1" />
            <CheckIcon v-else class="h-4 w-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { QuestionnaireService } from '../../../services/questionnaireService';
import {
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckIcon,
  AcademicCapIcon,
  HeartIcon,
  CpuChipIcon
} from '@heroicons/vue/24/outline';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['close', 'complete']);

// Questions and navigation
const questions = ref(QuestionnaireService.getAllQuestions());
const currentQuestionIndex = ref(0);
const selectedAnswer = ref(null);
const answers = ref(new Map());
const answeredQuestions = ref(new Set());

// Computed properties
const totalQuestions = computed(() => questions.value.length);
const currentQuestion = computed(() => questions.value[currentQuestionIndex.value]);
const isLastQuestion = computed(() => currentQuestionIndex.value === totalQuestions.value - 1);

// Badge helpers
const getBadgeClass = (badge) => {
  switch (badge) {
    case 'academic':
      return 'bg-indigo-100 text-indigo-800';
    case 'aspiration':
      return 'bg-green-100 text-green-800';
    case 'logique':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getBadgeIcon = (badge) => {
  switch (badge) {
    case 'academic':
      return AcademicCapIcon;
    case 'aspiration':
      return HeartIcon;
    case 'logique':
      return CpuChipIcon;
    default:
      return AcademicCapIcon;
  }
};

const getBadgeLabel = (badge) => {
  switch (badge) {
    case 'academic':
      return 'Académique';
    case 'aspiration':
      return 'Aspirations personnelles';
    case 'logique':
      return 'Logique & Raisonnement';
    default:
      return 'Question';
  }
};

// Scale helpers
const getScaleValues = (scale) => {
  const values = [];
  for (let i = scale.min; i <= scale.max; i++) {
    values.push(i);
  }
  return values;
};

// Navigation methods
const selectAnswer = (answer) => {
  selectedAnswer.value = answer;
};

const nextQuestion = () => {
  if (!selectedAnswer.value) return;

  // Save answer
  const questionId = currentQuestion.value.id;
  answers.value.set(questionId, selectedAnswer.value);
  answeredQuestions.value.add(questionId);

  if (isLastQuestion.value) {
    // Complete questionnaire
    completeQuestionnaire();
  } else {
    // Move to next question
    currentQuestionIndex.value++;
    loadAnswerForCurrentQuestion();
  }
};

const previousQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--;
    loadAnswerForCurrentQuestion();
  }
};

const loadAnswerForCurrentQuestion = () => {
  const questionId = currentQuestion.value.id;
  selectedAnswer.value = answers.value.get(questionId) || null;
};

const completeQuestionnaire = () => {
  // Convert answers to the expected format
  const responses = Array.from(answers.value.entries()).map(([questionId, answer]) => ({
    questionId,
    answer
  }));

  emit('complete', responses);
};

const closeModal = () => {
  emit('close');
};

// Reset when modal opens
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    currentQuestionIndex.value = 0;
    selectedAnswer.value = null;
    answers.value.clear();
    answeredQuestions.value.clear();
    loadAnswerForCurrentQuestion();
  }
});

// Load answer when question changes
watch(currentQuestionIndex, () => {
  loadAnswerForCurrentQuestion();
});
</script>

<style scoped>
/* Transition styles for smooth interactions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>