<template>
  <div class="space-y-6">
    <LoadingSpinner v-if="loading" text="Chargement des détails de l'étudiant..." color="blue" class="my-8" />

    <div v-else-if="student">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-gray-900">
          <template v-if="viewingBulletinId">
            Bulletin de {{ student.profile.firstName }} {{ student.profile.lastName }}
          </template>
          <template v-else>
            Détails de l'Étudiant: {{ student.profile.firstName }} {{ student.profile.lastName }}
          </template>
        </h2>
        <div class="flex space-x-2">
          <template v-if="!viewingBulletinId">
            <Button variant="outline" @click="openEditFormForDetails">
              <PencilIcon class="h-4 w-4 mr-2" /> Éditer l'étudiant
            </Button>
            <Button variant="danger" @click="confirmDeleteStudent">
              <TrashIcon class="h-4 w-4 mr-2" /> Supprimer l'étudiant
            </Button>
          </template>
          <template v-else>
             <Button variant="outline" @click="cancelBulletinView">
                <ArrowUturnLeftIcon class="h-4 w-4 mr-2" /> Retour à la liste des bulletins
            </Button>
          </template>
        </div>
      </div>

      <div v-if="error" class="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
        <div class="text-red-800">{{ error }}</div>
      </div>

      <template v-if="!viewingBulletinId">
        <Card class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-3">Informations Personnelles</h3>
            <div class="space-y-2 text-sm">
              <p><strong>Nom complet:</strong> {{ student.profile.firstName }} {{ student.profile.lastName }}</p>
              <p><strong>Email:</strong> {{ student.email }}</p>
              <p><strong>Date de naissance:</strong> {{ formatDate(student.profile.dateOfBirth) }}</p>
              <p><strong>Classe:</strong> {{ student.profile.classDisplayName }}</p>
              <p><strong>Moyenne générale:</strong> {{ student.profile.averageGrade || 'N/A' }}/20</p>
              <p><strong>Niveau:</strong> {{ student.profile.level || 'Non défini' }}</p>
              <p><strong>Code d'inscription:</strong> <span class="font-mono bg-gray-100 px-1 rounded">{{ student.profile.registrationCode }}</span></p>
              <p><strong>Inscrit le:</strong> {{ formatDate(student.createdAt) }}</p>
              <p><strong>École:</strong> {{ schoolName }}</p>
            </div>
          </div>
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-3">Autres Informations</h3>
            <div class="space-y-2 text-sm">
              <div>
                <strong>Filières d'intérêt:</strong>
                <div class="flex flex-wrap gap-1 mt-1">
                  <span
                    v-for="filiere in student.profile.filieres"
                    :key="filiere"
                    class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {{ filiere }}
                  </span>
                  <span v-if="!student.profile.filieres || student.profile.filieres.length === 0" class="text-gray-500">Aucune</span>
                </div>
              </div>
              <div>
                <strong>Centres d'intérêt:</strong>
                <div class="flex flex-wrap gap-1 mt-1">
                  <span
                    v-for="interest in student.profile.interests"
                    :key="interest"
                    class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                  >
                    {{ interest }}
                  </span>
                  <span v-if="!student.profile.interests || student.profile.interests.length === 0" class="text-gray-500">Aucun</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card class="mt-8">
          <h3 class="text-xl font-bold text-gray-900 mb-4">Bulletins de l'Étudiant</h3>
          <div class="flex justify-end mb-4">
            <Button @click="createNewBulletin" :disabled="creatingBulletin">
              <PlusIcon class="h-4 w-4 mr-2" />
              {{ creatingBulletin ? 'Création...' : 'Ajouter un bulletin' }}
            </Button>
          </div>

          <div v-if="bulletins.length === 0" class="text-center py-8 text-gray-500">
            Aucun bulletin trouvé pour cet étudiant.
          </div>

          <div v-else class="space-y-4">
            <div v-for="bulletin in bulletins" :key="bulletin.id" class="flex items-center justify-between p-3 bg-gray-50 rounded-md border">
              <div>
                <p class="font-medium text-gray-900">Bulletin {{ bulletin.semester }} ({{ bulletin.year }})</p>
                <p class="text-sm text-gray-600">Moyenne: {{ bulletin.generalAverage || 'N/A' }}/20</p>
                <p class="text-xs text-gray-500">Mis à jour: {{ formatDate(bulletin.updatedAt) }}</p>
              </div>
              <div class="flex space-x-2">
                <Button size="sm" variant="secondary" @click="viewBulletin(bulletin.id)">
                  <EyeIcon class="h-4 w-4 mr-2" /> Voir
                </Button>
                <Button size="sm" variant="outline" @click="editBulletin(bulletin.id)">
                  <PencilIcon class="h-4 w-4 mr-2" /> Modifier
                </Button>
                <Button size="sm" variant="danger" @click="confirmDeleteBulletin(bulletin.id)">
                  <TrashIcon class="h-4 w-4 mr-2" /> Supprimer
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </template>
      
      <template v-else>
        <BulletinViewer 
          :bulletin-id="viewingBulletinId" 
          :student-id="props.studentId" 
          @open-edit-bulletin="openEditBulletinFromViewer" 
          @has-changes="setBulletinViewerHasChanges"
        />
      </template>
    </div>
    
    <div v-else class="text-center py-8 text-gray-500">
      <p>Impossible de charger les détails de l'étudiant.</p>
    </div>

    <BulletinForm
      v-if="showBulletinFormModal"
      :initial-data="editingBulletinData"
      :student-id="studentId"
      @submit="handleBulletinSubmit"
      @cancel="cancelBulletinForm"
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue' // Import 'computed'
import { FirebaseService } from '../../services/firebaseService'
import Card from '../../components/UI/Card.vue'
import Button from '../../components/UI/Button.vue'
import BulletinForm from './BulletinForm.vue'
import LoadingSpinner from '../../components/UI/LoadingSpinner.vue';
import BulletinViewer from './BulletinViewer.vue'; // Make sure this path is correct
import { useConfirm } from '../../composables/useConfirm';

