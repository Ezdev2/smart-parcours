<template>
  <div class="space-y-6">
    <div class="flex items-center">
      <CogIcon class="h-6 w-6 text-gray-600 mr-2" />
      <h1 class="text-2xl font-bold text-gray-900">Paramètres de l'Établissement</h1>
    </div>

    <LoadingSpinner v-if="loading" text="Chargement des paramètres..." color="indigo" class="my-8" />

    <div v-if="error" class="bg-red-50 border border-red-200 rounded-md p-4">
      <div class="text-red-800">{{ error }}</div>
    </div>

    <div v-else class="space-y-6">
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex space-x-8" aria-label="Tabs">
          <a v-for="tab in settingsTabs" :key="tab.id"
             @click="activeSettingsTab = tab.id"
             :class="[
               activeSettingsTab === tab.id
                 ? 'border-blue-500 text-blue-600'
                 : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
               'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm cursor-pointer'
             ]">
            {{ tab.name }}
          </a>
        </nav>
      </div>

      <template v-if="activeSettingsTab === 'general'">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <Card>
            <h2 class="text-lg font-medium text-gray-900 mb-4">
              Informations Générales
            </h2>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  Nom de l'établissement
                </label>
                <input type="text" v-model="formData.name" placeholder="Entrez le nom de l'établissement"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  Année académique
                </label>
                <input type="text" v-model="formData.academicYear" placeholder="2024-2025"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required />
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
                  <input type="color" v-model="formData.themeColor"
                    class="h-10 w-20 rounded-md border border-gray-300" />
                  <input type="text" v-model="formData.themeColor"
                    class="block w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                  <div class="h-10 w-20 rounded-md border border-gray-300"
                    :style="{ backgroundColor: formData.themeColor }"></div>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  Logo de l'établissement (URL)
                </label>
                <div class="mt-1 flex items-center space-x-4">
                  <input type="url" v-model="formData.logoUrl" placeholder="https://example.com/logo.png"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                  <div v-if="formData.logoUrl" class="flex-shrink-0">
                    <img :src="formData.logoUrl" alt="Logo" class="h-16 w-16 object-contain border border-gray-200 rounded-md"
                      @error="logoError = true" @load="logoError = false" />
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
                <Button type="button" variant="outline" size="sm" @click="removeClassFromSettings(index)"
                  class="text-red-600 hover:text-red-700">
                  Supprimer
                </Button>
              </div>
              <div class="flex items-center space-x-2">
                <select v-model="selectedNewClass"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                  <option value="">Sélectionner une classe à ajouter</option>
                  <option v-for="availableClass in availableClasses" :key="availableClass.id" :value="availableClass.id">
                    {{ availableClass.name }} ({{ availableClass.level }})
                  </option>
                </select>
                <Button type="button" variant="outline" @click="addClassToSettings" :disabled="!selectedNewClass">
                  Ajouter
                </Button>
              </div>
              <div v-if="showNewClassForm" class="border-t pt-4 mt-4">
                <h4 class="text-sm font-medium text-gray-700 mb-2">Créer une nouvelle classe</h4>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input type="text" v-model="newClass.name" placeholder="Nom de la classe"
                    class="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                  <select v-model="newClass.level"
                    class="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                    <option value="">Niveau</option>
                    <option value="Seconde">Seconde</option>
                    <option value="Première">Première</option>
                    <option value="Terminale">Terminale</option>
                  </select>
                  <div class="flex space-x-2">
                    <Button type="button" variant="outline" size="sm" @click="createNewClass"
                      :disabled="!newClass.name || !newClass.level || creatingClass">
                      {{ creatingClass ? 'Création...' : 'Créer' }}
                    </Button>
                    <Button type="button" variant="outline" size="sm" @click="cancelNewClass">
                      Annuler
                    </Button>
                  </div>
                </div>
              </div>
              <Button type="button" variant="outline" @click="showNewClassForm = !showNewClassForm">
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
                <Button type="button" variant="outline" size="sm" @click="removeSubjectFromSettings(index)"
                  class="text-red-600 hover:text-red-700">
                  Supprimer
                </Button>
              </div>
              <div class="flex items-center space-x-2">
                <select v-model="selectedNewSubject"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                  <option value="">Sélectionner une matière à ajouter</option>
                  <option v-for="availableSubject in availableSubjects" :key="availableSubject.id"
                    :value="availableSubject.id">
                    {{ availableSubject.name }} ({{ availableSubject.code }})
                  </option>
                </select>
                <Button type="button" variant="outline" @click="addSubjectToSettings" :disabled="!selectedNewSubject">
                  Ajouter
                </Button>
              </div>
              <div v-if="showNewSubjectForm" class="border-t pt-4 mt-4">
                <h4 class="text-sm font-medium text-gray-700 mb-2">Créer une nouvelle matière</h4>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <input type="text" v-model="newSubject.name" placeholder="Nom de la matière"
                    class="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                  <input type="text" v-model="newSubject.code" placeholder="Code (ex: MATH)"
                    class="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                  <input type="number" v-model="newSubject.coefficient" placeholder="Coefficient" min="1" max="10"
                    class="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                  <div class="flex space-x-2">
                    <Button type="button" variant="outline" size="sm" @click="createNewSubject"
                      :disabled="!newSubject.name || !newSubject.code || !newSubject.coefficient || creatingSubject">
                      {{ creatingSubject ? 'Création...' : 'Créer' }}
                    </Button>
                    <Button type="button" variant="outline" size="sm" @click="cancelNewSubject">
                      Annuler
                    </Button>
                  </div>
                </div>
              </div>
              <Button type="button" variant="outline" @click="showNewSubjectForm = !showNewSubjectForm">
                {{ showNewSubjectForm ? 'Masquer' : 'Créer une nouvelle matière' }}
              </Button>
            </div>
          </Card>

          <div class="flex justify-end space-x-3">
            <Button type="button" variant="outline" @click="loadSettings" :disabled="saving">
              Annuler les modifications
            </Button>
            <Button type="submit" :disabled="saving || logoError" size="lg">
              <BookmarkIcon class="h-4 w-4 mr-2" />
              {{ saving ? 'Sauvegarde...' : 'Sauvegarder les paramètres' }}
            </Button>
          </div>
        </form>
      </template>

      <template v-else-if="activeSettingsTab === 'teachers'">
        <TeachersSettings /> </template>

    </div>
    <ConfirmDialog />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { FirebaseService } from '../../services/firebaseService'
