<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-gray-900">Gestion des Enseignants</h2>
      <Button @click="openAddTeacherForm">
        <PlusIcon class="h-5 w-5 mr-2" /> Ajouter un enseignant
      </Button>
    </div>

    <LoadingSpinner v-if="loading" text="Chargement des enseignants..." color="blue" class="my-8" />

    <div v-else-if="teachers.length === 0">
      <EmptyState
        :icon="UserGroupIcon"
        title="Aucun enseignant"
        description="Aucun enseignant n'a été ajouté à votre établissement pour le moment."
        buttonText="Ajouter le premier enseignant"
        @action="openAddTeacherForm"
      />
    </div>

    <Card v-else>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 text-sm">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-4 py-2 text-left font-medium text-gray-700">Nom Complet</th>
              <th class="px-4 py-2 text-left font-medium text-gray-700">Email</th>
              <th class="px-4 py-2 text-left font-medium text-gray-700">Classes Assignées</th>
              <th class="px-4 py-2 text-left font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 bg-white">
            <tr v-for="teacher in teachers" :key="teacher.id">
              <td class="px-4 py-2">{{ teacher.profile.firstName }} {{ teacher.profile.lastName }}</td>
              <td class="px-4 py-2">{{ teacher.email }}</td>
              <td class="px-4 py-2">
                <span v-if="teacher.profile.classNames && teacher.profile.classNames.length > 0">
                  {{ teacher.profile.classNames.join(', ') }}
                </span>
                <span v-else class="text-gray-500">Aucune</span>
              </td>
              <td class="px-4 py-2 flex space-x-2">
                <Button size="sm" variant="outline" @click="openEditTeacherForm(teacher)">
                  <PencilIcon class="h-4 w-4" />
                </Button>
                <Button size="sm" variant="danger" @click="confirmDeleteTeacher(teacher.id)">
                  <TrashIcon class="h-4 w-4" />
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>

    <AddEditTeacherForm
      v-if="showTeacherFormModal"
      :mode="teacherFormMode"
      :initial-data="editingTeacher"
      :all-classes="allAvailableClasses"
      @submit="handleTeacherFormSubmit"
      @cancel="cancelTeacherForm"
    />

    <ConfirmDialog />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { FirebaseService } from './../../services/firebaseService';
import { useAuthStore } from './../../stores/auth';
import { useConfirm } from './../../composables/useConfirm';
import Card from './../../components/UI/Card.vue';
import Button from './../../components/UI/Button.vue';
import LoadingSpinner from './../../components/UI/LoadingSpinner.vue';
import EmptyState from './../../components/UI/EmptyState.vue';
import AddEditTeacherForm from './AddEditTeacherForm.vue';
import { PlusIcon, PencilIcon, TrashIcon, UserGroupIcon } from '@heroicons/vue/24/outline';
import ConfirmDialog from '../../components/UI/ConfirmDialog.vue';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const { showConfirm, showAlert } = useConfirm();

const teachers = ref([]);
const allAvailableClasses = ref([]);
const loading = ref(true);
const showTeacherFormModal = ref(false);
const editingTeacher = ref(null);
const teacherFormMode = ref('add'); // Corrigé: valeur par défaut cohérente

const user = computed(() => authStore.user);

// --- Data Loading ---
const loadTeachersAndClasses = async () => {
  if (!user.value || !user.value.id) {
    showAlert('Erreur', 'ID administrateur non disponible.', 'Ok');
    return;
  }
  loading.value = true;
  try {
    const [fetchedTeachers, fetchedClasses] = await Promise.all([
      FirebaseService.getAllTeachersForAdmin(user.value.id),
      FirebaseService.getAllClasses() // Get all classes to assign to teachers
    ]);
    teachers.value = fetchedTeachers;
    allAvailableClasses.value = fetchedClasses;
  } catch (error) {
    console.error("Error loading teachers or classes:", error);
    showAlert('Erreur', 'Impossible de charger les données des enseignants ou des classes: ' + error.message, 'Compris');
    teachers.value = [];
    allAvailableClasses.value = [];
  } finally {
    loading.value = false;
  }
};

