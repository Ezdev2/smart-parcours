<template>
  <div class="space-y-6">
    <div class="flex items-center">
      <CogIcon class="h-6 w-6 text-gray-600 mr-2" />
      <h1 class="text-2xl font-bold text-gray-900">Paramètres</h1>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      <span class="ml-2 text-gray-600">Chargement des paramètres...</span>
    </div>

    <div v-if="error" class="bg-red-50 border border-red-200 rounded-md p-4">
      <div class="text-red-800">{{ error }}</div>
    </div>

    <form v-if="!loading" @submit.prevent="handleSubmit" class="space-y-6">
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
              v-model="formData.name"
              placeholder="Entrez le nom de l'établissement"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
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
              required
            />
          </div>
        </div>
      </Card>

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
                v-model="formData.themeColor"
                class="h-10 w-20 rounded-md border border-gray-300"
              />
              <input
                type="text"
                v-model="formData.themeColor"
                class="block w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <div 
                class="h-10 w-20 rounded-md border border-gray-300"
                :style="{ backgroundColor: formData.themeColor }"
              ></div>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">
              Logo de l'établissement (URL)
            </label>
            <div class="mt-1 flex items-center space-x-4">
              <input
                type="url"
                v-model="formData.logoUrl"
                placeholder="https://example.com/logo.png"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <div v-if="formData.logoUrl" class="flex-shrink-0">
                <img 
                  :src="formData.logoUrl" 
                  alt="Logo"
                  class="h-16 w-16 object-contain border border-gray-200 rounded-md"
                  @error="logoError = true"
                  @load="logoError = false"
                />
                <p v-if="logoError" class="text-xs text-red-500 mt-1">Image invalide</p>
              </div>
            </div>
            <p class="mt-1 text-sm text-gray-500">
              Entrez l'URL d'une image (PNG, JPG ou SVG recommandé)
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <h2 class="text-lg font-medium text-gray-900 mb-4">
          Configuration des classes
        </h2>
        
        <div class="space-y-3">
          <div v-for="(classId, index) in formData.classes" :key="index" class="flex items-center space-x-2">
            <div class="flex-1 p-3 bg-gray-50 rounded-md border">
              <span class="font-medium">{{ getClassDisplayName(classId) }}</span>
              <span class="text-sm text-gray-500 ml-2">({{ classId }})</span>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              @click="removeClassFromSettings(index)"
              class="text-red-600 hover:text-red-700"
            >
              Supprimer
            </Button>
          </div>
          
          <div class="flex items-center space-x-2">
            <select
              v-model="selectedNewClass"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Sélectionner une classe à ajouter</option>
              <option 
                v-for="availableClass in availableClasses" 
                :key="availableClass.id" 
                :value="availableClass.id"
              >
                {{ availableClass.name }} ({{ availableClass.level }})
              </option>
            </select>
            <Button
              type="button"
              variant="outline"
              @click="addClassToSettings"
              :disabled="!selectedNewClass"
            >
              Ajouter
            </Button>
          </div>
          
          <div v-if="showNewClassForm" class="border-t pt-4 mt-4">
            <h4 class="text-sm font-medium text-gray-700 mb-2">Créer une nouvelle classe</h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                v-model="newClass.name"
                placeholder="Nom de la classe"
                class="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <select
                v-model="newClass.level"
                class="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Niveau</option>
                <option value="Seconde">Seconde</option>
                <option value="Première">Première</option>
                <option value="Terminale">Terminale</option>
              </select>
              <div class="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  @click="createNewClass"
                  :disabled="!newClass.name || !newClass.level || creatingClass"
                >
                  {{ creatingClass ? 'Création...' : 'Créer' }}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  @click="cancelNewClass"
                >
                  Annuler
                </Button>
              </div>
            </div>
          </div>
          
          <Button
            type="button"
            variant="outline"
            @click="showNewClassForm = !showNewClassForm"
          >
            {{ showNewClassForm ? 'Masquer' : 'Créer une nouvelle classe' }}
          </Button>
        </div>
      </Card>

      <Card>
        <h2 class="text-lg font-medium text-gray-900 mb-4">
          Configuration des matières
        </h2>
        
        <div class="space-y-3">
          <div v-for="(subjectId, index) in formData.subjects" :key="index" class="flex items-center space-x-2">
            <div class="flex-1 p-3 bg-gray-50 rounded-md border">
              <span class="font-medium">{{ getSubjectDisplayName(subjectId) }}</span>
              <span class="text-sm text-gray-500 ml-2">({{ subjectId }})</span>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              @click="removeSubjectFromSettings(index)"
              class="text-red-600 hover:text-red-700"
            >
              Supprimer
            </Button>
          </div>
          
          <div class="flex items-center space-x-2">
            <select
              v-model="selectedNewSubject"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Sélectionner une matière à ajouter</option>
              <option 
                v-for="availableSubject in availableSubjects" 
                :key="availableSubject.id" 
                :value="availableSubject.id"
              >
                {{ availableSubject.name }} ({{ availableSubject.code }})
              </option>
            </select>
            <Button
              type="button"
              variant="outline"
              @click="addSubjectToSettings"
              :disabled="!selectedNewSubject"
            >
              Ajouter
            </Button>
          </div>
          
          <div v-if="showNewSubjectForm" class="border-t pt-4 mt-4">
            <h4 class="text-sm font-medium text-gray-700 mb-2">Créer une nouvelle matière</h4>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
              <input
                type="text"
                v-model="newSubject.name"
                placeholder="Nom de la matière"
                class="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <input
                type="text"
                v-model="newSubject.code"
                placeholder="Code (ex: MATH)"
                class="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <input
                type="number"
                v-model="newSubject.coefficient"
                placeholder="Coefficient"
                min="1"
                max="10"
                class="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <div class="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  @click="createNewSubject"
                  :disabled="!newSubject.name || !newSubject.code || !newSubject.coefficient || creatingSubject"
                >
                  {{ creatingSubject ? 'Création...' : 'Créer' }}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  @click="cancelNewSubject"
                >
                  Annuler
                </Button>
              </div>
            </div>
          </div>
          
          <Button
            type="button"
            variant="outline"
            @click="showNewSubjectForm = !showNewSubjectForm"
          >
            {{ showNewSubjectForm ? 'Masquer' : 'Créer une nouvelle matière' }}
          </Button>
        </div>
      </Card>

      <div class="flex justify-end space-x-3">
        <Button 
          type="button" 
          variant="outline" 
          @click="loadSettings"
          :disabled="saving"
        >
          Annuler les modifications
        </Button>
        <Button type="submit" :disabled="saving || logoError" size="lg">
          <BookmarkIcon class="h-4 w-4 mr-2" />
          {{ saving ? 'Sauvegarde...' : 'Sauvegarder les paramètres' }}
        </Button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { FirebaseService } from '../../services/firebaseService' // Ensure this path is correct
