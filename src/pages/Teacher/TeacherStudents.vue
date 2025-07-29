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
          <h1 class="text-2xl font-bold text-gray-900">Mes Élèves</h1>
          </div>

        <Card>
          <div class="flex items-center justify-between space-x-4">
            <div class="flex items-center space-x-4 w-full">
              <label class="text-sm font-medium text-gray-700 whitespace-nowrap">Rechercher :</label>
              <input type="text" v-model="searchTerm" placeholder="Nom, email, code d'inscription..."
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div class="flex items-center gap-4 whitespace-nowrap ml-auto">
              <span class="text-sm text-gray-600">
                {{ filteredStudents.length }} élève(s) affiché(s)
              </span>
              <button @click="viewMode = 'card'" :class="viewMode === 'card' ? 'text-blue-600' : 'text-gray-400'">
                <Squares2X2Icon class="w-5 h-5" />
              </button>
              <button @click="viewMode = 'list'" :class="viewMode === 'list' ? 'text-blue-600' : 'text-gray-400'">
                <Bars3Icon class="w-5 h-5" />
              </button>
            </div>
          </div>
        </Card>

        <div v-if="viewMode === 'card'" class="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card v-for="student in filteredStudents" :key="student.id">
            <div class="flex justify-between items-start mb-4">
              <div>
                <h3 class="text-lg font-medium text-gray-900">
                  {{ student.profile.firstName }} {{ student.profile.lastName }}
                </h3>
                <p class="text-sm text-gray-600">{{ student.email }}</p>
              </div>
              <Button size="sm" variant="secondary" @click="openFillBulletinModalForStudent(student)">
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
                  <code class="text-xs bg-gray-100 px-2 py-1 rounded">
                    {{ student.profile.registrationCode }}
                  </code>
                  <KeyIcon class="h-3 w-3 text-gray-400" />
                </div>
              </div>
            </div>

            <div class="mt-4 flex space-x-2">
              <Button size="sm" class="flex-1" @click="openStudentDetails(student.id)">Voir détails</Button>
              <Button size="sm" variant="primary" class="flex-1" @click="openFillBulletinModalForStudent(student)">Remplir bulletin</Button>
            </div>
          </Card>
        </div>

        <Card v-if="viewMode === 'list'" class="mt-6 overflow-auto">
          <table class="min-w-full divide-y divide-gray-200 text-sm">
            <thead class="bg-gray-100">
              <tr>
                <th class="px-4 py-2 text-left font-medium text-gray-700">Nom</th>
                <th class="px-4 py-2 text-left font-medium text-gray-700">Email</th>
                <th class="px-4 py-2 text-left font-medium text-gray-700">Classe</th>
                <th class="px-4 py-2 text-left font-medium text-gray-700">Moyenne</th>
                <th class="px-4 py-2 text-left font-medium text-gray-700">Inscription</th>
                <th class="px-4 py-2 text-left font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 bg-white">
              <tr v-for="student in filteredStudents" :key="student.id">
                <td class="px-4 py-2">
                  {{ student.profile.firstName }} {{ student.profile.lastName }}
                </td>
                <td class="px-4 py-2">{{ student.email }}</td>
                <td class="px-4 py-2">{{ student.profile.classDisplayName }}</td>
                <td class="px-4 py-2">{{ student.profile.averageGrade || 'N/A' }}/20</td>
                <td class="px-4 py-2">{{ formatDate(student.createdAt) }}</td>
                <td class="px-4 py-2 space-x-2 flex items-center gap-1">
                  <Button variant="secondary" size="sm" @click="openStudentDetails(student.id)">Voir</Button>
                  <Button size="sm" variant="primary" @click="openFillBulletinModalForStudent(student)">Remplir</Button>
                </td>
              </tr>
            </tbody>
          </table>
        </Card>

        <Card v-if="filteredStudents.length === 0 && searchTerm">
          <div class="text-center py-12">
            <h3 class="text-lg font-medium text-gray-900 mb-2">
              Aucun élève trouvé
            </h3>
            <p class="text-gray-600">
              Aucun élève ne correspond à votre recherche.
            </p>
          </div>
        </Card>
        <Card v-else-if="filteredStudents.length === 0 && !searchTerm && !loading">
          <div class="text-center py-12">
            <h3 class="text-lg font-medium text-gray-900 mb-2">
              Aucun élève assigné
            </h3>
            <p class="text-gray-600">
              Il semble qu'aucun élève ne soit assigné à vos classes pour le moment.
            </p>
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
import TitlePage from '../../components/UI/Title.vue' // Re-added if you want a custom TitlePage for teachers
import StudentDetailsPanel from '../Admin/StudentDetailsPanel.vue' // Reuse Admin StudentDetailsPanel
import LoadingSpinner from '../../components/UI/LoadingSpinner.vue'
import Breadcrumb from '../../components/UI/Breadcrumb.vue'
import ConfirmDialog from '../../components/UI/ConfirmDialog.vue'
import BulletinForm from '../Admin/BulletinForm.vue' // Reuse Admin BulletinForm
import { useConfirm } from '../../composables/useConfirm'

