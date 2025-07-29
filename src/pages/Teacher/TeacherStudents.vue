<!-- TeacherStudents.vue -->
<template>
  <div class="space-y-6">
    <LoadingSpinner v-if="loading" text="Chargement des élèves..." color="indigo" class="my-8" />

    <div v-else>
      <Breadcrumb v-if="currentPage !== 'list'" 
        :items="breadcrumbItems" 
        @navigate-to="handleBreadcrumbNavigation" 
      />

      <template v-if="currentPage === 'list'">
        <div class="flex justify-between items-center mb-6">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Mes Élèves</h1>
            <p class="text-gray-600 mt-1">Gérez vos élèves et remplissez leurs bulletins</p>
          </div>
        </div>

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
                <option v-for="classe in availableClassesForFilter" :key="classe.id" :value="classe.id">
                  {{ classe.name }} ({{ classe.level }})
                </option>
              </select>
            </div>

            <!-- Results Count and View Toggle -->
            <div class="flex items-center justify-between w-full lg:w-auto lg:justify-end space-x-4">
              <div class="text-sm text-gray-600 whitespace-nowrap">
                {{ filteredStudents.length }} élève(s) affiché(s)
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
              <Button size="sm" variant="secondary" @click="openStudentDetails(student.id)"
                class="ml-2 shrink-0" title="Remplir bulletin">
                <DocumentPlusIcon class="h-4 w-4" />
              </Button>
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
              <Button size="sm" variant="primary" class="flex-1" @click="openStudentDetails(student.id)">
                Remplir le bulletin
              </Button>
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
                  <div class="">
                    <Button size="sm" variant="primary" @click="openStudentDetails(student.id)">Remplir</Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </Card>

        <Card v-if="filteredStudents.length === 0 && searchTerm">
          <div class="text-center py-12">
            <div class="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <UsersIcon class="w-6 h-6 text-gray-400" />
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">
              Aucun élève trouvé
            </h3>
            <p class="text-gray-600">
              Aucun élève ne correspond à votre recherche "{{ searchTerm }}".
            </p>
            <Button variant="outline" size="sm" @click="searchTerm = ''" class="mt-4">
              Effacer la recherche
            </Button>
          </div>
        </Card>
        
        <Card v-else-if="filteredStudents.length === 0 && !searchTerm && selectedClassId === 'all'">
          <div class="text-center py-12">
            <div class="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <UsersIcon class="w-6 h-6 text-gray-400" />
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">
              Aucun élève assigné
            </h3>
            <p class="text-gray-600">
              Il semble qu'aucun élève ne soit assigné à vos classes pour le moment.
            </p>
          </div>
        </Card>
        
        <Card v-else-if="filteredStudents.length === 0 && !searchTerm && selectedClassId !== 'all'">
          <div class="text-center py-12">
            <div class="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <UsersIcon class="w-6 h-6 text-gray-400" />
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">
              Aucun élève dans cette classe
            </h3>
            <p class="text-gray-600">
              Aucun élève n'est assigné à la classe sélectionnée.
            </p>
            <Button variant="outline" size="sm" @click="selectedClassId = 'all'" class="mt-4">
              Voir toutes les classes
            </Button>
          </div>
        </Card>
      </template>

      <template v-if="currentPage === 'details'">
        <StudentDetailsPanel 
          :student-id="selectedStudentIdForDetails" 
          @close="currentPage = 'list'" 
          @student-updated="handleStudentDetailsUpdate"
          @student-deleted="handleStudentDeletedFromDetails"
          :hide-edit-student="true"
          :hide-delete-student="true"
          @open-edit-bulletin-from-viewer="openEditBulletinFromViewer"
          @open-fill-bulletin="openFillBulletinModalForStudent"
        />
      </template>
    </div>

    <BulletinForm
        v-if="showBulletinFormModal"
        :student-id="selectedStudentForBulletin?.id"
        :student-current-class-id="selectedStudentForBulletin?.profile?.class"
        :initial-data="editingBulletinData"
        @submit="handleBulletinFormSubmit"
        @cancel="showBulletinFormModal = false"
    />

    <ConfirmDialog />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { FirebaseService } from '../../services/firebaseService'
