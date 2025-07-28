<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900">Mon Profil</h1>
      <Button @click="toggleEditing" :disabled="loading">
        {{ editing ? 'Annuler' : 'Modifier' }}
      </Button>
    </div>

    <LoadingSpinner v-if="loading" text="Chargement de votre tableau de bord..." color="indigo" class="my-8" />

    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {{ error }}
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <h2 class="text-lg font-medium text-gray-900 mb-4">
          Informations personnelles
        </h2>

        <form v-if="editing" @submit.prevent="handleSubmit" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">
                Prénom
              </label>
              <input
                type="text"
                v-model="formData.firstName"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">
                Nom
              </label>
              <input
                type="text"
                v-model="formData.lastName"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              Date de naissance
            </label>
            <input
              type="date"
              v-model="formData.dateOfBirth"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              Classe
            </label>
            <select
              v-model="formData.class"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Sélectionner une classe</option>
              <option 
                v-for="classe in availableClasses" 
                :key="classe.id" 
                :value="classe.id"
              >
                {{ classe.name }} ({{ classe.level }})
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              Moyenne générale
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="20"
              v-model.number="formData.averageGrade"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <Button type="submit" :disabled="submitting">
            {{ submitting ? 'Sauvegarde...' : 'Sauvegarder' }}
          </Button>
        </form>

        <div v-else class="space-y-4">
          <div>
            <span class="text-sm font-medium text-gray-500">
              Nom complet
            </span>
            <p class="text-gray-900">
              {{ user?.profile?.firstName }} {{ user?.profile?.lastName }}
            </p>
          </div>
          <div>
            <span class="text-sm font-medium text-gray-500">Email</span>
            <p class="text-gray-900">{{ user?.email }}</p>
          </div>
          <div>
            <span class="text-sm font-medium text-gray-500">
              Date de naissance
            </span>
            <p class="text-gray-900">
              {{ formatDate(user?.profile?.dateOfBirth) }}
            </p>
          </div>
          <div>
            <span class="text-sm font-medium text-gray-500">
              Classe
            </span>
            <p class="text-gray-900">{{ getClassDisplayName(user?.profile?.class) }}</p>
          </div>
          <div v-if="user?.profile?.school">
            <span class="text-sm font-medium text-gray-500">
              École
            </span>
            <p class="text-gray-900">{{ schoolName }}</p>
          </div>
        </div>
      </Card>

      <Card>
        <h2 class="text-lg font-medium text-gray-900 mb-4">
          Informations académiques
        </h2>

        <div class="space-y-4">
          <div>
            <span class="text-sm font-medium text-gray-500">
              Moyenne générale
            </span>
            <p class="text-2xl font-bold text-blue-600">
              {{ user?.profile?.averageGrade ? `${user.profile.averageGrade}/20` : 'Non renseignée' }}
            </p>
          </div>
          <div>
            <span class="text-sm font-medium text-gray-500">Niveau</span>
            <p class="text-gray-900">{{ user?.profile?.level || 'Non défini' }}</p>
          </div>

          <div v-if="user?.profile?.registrationCode">
            <span class="text-sm font-medium text-gray-500">Code d'inscription</span>
            <p class="text-gray-900 font-mono">{{ user.profile.registrationCode }}</p>
          </div>
        </div>
      </Card>

      <Card>
        <h2 class="text-lg font-medium text-gray-900 mb-4">
          Filières d'intérêt
        </h2>

        <div v-if="editing" class="space-y-3">
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

        <div v-else class="flex flex-wrap gap-2">
          <span
            v-for="filiere in user?.profile?.filieres"
            :key="filiere"
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
          >
            {{ filiere }}
          </span>
          <span v-if="!user?.profile?.filieres?.length" class="text-gray-500 text-sm">
            Aucune filière sélectionnée
          </span>
        </div>
      </Card>

      <Card>
        <h2 class="text-lg font-medium text-gray-900 mb-4">
          Centres d'intérêt
        </h2>

        <div v-if="editing" class="grid grid-cols-2 gap-3">
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

        <div v-else class="flex flex-wrap gap-2">
          <span
            v-for="interest in user?.profile?.interests"
            :key="interest"
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
          >
            {{ interest }}
          </span>
          <span v-if="!user?.profile?.interests?.length" class="text-gray-500 text-sm">
            Aucun centre d'intérêt sélectionné
          </span>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted, watch } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { FirebaseService } from '../../services/firebaseService'
import Card from '../../components/UI/Card.vue'
import Button from '../../components/UI/Button.vue'
import LoadingSpinner from '../../components/UI/LoadingSpinner.vue'

import { availableFilieres } from '../../assets/data/dataFiliere.js'
import { availableInterests } from '../../assets/data/dataInterest.js'

const authStore = useAuthStore()
const user = computed(() => authStore.user)

const schoolName = ref('');
const editing = ref(false)
const loading = ref(false)
const submitting = ref(false)
const error = ref(null)
const availableClasses = ref([])

