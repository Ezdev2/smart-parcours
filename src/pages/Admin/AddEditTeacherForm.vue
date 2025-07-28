<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <Card class="relative w-full max-w-lg p-6 overflow-y-auto max-h-[90vh]">
      <button @click="$emit('cancel')" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
        <XMarkIcon class="h-6 w-6" />
      </button>
      <h2 class="text-xl font-bold mb-4">{{ mode === 'add' ? 'Ajouter un nouvel enseignant' : 'Modifier l\'enseignant' }}</h2>
      
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Prénom</label>
            <input 
              type="text" 
              v-model="formData.firstName" 
              required
              placeholder="Entrez le prénom"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Nom</label>
            <input 
              type="text" 
              v-model="formData.lastName" 
              required
              placeholder="Entrez le nom de famille"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <input 
            type="email" 
            v-model="formData.email" 
            required
            :readonly="mode === 'edit'"
            :placeholder="mode === 'add' ? 'exemple@ecole.com' : ''"
            :class="{
              'bg-gray-100 cursor-not-allowed': mode === 'edit',
              'focus:border-blue-500 focus:ring-blue-500': mode === 'add'
            }"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
          <p v-if="mode === 'edit'" class="mt-1 text-xs text-gray-500">L'email ne peut pas être modifié.</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Classes assignées (Optionnel)</label>
          <p class="text-xs text-gray-500 mb-2">Sélectionnez les classes dont cet enseignant est responsable pour la saisie des bulletins.</p>
          
          <div v-if="allClasses.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto border rounded-md p-3 bg-gray-50">
            <label v-for="classe in allClasses" :key="classe.id" class="flex items-center text-sm text-gray-900 cursor-pointer hover:bg-gray-100 p-1 rounded">
              <input 
                type="checkbox"
                :value="classe.id"
                v-model="formData.classes"
                class="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500" />
              <span class="ml-2">{{ classe.name }} ({{ classe.level }})</span>
            </label>
          </div>
          
          <div v-else class="border rounded-md p-4 bg-gray-50 text-center">
            <p class="text-sm text-gray-500">
              Aucune classe disponible. Veuillez les ajouter dans les paramètres de l'établissement.
            </p>
          </div>
          
          <p v-if="formData.classes.length > 0" class="mt-2 text-xs text-green-600">
            {{ formData.classes.length }} classe(s) sélectionnée(s)
          </p>
        </div>

        <div class="flex justify-end space-x-3 pt-4">
          <Button variant="outline" @click="$emit('cancel')">Annuler</Button>
          <Button type="submit" :disabled="!isFormValid">
            {{ mode === 'add' ? 'Ajouter l\'enseignant' : 'Sauvegarder' }}
          </Button>
        </div>
      </form>
    </Card>
  </div>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue';
import Card from '../../components/UI/Card.vue';
import Button from '../../components/UI/Button.vue';
import { XMarkIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
  initialData: {
    type: Object,
    default: null
  },
  mode: {
    type: String,
    default: 'add',
    validator: (value) => ['add', 'edit'].includes(value)
  },
  allClasses: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['submit', 'cancel']);

const formData = reactive({
  firstName: '',
  lastName: '',
  email: '',
  classes: []
});

// Computed pour valider le formulaire
const isFormValid = computed(() => {
  return formData.firstName.trim() !== '' && 
         formData.lastName.trim() !== '' && 
         formData.email.trim() !== '' &&
         /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email); // Validation email basique
});

// Watcher pour charger les données initiales
watch([() => props.initialData, () => props.mode], ([newData, newMode]) => {
  console.log('Props changed:', { newData, newMode }); // Debug
  
  if (newData && newMode === 'edit') {
    // Mode édition : charger les données existantes
    formData.firstName = newData.profile?.firstName || '';
    formData.lastName = newData.profile?.lastName || '';
    formData.email = newData.email || '';
    formData.classes = [...(newData.profile?.classes || [])];
    
    console.log('Loaded form data for edit:', formData); // Debug
  } else if (newMode === 'add') {
    // Mode ajout : réinitialiser le formulaire
    formData.firstName = '';
    formData.lastName = '';
    formData.email = '';
    formData.classes = [];
    
    console.log('Reset form data for add mode'); // Debug
  }
}, { immediate: true, deep: true });

const handleSubmit = () => {
  if (!isFormValid.value) {
    console.warn('Form is not valid');
    return;
  }
  
  console.log('Submitting form data:', formData); // Debug
  emit('submit', { ...formData }, props.mode);
};
</script>