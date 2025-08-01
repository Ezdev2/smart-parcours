<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900">Tableau de bord - Enseignant</h1>
      <Button @click="gotoUrl('/teacher/students')">
        <UsersIcon class="h-4 w-4 mr-2" /> Gérer mes élèves
      </Button>
    </div>

    <LoadingSpinner v-if="loading" text="Chargement de votre tableau de bord..." color="indigo" class="my-8" />
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-md p-4">
      <div class="text-red-800">{{ error }}</div>
    </div>

    <div v-else class="flex flex-col gap-6">
      <UserWelcomeBanner
        :user="user"
        :classList="classList"
        :schoolName="schoolName"
        :principalName="principalName"
        :schoolLogo="schoolLogo"
        btn-link="/teacher/students"
        button-text="Voir mes élèves"
      />

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div class="flex items-center">
            <div class="p-2 bg-blue-100 rounded-lg">
              <UserGroupIcon class="h-6 w-6 text-blue-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Mes Élèves</p>
              <p class="text-2xl font-semibold text-gray-900">{{ dashboardStats.totalMyStudents }}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div class="flex items-center">
            <div class="p-2 bg-green-100 rounded-lg">
              <ChartBarIcon class="h-6 w-6 text-green-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Moyenne Globale de mes élèves</p>
              <p class="text-2xl font-semibold text-gray-900">
                {{ dashboardStats.averageMyStudents !== 0 ? dashboardStats.averageMyStudents + '/20' : 'N/A' }}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div class="flex items-center">
            <div class="p-2 bg-purple-100 rounded-lg">
              <DocumentTextIcon class="h-6 w-6 text-purple-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Bulletins de mes élèves</p>
              <p class="text-2xl font-semibold text-gray-900">{{ dashboardStats.totalMyBulletins }}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <h3 class="text-lg font-medium text-gray-900 mb-4">Actions rapides</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button @click="gotoUrl('/teacher/students')" class="h-20 flex-col">
            <UsersIcon />
            Voir mes élèves
          </Button>
          <Button @click="openFillBulletinModal" class="h-20 flex-col">
            <DocumentPlusIcon />
            Remplir un bulletin
          </Button>
          <Button variant="outline" class="h-20 flex-col" @click="loadDashboardData">
            <ArrowPathIcon />
            Actualiser les données
          </Button>
        </div>
      </Card>
    </div>

    <SelectStudentForBulletinModal v-if="showSelectStudentModal" :teacher-id="user?.id"
      @student-selected="handleStudentSelectedForBulletin" @cancel="showSelectStudentModal = false" />

    <!-- Bulletin Selection Modal for existing bulletins -->
    <BulletinSelectionModal v-if="showBulletinSelectionModal" :student="selectedStudentForBulletin"
      :existing-bulletins="selectedStudentForBulletin?.existingBulletins || []"
      @bulletin-selected="handleBulletinSelected" @create-new="handleCreateNewBulletin"
      @cancel="showBulletinSelectionModal = false" />

    <BulletinForm v-if="showBulletinFormModal" :student-id="selectedStudentForBulletin?.id"
      :student-current-class-id="selectedStudentForBulletin?.profile?.class" :initial-data="selectedBulletinData"
      @submit="handleBulletinFormSubmit" @cancel="showBulletinFormModal = false" />

    <ConfirmDialog />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { FirebaseService } from '../../services/firebaseService'
import { useAuthStore } from '../../stores/auth'
import { useGotoUrl } from '../../composables/useGotoUrl'
import { useConfirm } from '../../composables/useConfirm'
import UserWelcomeBanner from '../../components/UI/Banner.vue'
import Card from '../../components/UI/Card.vue'
import Button from '../../components/UI/Button.vue'
import LoadingSpinner from '../../components/UI/LoadingSpinner.vue'
import ConfirmDialog from '../../components/UI/ConfirmDialog.vue'
import SelectStudentForBulletinModal from './SelectStudentForBulletinModal.vue'
import BulletinSelectionModal from './BulletinSelectionModal.vue'
import BulletinForm from '../Admin/BulletinForm.vue'

// Heroicons
import {
  UsersIcon, ChartBarIcon, DocumentTextIcon, UserGroupIcon,
  DocumentPlusIcon, DocumentMagnifyingGlassIcon, ArrowPathIcon
} from '@heroicons/vue/24/outline';

const authStore = useAuthStore()
const { gotoUrl } = useGotoUrl()
const { showAlert } = useConfirm()

const user = computed(() => authStore.user)
const loading = ref(true)
const error = ref(null)
const dashboardStats = ref({
  totalMyStudents: 0,
  averageMyStudents: 0,
  totalMyBulletins: 0,
})
const recentActivities = ref([])

const schoolName = ref('');
const schoolLogo = ref('');
const principalName = ref('');

