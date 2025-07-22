<template>
  <form @submit="handleSubmit" class="space-y-6">
    <h2 class="text-lg font-medium text-gray-900">Ajouter un nouvel étudiant</h2>
    
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
      <label class="block text-sm font-medium text-gray-700">Classe</label>
      <select
        required
        v-model="formData.class"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      >
        <option value="">Sélectionner une classe</option>
        <option v-for="className in classes" :key="className" :value="className">
          {{ className }}
        </option>
      </select>
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
          class="relative -ml-px inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100"
        >
          Générer
        </button>
      </div>
    </div>

    <div class="flex justify-end space-x-3">
      <Button variant="outline" @click="$emit('cancel')">
        Annuler
      </Button>
      <Button type="submit">
        Ajouter l'étudiant
      </Button>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import Button from '../../components/UI/Button.vue'

const props = defineProps({
  generateCode: {
    type: Function,
    required: true
  }
})

const emit = defineEmits(['submit', 'cancel'])

const formData = ref({
  firstName: '',
  lastName: '',
  email: '',
  class: '',
  registrationCode: props.generateCode()
})

const classes = [
  '6ème', '5ème', '4ème', '3ème', 
  'Seconde', 'Première S', 'Première ES', 'Première L', 
  'Terminale S', 'Terminale ES', 'Terminale L'
]

const handleSubmit = (e) => {
  e.preventDefault()
  emit('submit', formData.value)
}

const generateNewCode = () => {
  formData.value.registrationCode = props.generateCode()
}
</script>