import { useAuthStore } from '../../stores/auth'
import Card from '../../components/UI/Card.vue'
import Button from '../../components/UI/Button.vue'
import TitlePage from '../../components/UI/Title.vue'
import StudentDetailsPanel from '../Admin/StudentDetailsPanel.vue'
import LoadingSpinner from '../../components/UI/LoadingSpinner.vue'
import Breadcrumb from '../../components/UI/Breadcrumb.vue'
import ConfirmDialog from '../../components/UI/ConfirmDialog.vue'
import BulletinForm from '../Admin/BulletinForm.vue'
import { useConfirm } from '../../composables/useConfirm'

// Icons
import {
  Squares2X2Icon, Bars3Icon, KeyIcon, HomeIcon,
  UsersIcon, DocumentPlusIcon
} from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
const user = computed(() => authStore.user)
const { showConfirm, showAlert } = useConfirm()

// --- State Management ---
const currentPage = ref('list')
const viewMode = ref('card')
const students = ref([])
const loading = ref(true)
const searchTerm = ref('')
const selectedClassId = ref('all')
const availableClassesForFilter = ref([])
const selectedStudentIdForDetails = ref(null)

const showBulletinFormModal = ref(false)
const selectedStudentForBulletin = ref(null)
const editingBulletinData = ref(null)

const breadcrumbItems = computed(() => {
  const items = [{ label: 'Mes Élèves', to: 'list', icon: HomeIcon }]
  if (currentPage.value === 'details') {
    const student = students.value.find(s => s.id === selectedStudentIdForDetails.value)
    const studentName = student ? `${student.profile?.firstName} ${student.profile?.lastName}` : 'Détails Élève'
    items.push({ label: studentName })
  }
  return items
})

const handleBreadcrumbNavigation = (target) => {
  if (target === 'list') {
    currentPage.value = 'list'
  }
}

const filteredStudents = computed(() => {
  let filtered = students.value

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

  if (selectedClassId.value !== 'all') {
    filtered = filtered.filter(student => student.profile.class === selectedClassId.value)
  }

  return filtered
})

const loadStudents = async () => {
  if (!user.value || !user.value.id || user.value.role !== 'teacher') {
    showAlert('Erreur', 'Accès non autorisé ou utilisateur non trouvé.', 'Ok')
    loading.value = false
    return
  }
  loading.value = true
  try {
    const fetchedStudents = await FirebaseService.getStudentsForTeacher(user.value.id)
    students.value = fetchedStudents

    // Fetch all classes to populate class filter dropdown and get display names
    const classes = await FirebaseService.getAllClasses()
    
    // Get unique class IDs from students and create filter options
    const uniqueClassIds = [...new Set(students.value.map(s => s.profile.class).filter(id => id))]
    availableClassesForFilter.value = uniqueClassIds.map(classId => {
      const classInfo = classes.find(c => c.id === classId)
      return classInfo || { id: classId, name: 'Classe inconnue', level: '' }
    })

    // Ensure student objects have classDisplayName for current class
    students.value.forEach(student => {
      if (student.profile.class) {
        const classInfo = classes.find(c => c.id === student.profile.class)
        student.profile.classDisplayName = classInfo ? classInfo.name : 'Classe inconnue'
      }
    })

  } catch (error) {
    console.error('Error loading students for teacher:', error)
    showAlert('Erreur', 'Impossible de charger la liste de vos élèves: ' + error.message, 'Compris')
    students.value = []
    availableClassesForFilter.value = []
  } finally {
    loading.value = false
  }
}

const openStudentDetails = (studentId) => {
  selectedStudentIdForDetails.value = studentId
  currentPage.value = 'details'
}

const openFillBulletinModalForStudent = (student) => {
  selectedStudentForBulletin.value = student
  editingBulletinData.value = null
  showBulletinFormModal.value = true
}

const openEditBulletinFromViewer = (bulletinData) => {
  const student = students.value.find(s => s.id === bulletinData.studentId)
  selectedStudentForBulletin.value = student
  editingBulletinData.value = bulletinData
  showBulletinFormModal.value = true
}

const handleBulletinFormSubmit = async () => {
  showBulletinFormModal.value = false
  selectedStudentForBulletin.value = null
  editingBulletinData.value = null
  // Optionally reload students to get updated averages
  await loadStudents()
}

const handleStudentDetailsUpdate = async () => {
  await loadStudents() // Reload to get updated data
}

const handleStudentDeletedFromDetails = async () => {
  currentPage.value = 'list'
  await loadStudents()
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  return date.toLocaleDateString('fr-FR')
}

// --- Lifecycle ---
onMounted(() => {
  loadStudents()
})
</script>