import Card from '../../components/UI/Card.vue'
import Button from '../../components/UI/Button.vue'
import { CogIcon, BookmarkIcon } from '@heroicons/vue/24/outline'

// Stores
const authStore = useAuthStore()

// Reactive data
const loading = ref(true)
const saving = ref(false)
const error = ref(null)
const logoError = ref(false)

// Settings data
const settings = ref(null)
const settingsId = ref(null)

// Form data
const formData = ref({
  name: '',
  academicYear: '',
  themeColor: '#003366',
  logoUrl: '',
  classes: [],
  subjects: []
})

// Classes data
const allClasses = ref([])
const selectedNewClass = ref('')
const showNewClassForm = ref(false)
const creatingClass = ref(false)
const newClass = ref({
  name: '',
  level: '',
  academicYear: '' // This will be set from formData.academicYear
})

// Subjects data
const allSubjects = ref([])
const selectedNewSubject = ref('')
const showNewSubjectForm = ref(false)
const creatingSubject = ref(false)
const newSubject = ref({
  name: '',
  code: '',
  coefficient: 1
})

// Computed properties
const availableClasses = computed(() => {
  return allClasses.value.filter(cls => !formData.value.classes.includes(cls.id))
})

const availableSubjects = computed(() => {
  return allSubjects.value.filter(subject => !formData.value.subjects.includes(subject.id))
})

