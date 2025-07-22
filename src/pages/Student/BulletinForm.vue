
<!-- BulletinForm Component -->
<template>
  <form @submit="handleSubmit" class="space-y-6">
    <h2 class="text-lg font-medium text-gray-900">Nouveau bulletin</h2>
    
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Période</label>
        <select
          v-model="formData.period"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        >
          <option value="">Sélectionner</option>
          <option value="Trimestre 1">Trimestre 1</option>
          <option value="Trimestre 2">Trimestre 2</option>
          <option value="Trimestre 3">Trimestre 3</option>
        </select>
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700">Année</label>
        <input
          type="text"
          v-model="formData.year"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>
    </div>

    <div>
      <h3 class="text-md font-medium text-gray-900 mb-3">Notes par matière</h3>
      <div 
        v-for="(subject, index) in formData.subjects" 
        :key="index" 
        class="grid grid-cols-3 gap-4 mb-3"
      >
        <input
          type="text"
          placeholder="Matière"
          v-model="subject.subject"
          class="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        <input
          type="number"
          step="0.1"
          min="0"
          max="20"
          placeholder="Note"
          v-model="subject.grade"
          class="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        <input
          type="number"
          min="1"
          max="10"
          placeholder="Coeff"
          v-model="subject.coefficient"
          class="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">Commentaires</label>
      <textarea
        v-model="formData.comments"
        :rows="3"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      />
    </div>

    <div class="flex justify-end space-x-3">
      <Button variant="outline" @click="$emit('cancel')">
        Annuler
      </Button>
      <Button type="submit" :disabled="loading">
        {{ loading ? 'Ajout...' : 'Ajouter' }}
      </Button>
    </div>
  </form>
</template>

<script setup>
import { reactive } from 'vue'
import Button from '../../components/UI/Button.vue'

const props = defineProps(['loading'])
const emit = defineEmits(['submit', 'cancel'])

const formData = reactive({
  period: '',
  year: '2024',
  subjects: [
    { subject: 'Mathématiques', grade: '', coefficient: 4 },
    { subject: 'Français', grade: '', coefficient: 4 },
    { subject: 'Anglais', grade: '', coefficient: 3 }
  ],
  comments: ''
})

const handleSubmit = (e) => {
  e.preventDefault()
  
  // Calculate average
  const totalPoints = formData.subjects.reduce((sum, subject) => 
    sum + (parseFloat(subject.grade) * subject.coefficient), 0)
  const totalCoeff = formData.subjects.reduce((sum, subject) => 
    sum + subject.coefficient, 0)
  const averageGrade = totalPoints / totalCoeff

  emit('submit', {
    ...formData,
    subjects: formData.subjects.map(s => ({
      ...s, 
      grade: parseFloat(s.grade)
    })),
    averageGrade: Math.round(averageGrade * 100) / 100
  })
}
</script>