import Card from '../../components/UI/Card.vue'
import Button from '../../components/UI/Button.vue'
import LoadingSpinner from '../../components/UI/LoadingSpinner.vue'
import ConfirmDialog from '../../components/UI/ConfirmDialog.vue'
import TeachersSettings from './TeachersSettings.vue'
import { useConfirm } from '../../composables/useConfirm'

import { CogIcon, BookmarkIcon, PlusIcon } from '@heroicons/vue/24/outline'

// Stores
const authStore = useAuthStore()
const { showConfirm, showAlert } = useConfirm()

// Reactive data
const loading = ref(true)
const saving = ref(false)
const error = ref(null)
const logoError = ref(false)

// Settings data
const settings = ref(null)
const settingsId = ref(null)

// Form data for general settings
const formData = ref({
  name: '',
  academicYear: '',
  themeColor: '#003366',
  logoUrl: '',
  classes: [],
  subjects: [],
  teachers: [] // <<< NEW: Add teachers array to form data >>>
})

// Classes data
const availableClasses = ref([]) // All classes in the system, for selection
const selectedNewClass = ref('')
const showNewClassForm = ref(false)
const creatingClass = ref(false)
const newClass = ref({
  name: '',
  level: '',
  academicYear: ''
})

// Subjects data
const availableSubjects = ref([]) // All subjects in the system, for selection
const selectedNewSubject = ref('')
const showNewSubjectForm = ref(false)
const creatingSubject = ref(false)
const newSubject = ref({
  name: '',
  code: '',
  coefficient: 1
})

// Tabs management
const activeSettingsTab = ref('general') // 'general', 'teachers'
const settingsTabs = [
  { id: 'general', name: 'Général' },
  { id: 'teachers', name: 'Enseignants' }, // NEW Tab
]

// Computed properties
const getClassDisplayName = (classId) => {
  const cls = availableClasses.value.find(c => c.id === classId)
  return cls ? cls.name : classId
}

const getSubjectDisplayName = (subjectId) => {
  const subject = availableSubjects.value.find(s => s.id === subjectId)
  return subject ? subject.name : subjectId
}

// --- Load initial data ---
const loadInitialData = async () => {
  try {
    loading.value = true
    error.value = null

    if (!authStore.user || !authStore.user.id) {
      error.value = 'Seuls les administrateurs peuvent accéder aux paramètres'
      return
    }

    // Load settings, all classes, and all subjects in parallel
    const [settingsData, classesData, subjectsData] = await Promise.all([
      FirebaseService.getOrCreateSettingsForAdmin(authStore.user.id),
      FirebaseService.getAllClasses(), // Get all classes in system
      FirebaseService.getAllSubjects() // Get all subjects in system
    ])

    // Store fetched classes and subjects
    availableClasses.value = classesData
    availableSubjects.value = subjectsData

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
        subjects: settingsData.subjects || [],
        teachers: settingsData.teachers || [] // <<< NEW: Populate teachers array >>>
      }
    } else {
      // Initialize with default values for new settings
      formData.value.academicYear = new Date().getFullYear() + '-' + (new Date().getFullYear() + 1)
      formData.value.teachers = [] // Ensure default is empty array
    }
  } catch (err) {
    console.error('Error loading initial data:', err)
    showAlert('Erreur', 'Erreur lors du chargement des données: ' + err.message, 'Compris')
    error.value = 'Erreur lors du chargement des données: ' + err.message
  } finally {
    loading.value = false
  }
}

