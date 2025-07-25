<template>
  <nav class="flex px-4 py-3 rounded-lg bg-gray-50 border border-gray-100 mb-6 text-sm font-medium items-center" aria-label="Breadcrumb">
    <ol class="inline-flex items-center space-x-2">
      <li v-for="(item, index) in items" :key="index" class="inline-flex items-center">
        <template v-if="index === 0">
          <a v-if="item.to" @click.prevent="handleNavigate(item.to)"
             class="inline-flex items-center text-gray-700 hover:text-blue-600 cursor-pointer">
            <HomeIcon v-if="item.icon" class="w-4 h-4 mr-2" />
            {{ item.label }}
          </a>
          <span v-else class="inline-flex items-center text-gray-700">
            <HomeIcon v-if="item.icon" class="w-4 h-4 mr-2" />
            {{ item.label }}
          </span>
        </template>
        <template v-else>
          <svg class="w-3 h-3 text-gray-400 mx-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
          </svg>
          <a v-if="item.to && index < items.length - 1" @click.prevent="handleNavigate(item.to)"
             class="text-gray-700 hover:text-blue-600 cursor-pointer">
            {{ item.label }}
          </a>
          <span v-else class="text-gray-500">
            {{ item.label }}
          </span>
        </template>
      </li>
    </ol>
  </nav>
</template>

<script setup>
import { HomeIcon } from '@heroicons/vue/20/solid';
import { useRouter } from 'vue-router';
import { useConfirm } from '@/composables/useConfirm';

const props = defineProps({
  items: {
    type: Array,
    required: true,
    // Example: [{ label: 'Accueil', to: '/' }, { label: 'Utilisateurs', to: '/users' }, { label: 'Détails' }]
  },
  hasUnsavedChanges: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['navigate-to']); // <--- ADD THIS LINE

const router = useRouter();
const { showConfirm } = useConfirm();

const handleNavigate = async (path) => {
  if (props.hasUnsavedChanges) {
    const confirmed = await showConfirm(
      'Modifications non sauvegardées',
      'Vous avez des modifications non sauvegardées. Êtes-vous sûr de vouloir quitter sans sauvegarder ?',
      'Oui, quitter',
      'Annuler'
    );
    if (!confirmed) {
      return;
    }
  }
  // Emit an event that the parent (UserManagement) can listen to
  emit('navigate-to', path); // Emit the path
};
</script>