import { PencilIcon, TrashIcon, PlusIcon, EyeIcon, ArrowUturnLeftIcon } from '@heroicons/vue/24/outline' // Add ArrowUturnLeftIcon

const props = defineProps({
  studentId: {
    type: String,
    required: true
  }
})

const emit = defineEmits([
  'close', // To go back to student list
  'student-updated',
  'student-deleted',
  'open-edit-student', // To open student edit form from here
  'has-changes' // Propagate unsaved changes up to parent (UserManagement)
]);

const { showConfirm, showAlert } = useConfirm();

const student = ref(null)
const schoolName = ref('');
const bulletins = ref([])
const loading = ref(true)
const error = ref(null)
const creatingBulletin = ref(false)

const showBulletinFormModal = ref(false)
const editingBulletinData = ref(null)
const viewingBulletinId = ref(null); // Key ref to switch between views

const panelHasChanges = ref(false); // For unsaved changes in student details part
const bulletinViewerHasChanges = ref(false); // For unsaved changes within the bulletin viewer (if it becomes editable)

// Computed property to determine if there are any unsaved changes in this panel
const hasChanges = computed(() => {
    return panelHasChanges.value || bulletinViewerHasChanges.value;
});

// Watch hasChanges and emit it to the parent
watch(hasChanges, (newVal) => {
  emit('has-changes', newVal);
});