// --- Form Management ---
const openAddTeacherForm = () => {
  editingTeacher.value = null;
  teacherFormMode.value = "add";
  showTeacherFormModal.value = true;
};

const openEditTeacherForm = (teacher) => {
  // Copie profonde pour éviter les mutations non désirées
  editingTeacher.value = {
    id: teacher.id,
    email: teacher.email,
    profile: {
      firstName: teacher.profile?.firstName || '',
      lastName: teacher.profile?.lastName || '',
      classes: teacher.profile?.classes || [],
      classNames: teacher.profile?.classNames || []
    }
  };
  teacherFormMode.value = "edit"; // Corrigé: doit être une string
  showTeacherFormModal.value = true;
};

const handleTeacherFormSubmit = async (teacherData, mode) => {
  if (!user.value || !user.value.id) {
    showAlert('Erreur', 'ID administrateur non disponible pour cette opération.', 'Ok');
    return;
  }
  try {
    if (mode === 'add') {
      const result = await FirebaseService.createTeacher(teacherData, user.value.id);
      showAlert('Succès', `Enseignant ${teacherData.firstName} ${teacherData.lastName} ajouté. Mot de passe temporaire: ${result.temporaryPassword}. Un email de réinitialisation a été envoyé.`, 'Ok');
      router.push('/teacher/dashboard');
    } else if (mode === 'edit' && editingTeacher.value) {
      await FirebaseService.updateUserProfile(editingTeacher.value.id, {
        email: teacherData.email,
        profile: {
          firstName: teacherData.firstName,
          lastName: teacherData.lastName,
          classes: teacherData.classes,
        }
      });
      showAlert('Succès', `Enseignant ${teacherData.firstName} ${teacherData.lastName} mis à jour.`, 'Ok');
    }
    await updateSettingsTeachersArray();
    await loadTeachersAndClasses();
    cancelTeacherForm();
  } catch (error) {
    console.error(`Error ${mode}ing teacher:`, error);
    showAlert('Erreur', `Erreur lors de l'${mode === 'add' ? 'ajout' : 'édition'} de l'enseignant: ${error.message}`, 'Compris');
  }
};

const cancelTeacherForm = () => {
  showTeacherFormModal.value = false;
  editingTeacher.value = null;
  teacherFormMode.value = "add"; // Reset à la valeur par défaut
};

const confirmDeleteTeacher = async (teacherId) => {
  const confirmed = await showConfirm(
    'Confirmation de désactivation',
    'Êtes-vous sûr de vouloir désactiver ce compte enseignant ? Cela le rendra inactif.',
    'Oui, désactiver',
    'Annuler'
  );

  if (confirmed) {
    try {
      await FirebaseService.deactivateUser(teacherId);
      await updateSettingsTeachersArray();
      showAlert('Succès', 'Compte enseignant désactivé avec succès.', 'Ok');
      await loadTeachersAndClasses();
    } catch (error) {
      console.error('Error deactivating teacher:', error);
      showAlert('Erreur', 'Erreur lors de la désactivation du compte enseignant: ' + error.message, 'Compris');
    }
  }
};

// --- Function to update the settings' teachers array ---
const updateSettingsTeachersArray = async () => {
  if (!user.value || !user.value.id) return;
  try {
    const currentSettings = await FirebaseService.getOrCreateSettingsForAdmin(user.value.id);
    const activeTeachers = await FirebaseService.getAllTeachersForAdmin(user.value.id);
    const activeTeacherIds = activeTeachers.map(t => t.id);

    await FirebaseService.updateSettings(currentSettings.id, {
      ...currentSettings,
      teachers: activeTeacherIds
    });
    console.log("Settings' teachers array updated.");
  } catch (error) {
    console.error("Error updating settings teachers array:", error);
    showAlert('Erreur', "Erreur lors de la mise à jour de la liste des enseignants dans les paramètres de l'établissement.", 'Compris');
  }
};

// --- Lifecycle ---
onMounted(() => {
  loadTeachersAndClasses();
});
</script>