// Helper functions
const getClassDisplayName = (classId) => {
  const cls = allClasses.value.find(c => c.id === classId)
  return cls ? cls.name : classId
}

const getSubjectDisplayName = (subjectId) => {
  const subject = allSubjects.value.find(s => s.id === subjectId)
  return subject ? subject.name : subjectId
}

// Load initial data
const loadInitialData = async () => {
  try {
    loading.value = true
    error.value = null

    if (!authStore.user || !authStore.user.id) {
      error.value = 'ID administrateur non disponible. Veuillez vous connecter.'
      loading.value = false
      return
    }

    // Load settings using the new service function
    const [settingsData, classesData, subjectsData] = await Promise.all([
      FirebaseService.getOrCreateSettingsForAdmin(authStore.user.id),
      FirebaseService.getAllClasses(), // Assuming this fetches all classes regardless of admin
      FirebaseService.getAllSubjects()  // Assuming this fetches all subjects regardless of admin
    ])

    // Store classes and subjects
    allClasses.value = classesData
    allSubjects.value = subjectsData

    // Handle settings
    if (settingsData) {
      settings.value = settingsData
      settingsId.value = settingsData.id
      formData.value = {
        name: settingsData.name || '',
        academicYear: settingsData.academicYear || '',
        themeColor: settingsData.themeColor || '#003366',
        logoUrl: settingsData.logoUrl || '',
        classes: settingsData.classes || [],
        subjects: settingsData.subjects || []
      }
    } else {
      // This case should ideally not be reached if getOrCreateSettingsForAdmin works as expected
      // but as a fallback, ensure academicYear is set
      formData.value.academicYear = `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`
    }
  } catch (err) {
    console.error('Error loading initial data:', err)
    error.value = 'Erreur lors du chargement des données: ' + err.message
  } finally {
    loading.value = false
  }
}

// Settings operations
const loadSettings = () => {
  if (settings.value) {
    formData.value = {
      name: settings.value.name || '',
      academicYear: settings.value.academicYear || '',
      themeColor: settings.value.themeColor || '#003366',
      logoUrl: settings.value.logoUrl || '',
      classes: [...(settings.value.classes || [])],
      subjects: [...(settings.value.subjects || [])]
    }
  }
}

const handleSubmit = async () => { // Removed 'e' as we're using .prevent
  
  if (!authStore.isAdmin()) {
    error.value = 'Seuls les administrateurs peuvent modifier les paramètres'
    return
  }

  saving.value = true
  error.value = null
  
  try {
    const settingsToSave = {
      name: formData.value.name,
      academicYear: formData.value.academicYear,
      themeColor: formData.value.themeColor,
      logoUrl: formData.value.logoUrl,
      classes: formData.value.classes,
      subjects: formData.value.subjects,
      // Admin ID is handled by the getOrCreate and isn't updated directly here
      // You might want to update it if the admin for the settings can change,
      // but based on your service, it seems linked to creation.
    }

    if (settingsId.value) {
      // Update existing settings
      await FirebaseService.updateSettings(settingsId.value, settingsToSave)
    } else {
      // This scenario should ideally not happen if getOrCreateSettingsForAdmin works correctly
      // as it would have created settingsId. If it does, you'd recreate using the adminId.
      // However, for robustness, you could call getOrCreateSettingsForAdmin again here.
      console.warn("Attempting to save without existing settingsId. This shouldn't happen after initial load.");
      const newSettings = await FirebaseService.getOrCreateSettingsForAdmin(authStore.user.id);
      settingsId.value = newSettings.id;
      // Then update if it was created, or just confirm it exists
      await FirebaseService.updateSettings(settingsId.value, settingsToSave);

    }

    // After successful save, reload settings to ensure UI reflects latest data
    // It's better to fetch the updated document rather than relying on local formData
    const updatedSettings = await FirebaseService.getSettingsById(settingsId.value);
    settings.value = updatedSettings;
    // Also re-sync formData with the freshly fetched data
    if (updatedSettings) {
      formData.value = {
        name: updatedSettings.name || '',
        academicYear: updatedSettings.academicYear || '',
        themeColor: updatedSettings.themeColor || '#003366',
        logoUrl: updatedSettings.logoUrl || '',
        classes: updatedSettings.classes || [],
        subjects: updatedSettings.subjects || []
      };
    }

    alert('Paramètres sauvegardés avec succès !')
  } catch (err) {
    console.error('Error saving settings:', err)
    error.value = 'Erreur lors de la sauvegarde: ' + err.message
  } finally {
    saving.value = false
  }
}