const formData = reactive({
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  class: '',
  averageGrade: null,
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
  
  // Format date input (YYYY-MM-DD)
  return date.toISOString().split('T')[0]
}

// Initialize form data when user changes
const initializeFormData = () => {
  if (user.value?.profile) {
    const profile = user.value.profile
    formData.firstName = profile.firstName || ''
    formData.lastName = profile.lastName || ''
    formData.dateOfBirth = formatDateForInput(profile.dateOfBirth) || ''
    formData.class = profile.class || '' // Should be the class ID
    formData.averageGrade = profile.averageGrade || null
    formData.filieres = [...(profile.filieres || [])]
    formData.interests = [...(profile.interests || [])]
  }
}

const loadSchoolDetails = async (schoolId) => {
  try {
    const adminSettings = await FirebaseService.getOrCreateSettingsForAdmin(schoolId);
    if (adminSettings) {
      schoolName.value = adminSettings.name || 'Nom de l\'Établissement non renseigné';
    } else {
      schoolName.value = 'Nom de l\'Établissement non trouvé';
    }
  } catch (err) {
    console.error("Error loading school details:", err);
    schoolName.value = 'Erreur lors du chargement de l\'école';
  }
};

// Watch for changes in user data
watch(user, async (newUser) => { // Make watch async to await loadSchoolDetails
  if (newUser) {
    initializeFormData()
    // Load school name when user data is available
    if (newUser.profile?.school) {
        await loadSchoolDetails(newUser.profile.school);
    } else {
        schoolName.value = 'Non renseignée';
    }
  }
}, { immediate: true })

// Load classes on component mount
onMounted(async () => {
  await loadClasses()
})

// Methods
const loadClasses = async () => {
  try {
    loading.value = true
    error.value = null
    console.log('Attempting to load classes from FirebaseService.getAllClasses()...')
    const classes = await FirebaseService.getAllClasses() // This should fetch all classes
    console.log('Classes loaded:', classes)
    availableClasses.value = classes.map(classe => ({
      id: classe.id,
      name: classe.name,
      level: classe.level
    }))
  } catch (err) {
    console.error('Detailed error during class loading:', err)
    error.value = `Error loading classes: ${err.message}`
    
    // Fallback: default classes if Firebase fails
    availableClasses.value = [
      { id: 'seconde-a-2024', name: 'Seconde A', level: 'Seconde' },
      { id: 'seconde-b-2024', name: 'Seconde B', level: 'Seconde' },
      { id: 'premiere-s-2024', name: 'Première S', level: 'Première' },
      { id: 'premiere-l-2024', name: 'Première L', level: 'Première' },
      { id: 'premiere-es-2024', name: 'Première ES', level: 'Première' },
      { id: 'terminale-s-2024', name: 'Terminale S', level: 'Terminale' },
      { id: 'terminale-l-2024', name: 'Terminale L', level: 'Terminale' },
      { id: 'terminale-es-2024', name: 'Terminale ES', level: 'Terminale' }
    ]
    console.log('Fallback classes used:', availableClasses.value)
  } finally {
    loading.value = false
  }
}

const toggleEditing = () => {
  if (editing.value) {
    // Cancel editing - reset form data
    initializeFormData()
  }
  editing.value = !editing.value
  error.value = null
}

const handleSubmit = async () => { // Removed 'e' due to .prevent
  
  if (!user.value?.id) {
    error.value = 'User not logged in.'
    return
  }

  try {
    submitting.value = true
    error.value = null

    // Prepare profile data
    const profileData = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      dateOfBirth: formData.dateOfBirth || null,
      class: formData.class, // This is now the class ID
      level: await FirebaseService.extractLevelFromClassId(formData.class), // Dynamically get level from class ID
      averageGrade: formData.averageGrade,
      filieres: formData.filieres,
      interests: formData.interests,
      registrationCode: user.value.profile.registrationCode,
      school: user.value.profile.school, // Ensure school ID persists if it exists
    }

    // Update profile in Firebase
    await FirebaseService.updateUserProfile(user.value.id, profileData)

    // Update local store
    authStore.user = {
      ...user.value,
      profile: {
        ...user.value.profile, // Keep existing profile fields
        ...profileData // Overlay with updated fields
      }
    }

    editing.value = false
    
    // Success notification
    const event = new CustomEvent('profile-updated', {
      detail: { message: 'Profile updated successfully!' }
    })
    window.dispatchEvent(event)

  } catch (err) {
    console.error('Error updating profile:', err)
    error.value = 'Error saving profile: ' + err.message
  } finally {
    submitting.value = false
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

const formatDate = (dateValue) => {
  if (!dateValue) return "Non renseignée"
  
  let date
  if (dateValue.seconds) {
    // Firestore timestamp
    date = new Date(dateValue.seconds * 1000)
  } else if (typeof dateValue === 'string') {
    date = new Date(dateValue)
  } else if (dateValue instanceof Date) {
    date = dateValue
  } else {
    return "Non renseignée"
  }
  
  return date.toLocaleDateString("fr-FR")
}

const getClassDisplayName = (classId) => {
  if (!classId) return 'Non définie'
  const classe = availableClasses.value.find(c => c.id === classId)
  return classe ? classe.name : classId
}
</script>