// Icons
import {
  Squares2X2Icon, Bars3Icon, PlusIcon, PencilIcon, TrashIcon, KeyIcon, HomeIcon,
  UsersIcon, DocumentPlusIcon, DocumentMagnifyingGlassIcon // Add DocumentPlusIcon
} from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
const user = computed(() => authStore.user)
const { showConfirm, showAlert } = useConfirm();

// --- State Management ---
const currentPage = ref('list'); // 'list', 'details'
const viewMode = ref('card')
const students = ref([]) // Students assigned to THIS teacher
const loading = ref(true)
const searchTerm = ref('') // For local search
const selectedStudentIdForDetails = ref(null)

const showBulletinFormModal = ref(false) // To open BulletinForm
const selectedStudentForBulletin = ref(null) // Student selected for new bulletin
const editingBulletinData = ref(null) // Bulletin data if editing existing

// --- Breadcrumb Items ---
const breadcrumbItems = computed(() => {
  const items = [{ label: 'Mes Élèves', to: 'list', icon: HomeIcon }];
  if (currentPage.value === 'details') {
    const student = students.value.find(s => s.id === selectedStudentIdForDetails.value);
    const studentName = student ? `${student.profile?.firstName} ${student.profile?.lastName}` : 'Détails Élève';
    items.push({ label: studentName });
  }
  // For teachers, no direct 'add' or 'edit' student profile forms, so no corresponding breadcrumbs.
  return items;
});

// --- New handler for Breadcrumb navigation ---
const handleBreadcrumbNavigation = (target) => {
    if (target === 'list') {
        currentPage.value = 'list';
        // No unsaved changes to handle on this page (teachers can't edit profiles directly)
    }
};

const filteredStudents = computed(() => {
  const lowerCaseSearch = searchTerm.value.toLowerCase();
  return students.value.filter(student =>
    student.profile.firstName.toLowerCase().includes(lowerCaseSearch) ||
    student.profile.lastName.toLowerCase().includes(lowerCaseSearch) ||
    student.email.toLowerCase().includes(lowerCaseSearch) ||
    student.profile.registrationCode?.toLowerCase().includes(lowerCaseSearch) ||
    student.profile.classDisplayName?.toLowerCase().includes(lowerCaseSearch)
  );
});

// --- Data Loading ---
const loadStudents = async () => {
  if (!user.value || !user.value.id || user.value.role !== 'teacher') {
    showAlert('Erreur', 'Accès non autorisé ou utilisateur non trouvé.', 'Ok');
    loading.value = false;
    return;
  }
  loading.value = true;
  try {
    // Teachers only see students assigned to their classes
    const data = await FirebaseService.getStudentsForTeacher(user.value.id);
    students.value = data;
  } catch (error) {
    console.error('Error loading students for teacher:', error);
    showAlert('Erreur', 'Impossible de charger la liste de vos élèves: ' + error.message, 'Compris');
    students.value = [];
  } finally {
    loading.value = false;
  }
};

// --- Form & Panel State Management ---
// Teachers don't manage has-changes for student profiles in this view
// setFormHasChanges and setDetailsPanelHasChanges are not needed here.

const openStudentDetails = (studentId) => {
  selectedStudentIdForDetails.value = studentId;
  currentPage.value = 'details';
};

// Function to open the BulletinForm for a selected student
const openFillBulletinModalForStudent = (student) => {
    selectedStudentForBulletin.value = student; // Store the student object
    editingBulletinData.value = null; // Always null for 'add new bulletin' from here
    showBulletinFormModal.value = true;
};

// Function to open the BulletinForm for editing an existing bulletin from BulletinViewer
const openEditBulletinFromViewer = (bulletinData) => {
    selectedStudentForBulletin.value = students.value.find(s => s.id === bulletinData.studentId); // Find student for context
    editingBulletinData.value = bulletinData; // Pass existing bulletin data
    showBulletinFormModal.value = true;
};

// Handle submission from BulletinForm
const handleBulletinFormSubmit = async () => {
    showBulletinFormModal.value = false; // Close the modal
    selectedStudentForBulletin.value = null; // Clear selected student
    editingBulletinData.value = null; // Clear editing bulletin
    await loadStudents(); // Refresh the student list (in case averages changed)
    showAlert('Succès', 'Bulletin sauvegardé avec succès!', 'Ok');
};


// Handle student details updates (from BulletinForm submit within Details Panel)
const handleStudentDetailsUpdate = async () => {
    // This emitter is for when a bulletin is saved from the details panel.
    // The main student list doesn't get updated directly by student profile edits here.
    // So, just reload the students to reflect any average changes from bulletin.
    await loadStudents();
};

const handleStudentDeletedFromDetails = async () => {
    // If a student is deactivated/deleted from the details panel (shouldn't be possible for teacher)
    // For teacher, this should probably just alert that they can't delete.
    showAlert('Info', 'Les enseignants ne peuvent pas supprimer des élèves.', 'Ok');
    currentPage.value = 'list';
    await loadStudents();
};


// --- Utility Functions ---
const formatDate = (date) => {
  if (!date) return 'N/A';
  return date.toLocaleDateString('fr-FR');
}

// --- Lifecycle ---
onMounted(() => {
  loadStudents();
});
</script>