// Class management
const addClassToSettings = () => {
  if (selectedNewClass.value && !formData.value.classes.includes(selectedNewClass.value)) {
    formData.value.classes.push(selectedNewClass.value)
    selectedNewClass.value = ''
  }
}

const removeClassFromSettings = (index) => {
  formData.value.classes.splice(index, 1)
}

const createNewClass = async () => {
  if (!newClass.value.name || !newClass.value.level) return

  creatingClass.value = true
  try {
    const classData = {
      name: newClass.value.name,
      level: newClass.value.level,
      // Ensure academicYear is passed
      academicYear: formData.value.academicYear || `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`
    }

    const newClassId = await FirebaseService.createClass(classData)
    
    // Add to local classes list
    const newClassObj = {
      id: newClassId,
      ...classData,
      createdAt: new Date() // Client-side timestamp for immediate display
    }
    allClasses.value.push(newClassObj)
    
    // Add to settings
    formData.value.classes.push(newClassId)
    
    // Reset form
    cancelNewClass()
    
    alert('Classe créée et ajoutée avec succès !')
  } catch (err) {
    console.error('Error creating class:', err)
    error.value = 'Erreur lors de la création de la classe: ' + err.message
  } finally {
    creatingClass.value = false
  }
}

const cancelNewClass = () => {
  showNewClassForm.value = false
  newClass.value = {
    name: '',
    level: '',
    academicYear: ''
  }
}

// Subject management
const addSubjectToSettings = () => {
  if (selectedNewSubject.value && !formData.value.subjects.includes(selectedNewSubject.value)) {
    formData.value.subjects.push(selectedNewSubject.value)
    selectedNewSubject.value = ''
  }
}

const removeSubjectFromSettings = (index) => {
  formData.value.subjects.splice(index, 1)
}

const createNewSubject = async () => {
  if (!newSubject.value.name || !newSubject.value.code || !newSubject.value.coefficient) return

  creatingSubject.value = true
  try {
    const subjectData = {
      name: newSubject.value.name,
      code: newSubject.value.code.toUpperCase(),
      coefficient: parseInt(newSubject.value.coefficient)
    }

    const newSubjectId = await FirebaseService.createSubject(subjectData)
    
    // Add to local subjects list
    const newSubjectObj = {
      id: newSubjectId,
      ...subjectData
    }
    allSubjects.value.push(newSubjectObj)
    
    // Add to settings
    formData.value.subjects.push(newSubjectId)
    
    // Reset form
    cancelNewSubject()
    
    alert('Matière créée et ajoutée avec succès !')
  } catch (err) {
    console.error('Error creating subject:', err)
    error.value = 'Erreur lors de la création de la matière: ' + err.message
  } finally {
    creatingSubject.value = false
  }
}

const cancelNewSubject = () => {
  showNewSubjectForm.value = false
  newSubject.value = {
    name: '',
    code: '',
    coefficient: 1
  }
}

// Lifecycle
onMounted(() => {
  loadInitialData()
})
</script>