// For bulletin creation workflow
const showSelectStudentModal = ref(false)
const showBulletinSelectionModal = ref(false)
const selectedStudentForBulletin = ref(null)
const selectedBulletinData = ref(null)
const showBulletinFormModal = ref(false)

// --- Data Loading ---
const loadDashboardData = async () => {
  if (!user.value || !user.value.id || user.value.role !== 'teacher') {
    error.value = 'Accès non autorisé ou utilisateur non trouvé.';
    loading.value = false;
    return;
  }
  loading.value = true;
  error.value = null;

  try {
    // 1. Get teacher's own students
    const myStudents = await FirebaseService.getStudentsForTeacher(user.value.id);
    dashboardStats.value.totalMyStudents = myStudents.length;

    // 2. Calculate average grade for teacher's students
    const myStudentsOverallAverages = myStudents
      .filter(s => s.profile.averageGrade !== undefined && s.profile.averageGrade !== null)
      .map(s => parseFloat(s.profile.averageGrade));

    if (myStudentsOverallAverages.length > 0) {
      const sumAverages = myStudentsOverallAverages.reduce((sum, avg) => sum + avg, 0);
      dashboardStats.value.averageMyStudents = parseFloat((sumAverages / myStudentsOverallAverages.length).toFixed(2));
    } else {
      dashboardStats.value.averageMyStudents = 0;
    }

    // 3. Count bulletins for teacher's students
    const myStudentsBulletinsPromises = myStudents.map(student =>
      FirebaseService.getBulletinsByStudent(student.id)
    );
    const allMyStudentsBulletinsArrays = await Promise.all(myStudentsBulletinsPromises);
    const allMyStudentsBulletins = [].concat(...allMyStudentsBulletinsArrays); // Flatten array of arrays
    dashboardStats.value.totalMyBulletins = allMyStudentsBulletins.length;

    // Fetch School and Principal Information
    if (user.value.profile?.school) {
      const adminSettings = await FirebaseService.getOrCreateSettingsForAdmin(user.value.profile.school);
      if (adminSettings) {
        schoolName.value = adminSettings.name || 'Nom de l\'Établissement';
        schoolLogo.value = adminSettings.logoUrl || 'Logo de l\'établissement';
        const principalUser = await FirebaseService.getUserById(adminSettings.admin);
        if (principalUser) {
          principalName.value = `${principalUser.profile?.firstName || ''} ${principalUser.profile?.lastName || ''}`;
        } else {
          principalName.value = 'Non renseigné';
        }
      } else {
        schoolName.value = 'Nom de l\'Établissement';
        principalName.value = 'Non renseigné';
      }
    } else {
      schoolName.value = 'Non renseigné';
      principalName.value = 'Non renseigné';
    }

  } catch (err) {
    console.error('Error loading teacher dashboard data:', err);
    error.value = 'Erreur lors du chargement de votre tableau de bord: ' + err.message;
    Object.assign(dashboardStats.value, { totalMyStudents: 0, averageMyStudents: 0, totalMyBulletins: 0 }); // Reset stats
  } finally {
    loading.value = false;
  }
};

const classList = ref([])

const fetchAssignedClasses = async () => {
  if (user.value?.profile?.classes?.length > 0) {
    const classNames = await Promise.all(
      user.value.profile.classes.map(async (id) => {
        const classe = await FirebaseService.getClassById(id)
        return classe ? classe.name : id
      })
    )
    classList.value = classNames
  }
}

// --- Bulletin Filling Workflow ---
const openFillBulletinModal = () => {
  // Open a modal to select a student from the teacher's assigned classes
  showSelectStudentModal.value = true;
};

const handleStudentSelectedForBulletin = (student) => {
  selectedStudentForBulletin.value = student;
  showSelectStudentModal.value = false; // Close selection modal

  // Check if student has existing bulletins
  if (student.existingBulletins && student.existingBulletins.length > 0) {
    // Show bulletin selection modal
    showBulletinSelectionModal.value = true;
  } else {
    // No existing bulletins, create new one
    selectedBulletinData.value = null;
    showBulletinFormModal.value = true;
  }
};

const handleBulletinSelected = (bulletin) => {
  selectedBulletinData.value = bulletin;
  showBulletinSelectionModal.value = false;
  showBulletinFormModal.value = true;
};

const handleCreateNewBulletin = () => {
  selectedBulletinData.value = null;
  showBulletinSelectionModal.value = false;
  showBulletinFormModal.value = true;
};

const handleBulletinFormSubmit = async () => {
  // This is called from BulletinForm after submission
  showBulletinFormModal.value = false; // Close BulletinForm
  selectedStudentForBulletin.value = null; // Clear selected student
  selectedBulletinData.value = null; // Clear selected bulletin
  await loadDashboardData(); // Refresh dashboard stats
  showAlert('Succès', 'Bulletin sauvegardé avec succès!', 'Ok');
};

// --- Lifecycle ---
onMounted(() => {
  loadDashboardData();
  fetchAssignedClasses()
});
</script>