// --- Settings operations ---
const loadSettings = () => {
  if (settings.value) {
    formData.value = {
      name: settings.value.name || '',
      academicYear: settings.value.academicYear || '',
      themeColor: settings.value.themeColor || '#003366',
      logoUrl: settings.value.logoUrl || '',
      classes: [...(settings.value.classes || [])],
      subjects: [...(settings.value.subjects || [])],
      teachers: [...(settings.value.teachers || [])] // <<< NEW: Populate teachers array on reset >>>
    }
  }
}

const handleSubmit = async () => {
  if (!authStore.user?.role === 'admin') {
    showAlert('Accès refusé', 'Seuls les administrateurs peuvent modifier les paramètres', 'Ok')
    return
  }

  saving.value = true
  error.value = null

  try {
    const settingsData = {
      name: formData.value.name,
      admin: authStore.user.id,
      academicYear: formData.value.academicYear,
      themeColor: formData.value.themeColor,
      logoUrl: formData.value.logoUrl,
      classes: formData.value.classes,
      subjects: formData.value.subjects,
      teachers: formData.value.teachers // <<< NEW: Save teachers array >>>
    }

    if (settingsId.value) {
      await FirebaseService.updateSettings(settingsId.value, settingsData)
    } else {
      const newSettings = await FirebaseService.getOrCreateSettingsForAdmin(authStore.user.id);
      settingsId.value = newSettings.id;
      await FirebaseService.updateSettings(settingsId.value, settingsData);
    }

    const updatedSettings = await FirebaseService.getSettingsById(settingsId.value);
    settings.value = updatedSettings;
    showAlert('Succès', 'Paramètres sauvegardés avec succès !', 'Super')
  } catch (err) {
    console.error('Error saving settings:', err)
    showAlert('Erreur', 'Erreur lors de la sauvegarde: ' + err.message, 'Compris')
  } finally {
    saving.value = false
  }
}

// --- Class management (remain unchanged) ---
const addClassToSettings = async () => {
  if (selectedNewClass.value && !formData.value.classes.includes(selectedNewClass.value)) {
    formData.value.classes.push(selectedNewClass.value)
    selectedNewClass.value = ''
  }
}

const removeClassFromSettings = (index) => {
  formData.value.classes.splice(index, 1)
}

const createNewClass = async () => {
  if (!newClass.value.name || !newClass.value.level) return;
  creatingClass.value = true;
  try {
    const classData = {
      name: newClass.value.name,
      level: newClass.value.level,
      academicYear: formData.value.academicYear || `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`
    };
    const newClassId = await FirebaseService.createClass(classData);
    const newClassObj = { id: newClassId, ...classData, createdAt: new Date() };
    availableClasses.value.push(newClassObj);
    formData.value.classes.push(newClassId); // Add to settings list
    cancelNewClass();
    showAlert('Succès', 'Classe créée et ajoutée avec succès !', 'Ok');
  } catch (err) {
    console.error('Error creating class:', err);
    showAlert('Erreur', 'Erreur lors de la création de la classe: ' + err.message, 'Compris');
  } finally {
    creatingClass.value = false;
  }
};

const cancelNewClass = () => {
  showNewClassForm.value = false;
  newClass.value = { name: '', level: '', academicYear: '' };
};

// --- Subject management (remain unchanged) ---
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
  if (!newSubject.value.name || !newSubject.value.code || !newSubject.value.coefficient) return;
  creatingSubject.value = true;
  try {
    const subjectData = {
      name: newSubject.value.name,
      code: newSubject.value.code.toUpperCase(),
      coefficient: parseInt(newSubject.value.coefficient)
    };
    const newSubjectId = await FirebaseService.createSubject(subjectData);
    const newSubjectObj = { id: newSubjectId, ...subjectData };
    availableSubjects.value.push(newSubjectObj);
    formData.value.subjects.push(newSubjectId); // Add to settings list
    cancelNewSubject();
    showAlert('Succès', 'Matière créée et ajoutée avec succès !', 'Ok');
  } catch (err) {
    console.error('Error creating subject:', err);
    showAlert('Erreur', 'Erreur lors de la création de la matière: ' + err.message, 'Compris');
  } finally {
    creatingSubject.value = false;
  }
};

const cancelNewSubject = () => {
  showNewSubjectForm.value = false;
  newSubject.value = { name: '', code: '', coefficient: 1 };
};

// --- Lifecycle ---
onMounted(() => {
  loadInitialData()
})
</script>