const formatDate = (dateValue) => {
  if (!dateValue) return "Non renseignée"
  let date
  if (dateValue.seconds) {
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

const loadStudentDetails = async () => {
  if (!props.studentId) {
    error.value = "ID étudiant manquant.";
    return;
  }

  loading.value = true;
  error.value = null;
  try {
    const fetchedStudent = await FirebaseService.getUserById(props.studentId);
    if (fetchedStudent) {
      student.value = fetchedStudent;
      if (student.value.profile.class) {
        const classInfo = await FirebaseService.getClassById(student.value.profile.class);
        student.value.profile.classDisplayName = classInfo ? classInfo.name : student.value.profile.class;
      }
      bulletins.value = await FirebaseService.getBulletinsByStudent(props.studentId);
      panelHasChanges.value = false; // Reset on load
      bulletinViewerHasChanges.value = false; // Reset on load

      // Call loadSchoolDetails after student details are loaded
      await loadSchoolDetails();

    } else {
      error.value = "Étudiant non trouvé.";
      student.value = null;
    }
  } catch (err) {
    console.error("Error loading student details:", err);
    error.value = "Erreur lors du chargement des détails de l'étudiant: " + err.message;
  } finally {
    loading.value = false;
  }
}

const loadSchoolDetails = async () => {
  try {
    // Ensure student.value and student.value.profile.school exist before fetching settings
    if (student.value && student.value.profile?.school) {
        const adminSettings = await FirebaseService.getOrCreateSettingsForAdmin(student.value.profile.school);
        if (adminSettings) {
            schoolName.value = adminSettings.name || 'Nom de l\'Établissement';
        } else {
            schoolName.value = 'Nom de l\'Établissement';
        }
    } else {
      schoolName.value = 'Nom de l\'Établissement'; // Default if no school ID is found
    }
  } catch (err) {
    console.error("Error loading school details:", err);
    // You might want to set an error specifically for school details if needed,
    // but avoid overwriting main 'error' for student details.
    schoolName.value = 'Erreur de chargement'; // Indicate error
  }
}

const openEditFormForDetails = () => {
  emit('open-edit-student', student.value);
};

const confirmDeleteStudent = async () => {
  const confirmed = await showConfirm(
    'Confirmation de désactivation',
    'Êtes-vous sûr de vouloir désactiver ce compte étudiant ? Cela le rendra inactif et il ne pourra plus se connecter.',
    'Oui, désactiver',
    'Annuler'
  );

  if (confirmed) {
    try {
      await FirebaseService.deleteStudent(props.studentId);
      await showAlert('Succès', 'Compte étudiant désactivé avec succès.', 'Ok');
      emit('student-deleted');
    } catch (err) {
      console.error("Error deactivating student:", err);
      await showAlert('Erreur', 'Erreur lors de la désactivation de l\'étudiant: ' + err.message, 'Compris');
    }
  }
};

const createNewBulletin = async () => {
  creatingBulletin.value = true;
  try {
    const newBulletinId = await FirebaseService.createBulletin({
      studentId: props.studentId,
      year: new Date().getFullYear().toString(),
      semester: `Nouveau Bulletin (${bulletins.value.length + 1})`,
      generalAverage: null,
      notes: [], // Keeping this as empty as 'subjects' is used for detailed notes
      generalComment: "",
      classRank: null,
      totalStudents: null, // Will be calculated by BulletinForm or on display
      professeurPrincipal: null, // Will be set by BulletinForm
      absencesComment: "",
      subjects: []
    });
    await showAlert('Succès', `Nouveau bulletin créé avec l'ID: ${newBulletinId}`, 'Ok');
    await loadStudentDetails();
  } catch (err) {
    console.error("Error creating new bulletin:", err);
    await showAlert('Erreur', "Erreur lors de la création du bulletin: " + err.message, 'Compris');
  } finally {
    creatingBulletin.value = false;
  }
};

// Function to view a specific bulletin
const viewBulletin = (bulletinId) => {
  viewingBulletinId.value = bulletinId; // Set the ID to show the BulletinViewer
};

// Function to go back from BulletinViewer to the list of bulletins
const cancelBulletinView = async () => {viewingBulletinId.value = null; // Hide the viewer, show the list of bulletins
    await loadStudentDetails(); 
}

const editBulletin = async (bulletinId) => {
  try {
    editingBulletinData.value = await FirebaseService.getBulletinById(bulletinId);
    if (editingBulletinData.value) {
      showBulletinFormModal.value = true;
    } else {
      await showAlert('Erreur', "Bulletin non trouvé.", 'Ok');
    }
  } catch (err) {
    console.error("Error fetching bulletin for edit:", err);
    await showAlert('Erreur', "Erreur lors du chargement du bulletin pour modification.", 'Compris');
  }
};

// This is called from BulletinViewer when its "Modifier" button is clicked
const openEditBulletinFromViewer = (bulletinData) => {
    editingBulletinData.value = bulletinData;
    showBulletinFormModal.value = true;
}

const handleBulletinSubmit = async () => {
  await showAlert('Succès', 'Bulletin mis à jour avec succès !', 'Ok');
  showBulletinFormModal.value = false;
  await loadStudentDetails(); // Refresh bulletins after save
  // No need to reset viewingBulletinId, as the viewer should reflect updates
};

const cancelBulletinForm = async () => {
    // Optional: implement check for modifications for the bulletin form if you added change tracking there.
    showBulletinFormModal.value = false;
};

const confirmDeleteBulletin = async (bulletinId) => {
  const confirmed = await showConfirm(
    'Confirmation de suppression',
    'Êtes-vous sûr de vouloir supprimer ce bulletin ? Cette action est irréversible.',
    'Oui, supprimer',
    'Annuler'
  );

  if (confirmed) {
    try {
      await FirebaseService.deleteBulletin(bulletinId);
      await showAlert('Succès', 'Bulletin supprimé avec succès.', 'Ok');
      await loadStudentDetails();
    } catch (err) {
      console.error("Error deleting bulletin:", err);
      await showAlert('Erreur', 'Erreur lors de la suppression du bulletin: ' + err.message, 'Compris');
    }
  }
};

const setBulletinViewerHasChanges = (hasChanges) => {
    // BulletinViewer is view-only, so this will usually be false unless you add editable fields there.
    bulletinViewerHasChanges.value = hasChanges;
};

watch(() => props.studentId, loadStudentDetails, { immediate: true });

onMounted(() => {
  // loadSchoolDetails() is now called within loadStudentDetails
});
</script>