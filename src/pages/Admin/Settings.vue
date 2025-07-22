<template>
  <div class="space-y-6">
    <div class="flex items-center">
      <CogIcon class="h-6 w-6 text-gray-600 mr-2" />
      <h1 class="text-2xl font-bold text-gray-900">Paramètres</h1>
    </div>

    <form @submit="handleSubmit" class="space-y-6">
      <!-- School Information -->
      <Card>
        <h2 class="text-lg font-medium text-gray-900 mb-4">
          Informations de l'établissement
        </h2>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">
              Nom de l'établissement
            </label>
            <input
              type="text"
              v-model="formData.schoolName"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">
              Année académique
            </label>
            <input
              type="text"
              v-model="formData.academicYear"
              placeholder="2024-2025"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </Card>

      <!-- Branding -->
      <Card>
        <h2 class="text-lg font-medium text-gray-900 mb-4">
          Personnalisation
        </h2>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">
              Couleur principale
            </label>
            <div class="mt-1 flex items-center space-x-4">
              <input
                type="color"
                v-model="formData.brandColor"
                class="h-10 w-20 rounded-md border border-gray-300"
              />
              <input
                type="text"
                v-model="formData.brandColor"
                class="block w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <div 
                class="h-10 w-20 rounded-md border border-gray-300"
                :style="{ backgroundColor: formData.brandColor }"
              ></div>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">
              Logo de l'établissement
            </label>
            <div class="mt-1">
              <input
                type="file"
                accept="image/*"
                class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p class="mt-1 text-sm text-gray-500">
                Format recommandé: PNG ou SVG, taille maximale 2MB
              </p>
            </div>
          </div>
        </div>
      </Card>

      <!-- Classes Configuration -->
      <Card>
        <h2 class="text-lg font-medium text-gray-900 mb-4">
          Configuration des classes
        </h2>
        
        <div class="space-y-3">
          <div v-for="(className, index) in formData.classes" :key="index" class="flex items-center space-x-2">
            <input
              type="text"
              :value="className"
              @input="updateClass(index, $event.target.value)"
              placeholder="Nom de la classe"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              @click="removeClass(index)"
            >
              Supprimer
            </Button>
          </div>
          <Button
            type="button"
            variant="outline"
            @click="addClass"
          >
            Ajouter une classe
          </Button>
        </div>
      </Card>

      <!-- Subjects Configuration -->
      <Card>
        <h2 class="text-lg font-medium text-gray-900 mb-4">
          Configuration des matières
        </h2>
        
        <div class="space-y-3">
          <div v-for="(subject, index) in formData.subjects" :key="index" class="flex items-center space-x-2">
            <input
              type="text"
              :value="subject"
              @input="updateSubject(index, $event.target.value)"
              placeholder="Nom de la matière"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              @click="removeSubject(index)"
            >
              Supprimer
            </Button>
          </div>
          <Button
            type="button"
            variant="outline"
            @click="addSubject"
          >
            Ajouter une matière
          </Button>
        </div>
      </Card>

      <!-- Save Button -->
      <div class="flex justify-end">
        <Button type="submit" :disabled="saving" size="lg">
          <BookmarkIcon class="h-4 w-4 mr-2" />
          {{ saving ? 'Sauvegarde...' : 'Sauvegarder les paramètres' }}
        </Button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAppStore } from '../../stores/app'
import Card from '../../components/UI/Card.vue'
import Button from '../../components/UI/Button.vue'
import { CogIcon, BookmarkIcon } from '@heroicons/vue/24/outline'

const { settings, setSettings } = useAppStore()
const formData = ref({ ...settings })
const saving = ref(false)

const handleSubmit = async (e) => {
  e.preventDefault()
  saving.value = true
  
  try {
    // Here you would save to Firestore
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
    setSettings(formData.value)
    alert('Paramètres sauvegardés avec succès !')
  } catch (error) {
    console.error('Error saving settings:', error)
    alert('Erreur lors de la sauvegarde')
  } finally {
    saving.value = false
  }
}

const addSubject = () => {
  formData.value = {
    ...formData.value,
    subjects: [...formData.value.subjects, '']
  }
}

const updateSubject = (index, value) => {
  const newSubjects = [...formData.value.subjects]
  newSubjects[index] = value
  formData.value = {
    ...formData.value,
    subjects: newSubjects
  }
}

const removeSubject = (index) => {
  const newSubjects = formData.value.subjects.filter((_, i) => i !== index)
  formData.value = {
    ...formData.value,
    subjects: newSubjects
  }
}

const addClass = () => {
  formData.value = {
    ...formData.value,
    classes: [...formData.value.classes, '']
  }
}

const updateClass = (index, value) => {
  const newClasses = [...formData.value.classes]
  newClasses[index] = value
  formData.value = {
    ...formData.value,
    classes: newClasses
  }
}

const removeClass = (index) => {
  const newClasses = formData.value.classes.filter((_, i) => i !== index)
  formData.value = {
    ...formData.value,
    classes: newClasses
  }
}
</script>