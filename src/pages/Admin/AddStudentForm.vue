<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <h2 class="text-lg font-medium text-gray-900">
      {{ mode === 'add' ? 'Ajouter un nouvel étudiant' : 'Modifier l\'étudiant' }}
    </h2>
    
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Prénom</label>
        <input
          type="text"
          required
          v-model="formData.firstName"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Nom</label>
        <input
          type="text"
          required
          v-model="formData.lastName"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">Email</label>
      <input
        type="email"
        required
        v-model="formData.email"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">Date de naissance</label>
      <input
        type="date"
        v-model="formData.dateOfBirth"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">Classe</label>
      <select
        required
        v-model="formData.class"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      >
        <option value="">Sélectionner une classe</option>
        <option 
          v-for="classe in classesFromSettings" 
          :key="classe.id" 
          :value="classe.id"
        >
          {{ classe.name }} ({{ classe.level }})
        </option>
      </select>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">Moyenne générale (optionnel)</label>
      <input
        type="number"
        step="0.1"
        min="0"
        max="20"
        v-model.number="formData.averageGrade"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">Code d'inscription</label>
      <div class="mt-1 flex rounded-md shadow-sm">
        <input
          type="text"
          readonly
          v-model="formData.registrationCode"
          class="block w-full rounded-l-md border-gray-300 bg-gray-50 text-gray-500"
        />
        <button
          type="button"
          @click="generateNewCode"
          :disabled="mode === 'edit'"
          class="relative -ml-px inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100"
        >
          Générer
        </button>
      </div>
      <p v-if="mode === 'edit'" class="mt-1 text-xs text-gray-500">Le code d'inscription ne peut pas être modifié.</p>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Filières d'intérêt (optionnel)</label>
      <div class="grid grid-cols-2 gap-3">
        <label
          v-for="filiere in availableFilieres"
          :key="filiere.value"
          class="flex items-center"
        >
          <input
            type="checkbox"
            :checked="formData.filieres.includes(filiere.value)"
            @change="toggleFiliere(filiere.value)"
            class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span class="ml-2 text-sm text-gray-900">{{ filiere.label }}</span>
        </label>
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Centres d'intérêt (optionnel)</label>
      <div class="grid grid-cols-2 gap-3">
        <label
          v-for="interest in availableInterests"
          :key="interest.value"
          class="flex items-center"
        >
          <input
            type="checkbox"
            :checked="formData.interests.includes(interest.value)"
            @change="toggleInterest(interest.value)"
            class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span class="ml-2 text-sm text-gray-900">{{ interest.label }}</span>
        </label>
      </div>
    </div>

    <div class="flex justify-end space-x-3">
      <Button variant="outline" @click="$emit('cancel')">
        Annuler
      </Button>
      <Button type="submit">
        {{ mode === 'add' ? 'Ajouter l\'étudiant' : 'Sauvegarder les modifications' }}
      </Button>
    </div>
  </form>
</template>

<script setup>
import { ref, watch, reactive } from 'vue'
import Button from '../../components/UI/Button.vue'
import { availableFilieres } from '../../assets/data/dataFiliere.js' // Adjust path if necessary
import { availableInterests } from '../../assets/data/dataInterest.js' // Adjust path if necessary

const props = defineProps({
  generateCode: {
    type: Function,
    required: true
  },
  initialData: { // For edit mode
    type: Object,
    default: null
  },
  mode: {
    type: String,
    default: 'add', // 'add' or 'edit'
    validator: (value) => ['add', 'edit'].includes(value)
  },
  classesFromSettings: { // Pass available classes from parent
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['submit', 'cancel'])

const formData = reactive({
  firstName: '',
  lastName: '',
  email: '',
  dateOfBirth: '', // Add dateOfBirth
  class: '',      // Will store class ID
  averageGrade: null, // Add averageGrade
  registrationCode: props.generateCode(),
  filieres: [],
  interests: []
})

const formatDateForInput = (dateValue) => {
  if (!dateValue) return ''
  
  let date
  if (dateValue.seconds) {
    date = new Date(dateValue.seconds * 1000)
  } else if (typeof dateValue === 'string') {
    date = new Date(dateValue)
  } else if (dateValue instanceof Date) {
    date = dateValue
  } else {
    return ''
  }
  return date.toISOString().split('T')[0]
}

watch(() => props.initialData, (newVal) => {
  if (newVal && props.mode === 'edit') {
    formData.firstName = newVal.profile?.firstName || '';
    formData.lastName = newVal.profile?.lastName || '';
    formData.email = newVal.email || '';
    formData.dateOfBirth = formatDateForInput(newVal.profile?.dateOfBirth) || '';
    formData.class = newVal.profile?.class || ''; // It's an ID
    formData.averageGrade = newVal.profile?.averageGrade || null;
    formData.registrationCode = newVal.profile?.registrationCode || props.generateCode(); // Should not change in edit mode
    formData.filieres = [...(newVal.profile?.filieres || [])];
    formData.interests = [...(newVal.profile?.interests || [])];
  } else {
    // Reset for add mode
    formData.firstName = '';
    formData.lastName = '';
    formData.email = '';
    formData.dateOfBirth = '';
    formData.class = '';
    formData.averageGrade = null;
    formData.registrationCode = props.generateCode();
    formData.filieres = [];
    formData.interests = [];
  }
}, { immediate: true });


const handleSubmit = () => {
  emit('submit', formData, props.mode)
}

const generateNewCode = () => {
  if (props.mode === 'add') { // Only generate in add mode
    formData.registrationCode = props.generateCode()
  }
}

const toggleFiliere = (filiere) => {
  const index = formData.filieres.indexOf(filiere)
  if (index > -1) {
    formData.filieres.splice(index, 1)
  } else {
    formData.filieres.push(filiere)
  }
}

const toggleInterest = (interest) => {
  const index = formData.interests.indexOf(interest)
  if (index > -1) {
    formData.interests.splice(index, 1)
  } else {
    formData.interests.push(interest)
  }
}
</script>