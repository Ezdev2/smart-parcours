<template>
  <div class="flex flex-col items-center justify-center p-8 text-gray-600">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2"
         :class="spinnerColorClass"></div>
    <p v-if="text" class="mt-3 text-sm">{{ text }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  text: {
    type: String,
    default: 'Chargement...'
  },
  color: {
    type: String,
    default: 'blue', // Options: 'blue', 'indigo', 'gray', 'primary'
  }
});

const spinnerColorClass = computed(() => {
  switch (props.color) {
    case 'blue':
      return 'border-blue-500';
    case 'indigo':
      return 'border-indigo-600';
    case 'gray':
      return 'border-gray-400';
    case 'primary': // Utilise une couleur basée sur le thème
      return 'border-current text-indigo-600'; // Utilise 'currentColor' pour border-color
    default:
      return 'border-blue-500';
  }
});
</script>