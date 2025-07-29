<template>
  <div class="space-y-6">
    <LoadingSpinner v-if="loading" text="Chargement des données..." color="indigo" class="my-8" />

    <div v-else>
      <Breadcrumb v-if="currentPage !== 'list'" :items="breadcrumbItems"
        :has-unsaved-changes="hasUnsavedChangesOnCurrentPage" @navigate-to="handleBreadcrumbNavigation" />

      <template v-if="currentPage === 'list'">
        <TitlePage :has-button="true" :has-icon="true" @on-click="openAddStudentForm" title="Gestion des Étudiants"
          btn-text="Ajouter un étudiant" :loading="loading"
          description="Gérez les comptes de vos étudiants, leurs profils et leurs bulletins." :user="user">
          <PlusIcon class="h-4 w-4 mr-2" />
        </TitlePage>

        <Card>
          <div class="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0 lg:space-x-6">
            <!-- Search Input -->
            <div class="flex items-center space-x-4 w-full lg:w-1/2">
              <label class="text-sm font-medium text-gray-700 whitespace-nowrap">Rechercher :</label>
              <input 
                type="text" 
                v-model="searchTerm" 
                placeholder="Nom, email, code d'inscription..."
                class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
              />
            </div>
            
            <!-- Class Filter -->
            <div class="flex items-center space-x-4 w-full lg:w-1/3">
              <label class="text-sm font-medium text-gray-700 whitespace-nowrap">Filtrer par classe :</label>
              <select v-model="selectedClassId"
                class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm">
                <option value="all">Toutes les classes</option>
                <option v-for="(classe, index) in availableClassesForFilter" :key="index" :value="classe.id">
                  {{ classe.name }}
                </option>
              </select>
            </div>

            <!-- Results Count and View Toggle -->
            <div class="flex items-center justify-between w-full lg:w-auto lg:justify-end space-x-4">
              <div class="text-sm text-gray-600 whitespace-nowrap">
                {{ filteredStudents.length }} étudiant(s) affiché(s)
              </div>
              <div class="flex items-center gap-2">
                <button @click="viewMode = 'card'" 
                  :class="viewMode === 'card' ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-gray-600'"
                  class="p-2 rounded-md transition-colors">
                  <Squares2X2Icon class="w-5 h-5" />
                </button>
                <button @click="viewMode = 'list'" 
                  :class="viewMode === 'list' ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-gray-600'"
                  class="p-2 rounded-md transition-colors">
                  <Bars3Icon class="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </Card>

        <div v-if="viewMode === 'card'" class="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card v-for="student in filteredStudents" :key="student.id" class="hover:shadow-md transition-shadow">
            <div class="flex justify-between items-start mb-4">
              <div class="flex-1 min-w-0">
                <h3 class="text-lg font-medium text-gray-900 truncate">
                  {{ student.profile.firstName }} {{ student.profile.lastName }}
                </h3>
                <p class="text-sm text-gray-600 truncate">{{ student.email }}</p>
              </div>
              <div class="flex space-x-1 ml-2">
                <button @click="openEditStudentForm(student)" 
                  class="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                  title="Éditer">
                  <PencilIcon class="h-4 w-4" />
                </button>
                <button @click="confirmDeleteStudent(student.id)" 
                  class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  title="Supprimer">
                  <TrashIcon class="h-4 w-4" />
                </button>
              </div>
            </div>

            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Classe:</span>
                <span class="text-sm font-medium">{{ student.profile.classDisplayName }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Moyenne:</span>
                <span class="text-sm font-medium">
                  {{ student.profile.averageGrade || 'N/A' }}/20
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Inscrit le:</span>
                <span class="text-sm">{{ formatDate(student.createdAt) }}</span>
              </div>
            </div>

            <div class="mt-4 pt-4 border-t border-gray-200">
              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-600">Code d'inscription:</span>
                <div class="flex items-center space-x-2">
                  <code class="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                    {{ student.profile.registrationCode }}
                  </code>
                  <KeyIcon class="h-3 w-3 text-gray-400" />
                </div>
              </div>
            </div>

            <div class="mt-4 flex space-x-2">
              <Button size="sm" class="flex-1" @click="openStudentDetails(student.id)">Voir détails</Button>
              <Button size="sm" variant="outline" class="flex-1" @click="openEditStudentForm(student)">Éditer</Button>
            </div>
          </Card>
        </div>

        <Card v-if="viewMode === 'list'" class="mt-6 overflow-auto">
          <table class="min-w-full divide-y divide-gray-200 text-sm">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left font-medium text-gray-700">Nom</th>
                <th class="px-4 py-3 text-left font-medium text-gray-700">Email</th>
                <th class="px-4 py-3 text-left font-medium text-gray-700">Classe</th>
                <th class="px-4 py-3 text-left font-medium text-gray-700">Moyenne</th>
                <th class="px-4 py-3 text-left font-medium text-gray-700">Inscription</th>
                <th class="px-4 py-3 text-left font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 bg-white">
              <tr v-for="student in filteredStudents" :key="student.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-4 py-3 font-medium text-gray-900">
                  {{ student.profile.firstName }} {{ student.profile.lastName }}
                </td>
                <td class="px-4 py-3 text-gray-600">{{ student.email }}</td>
                <td class="px-4 py-3">{{ student.profile.classDisplayName }}</td>
                <td class="px-4 py-3">{{ student.profile.averageGrade || 'N/A' }}/20</td>
                <td class="px-4 py-3 text-gray-600">{{ formatDate(student.createdAt) }}</td>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-2">
                    <Button variant="secondary" size="sm" @click="openStudentDetails(student.id)">Voir</Button>
                    <Button size="sm" variant="outline" @click="openEditStudentForm(student)">Éditer</Button>
                    <Button size="sm" variant="danger" @click="confirmDeleteStudent(student.id)">Supprimer</Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </Card>

        <Card v-if="filteredStudents.length === 0 && searchTerm">
          <div class="text-center py-12 flex flex-col items-center gap-4">
            <div class="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <UsersIcon class="w-6 h-6 text-gray-400" />
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">
              Aucun étudiant trouvé
            </h3>
            <p class="text-gray-600">
              Aucun étudiant ne correspond à votre recherche "{{ searchTerm }}".
            </p>
            <Button variant="outline" size="sm" @click="searchTerm = ''" class="mt-4">
              Effacer la recherche
            </Button>
          </div>
        </Card>
        
        <Card v-else-if="filteredStudents.length === 0 && !searchTerm">
          <div class="text-center py-12 flex flex-col items-center gap-4">
            <div class="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <UsersIcon class="w-6 h-6 text-gray-400" />
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">
              Aucun étudiant trouvé
            </h3>
            <p class="text-gray-600">
              {{ selectedClassId === 'all'
                ? "Aucun étudiant n'a été ajouté pour le moment."
                : `Aucun étudiant dans la classe sélectionnée.`
              }}
            </p>
            <Button @click="openAddStudentForm" class="mt-4">
              <PlusIcon class="h-4 w-4 mr-2" />
              Ajouter un étudiant
            </Button>
          </div>
        </Card>
      </template>

      <template v-if="currentPage === 'add' || currentPage === 'edit'">
        <AddStudentForm :initial-data="editingStudent" :mode="currentPage === 'edit' ? 'edit' : 'add'"
          :generate-code="generateRegistrationCode" :classes-from-settings="availableClassesForFilter"
          @submit="handleStudentFormSubmit" @cancel="cancelStudentForm" @has-changes="setFormHasChanges" />
      </template>

      <template v-if="currentPage === 'details'">
        <StudentDetailsPanel :student-id="selectedStudentIdForDetails" @close="currentPage = 'list'"
          @student-updated="handleStudentDetailsUpdate" @student-deleted="handleStudentDeletedFromDetails"
          @open-edit-student="openEditStudentFormFromDetails" @has-changes="setDetailsPanelHasChanges" />
      </template>
    </div>
  </div>

  <ConfirmDialog />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { FirebaseService } from '../../services/firebaseService'
import { useAuthStore } from '../../stores/auth'
import Card from '../../components/UI/Card.vue'
import Button from '../../components/UI/Button.vue'
import AddStudentForm from './AddStudentForm.vue'
import TitlePage from '../../components/UI/Title.vue'
import StudentDetailsPanel from './StudentDetailsPanel.vue'
import LoadingSpinner from '../../components/UI/LoadingSpinner.vue'
import Breadcrumb from '../../components/UI/Breadcrumb.vue'
import ConfirmDialog from '../../components/UI/ConfirmDialog.vue'
import { useConfirm } from '../../composables/useConfirm'

import { Squares2X2Icon, Bars3Icon, PlusIcon, PencilIcon, TrashIcon, KeyIcon, HomeIcon, UsersIcon } from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
const user = computed(() => authStore.user)
const { showConfirm, showAlert } = useConfirm()

// --- State Management ---
const currentPage = ref('list') // 'list', 'add', 'edit', 'details'
const viewMode = ref('card')
const students = ref([])
const editingStudent = ref(null) // Holds the student object being edited
const loading = ref(true)
const searchTerm = ref('') // NEW: For search functionality
const selectedClassId = ref('all') // Changed to ID for settings integration
const availableClassesForFilter = ref([]) // Classes pulled from admin settings
const selectedStudentIdForDetails = ref(null)

const addFormHasChanges = ref(false)
const detailsPanelHasChanges = ref(false)

const hasUnsavedChangesOnCurrentPage = computed(() => {
  if (currentPage.value === 'add' || currentPage.value === 'edit') {
    return addFormHasChanges.value
  }
  if (currentPage.value === 'details') {
    return detailsPanelHasChanges.value
  }
  return false
})

// --- Breadcrumb Items ---
const breadcrumbItems = computed(() => {
  const items = [{ label: 'Liste des Étudiants', to: 'list', icon: HomeIcon }]
  if (currentPage.value === 'add') {
    items.push({ label: 'Ajouter un Étudiant' })
  } else if (currentPage.value === 'edit') {
    const studentName = editingStudent.value ? `${editingStudent.value.profile?.firstName} ${editingStudent.value.profile?.lastName}` : 'Édition Étudiant'
    items.push({ label: studentName })
  } else if (currentPage.value === 'details') {
    const student = students.value.find(s => s.id === selectedStudentIdForDetails.value)
    const studentName = student ? `${student.profile?.firstName} ${student.profile?.lastName}` : 'Détails Étudiant'
    items.push({ label: studentName })
  }
  return items
})

// --- New handler for Breadcrumb navigation ---
const handleBreadcrumbNavigation = (target) => {
  if (target === 'list') {
    currentPage.value = 'list'
    addFormHasChanges.value = false
    detailsPanelHasChanges.value = false
  }
}

// --- Updated filtered students with search functionality ---
const filteredStudents = computed(() => {
  let filtered = students.value

  // Apply search filter
  if (searchTerm.value) {
    const searchLower = searchTerm.value.toLowerCase()
    filtered = filtered.filter(student => 
      student.profile.firstName.toLowerCase().includes(searchLower) ||
      student.profile.lastName.toLowerCase().includes(searchLower) ||
      student.email.toLowerCase().includes(searchLower) ||
      student.profile.registrationCode?.toLowerCase().includes(searchLower) ||
      student.profile.classDisplayName?.toLowerCase().includes(searchLower)
    )
  }

  // Apply class filter
  if (selectedClassId.value !== 'all') {
    filtered = filtered.filter(student => student.profile.class === selectedClassId.value)
  }

  return filtered
})

// --- Data Loading ---
const loadStudentsAndClasses = async () => {
  try {
    loading.value = true
    if (!user.value || !user.value.id) {
      console.error("Admin ID not available for loading students.")
      await showAlert('Erreur', 'ID administrateur non disponible. Veuillez vous reconnecter.', 'Ok')
      return
    }

    const adminSettings = await FirebaseService.getOrCreateSettingsForAdmin(user.value.id)

    if (adminSettings && adminSettings.classes && adminSettings.classes.length > 0) {
      const classPromises = adminSettings.classes.map(id => FirebaseService.getClassById(id))
      const fetchedClasses = await Promise.all(classPromises)
      availableClassesForFilter.value = fetchedClasses.filter(cls => cls !== null)
    } else {
      availableClassesForFilter.value = []
    }

    const data = await FirebaseService.getAllStudentsForAdmin(user.value.id)
    students.value = data
  } catch (error) {
    console.error('Error loading students or classes:', error)
    await showAlert('Erreur', 'Impossible de charger les données : ' + error.message, 'Compris')
    students.value = []
    availableClassesForFilter.value = []
  } finally {
    loading.value = false
  }
}

const loadStudents = async () => {
  try {
    loading.value = true
    if (!user.value || !user.value.id) {
      await showAlert('Erreur', 'ID administrateur non disponible. Veuillez vous reconnecter.', 'Ok')
      return
    }
    const data = await FirebaseService.getAllStudentsForAdmin(user.value.id)
    students.value = data
  } catch (error) {
    console.error('Error loading students:', error)
    await showAlert('Erreur', 'Impossible de rafraîchir la liste des étudiants : ' + error.message, 'Compris')
    students.value = []
  } finally {
    loading.value = false
  }
}

// --- Form & Panel State Management ---
const setFormHasChanges = (hasChanges) => {
  addFormHasChanges.value = hasChanges
}

const setDetailsPanelHasChanges = (hasChanges) => {
  detailsPanelHasChanges.value = hasChanges
}

const openAddStudentForm = () => {
  editingStudent.value = null
  currentPage.value = 'add'
  addFormHasChanges.value = false
}

const openEditStudentForm = (student) => {
  editingStudent.value = { ...student }
  currentPage.value = 'edit'
  addFormHasChanges.value = false
}

const openStudentDetails = (studentId) => {
  selectedStudentIdForDetails.value = studentId
  currentPage.value = 'details'
  detailsPanelHasChanges.value = false
}

// Handler for when edit button is clicked within details panel
const openEditStudentFormFromDetails = (studentData) => {
  editingStudent.value = { ...studentData }
  currentPage.value = 'edit'
  addFormHasChanges.value = false
}

const handleStudentFormSubmit = async (data, mode) => {
  if (!user.value || !user.value.id) {
    await showAlert('Erreur', 'ID administrateur non disponible pour cette opération.', 'Ok')
    return
  }
  try {
    if (mode === 'add') {
      await FirebaseService.createStudent(data, user.value.id)
      await showAlert('Succès', 'Étudiant ajouté et e-mail de réinitialisation envoyé !', 'Super')
    } else if (mode === 'edit' && editingStudent.value) {
      await FirebaseService.updateStudent(editingStudent.value.id, {
        email: data.email,
        profile: {
          firstName: data.firstName,
          lastName: data.lastName,
          class: data.class,
          level: data.level,
          averageGrade: data.averageGrade,
          registrationCode: data.registrationCode,
          dateOfBirth: data.dateOfBirth,
          filieres: data.filieres,
          interests: data.interests,
          school: user.value.id
        }
      })
      await showAlert('Succès', 'Détails de l\'étudiant mis à jour.', 'Ok')
    }
    addFormHasChanges.value = false
    await loadStudents()
    currentPage.value = 'list'
  } catch (error) {
    console.error(`Error ${mode}ing student:`, error)
    await showAlert('Erreur', `Erreur lors de l'${mode === 'add' ? 'ajout' : 'édition'} de l'étudiant: ${error.message}`, 'Compris')
  }
}

// Handles cancelling form, checks for unsaved changes
const cancelStudentForm = async () => {
  if (addFormHasChanges.value) {
    const confirmed = await showConfirm(
      'Annuler les modifications',
      'Vous avez des modifications non sauvegardées. Êtes-vous sûr de vouloir annuler ?',
      'Oui, annuler',
      'Non, continuer l\'édition'
    )
    if (!confirmed) {
      return
    }
  }
  currentPage.value = 'list'
  addFormHasChanges.value = false
}

const confirmDeleteStudent = async (studentId) => {
  const confirmed = await showConfirm(
    'Confirmation de désactivation',
    'Êtes-vous sûr de vouloir désactiver ce compte étudiant ? Cela le rendra inactif et il ne pourra plus se connecter.',
    'Oui, désactiver',
    'Annuler'
  )

  if (confirmed) {
    try {
      await FirebaseService.deleteStudent(studentId)
      await showAlert('Succès', 'Compte étudiant désactivé avec succès.', 'Ok')
      await loadStudents()
    } catch (error) {
      console.error('Error deactivating student:', error)
      await showAlert('Erreur', 'Erreur lors de la désactivation du compte étudiant: ' + error.message, 'Compris')
    }
  }
}

const handleStudentDetailsUpdate = async () => {
  detailsPanelHasChanges.value = false
  await loadStudents()
}

const handleStudentDeletedFromDetails = async () => {
  detailsPanelHasChanges.value = false
  currentPage.value = 'list'
  await loadStudents()
}

// --- Utility Functions ---
const generateRegistrationCode = () => {
  return 'STU' + Math.random().toString(36).substr(2, 6).toUpperCase()
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  return date.toLocaleDateString('fr-FR')
}

// --- Lifecycle ---
onMounted(() => {
  loadStudentsAndClasses()
})
</script>