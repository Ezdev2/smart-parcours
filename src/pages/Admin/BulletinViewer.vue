<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-gray-900">
        Bulletin de Notes : {{ bulletin?.semester }} ({{ bulletin?.year }}) - {{ student?.profile?.firstName }} {{ student?.profile?.lastName }}
      </h2>
      <div class="flex space-x-2">
        <Button variant="outline" @click="handleEditBulletin" :disabled="loading || !bulletin">
          <PencilIcon class="h-4 w-4 mr-2" /> Modifier
        </Button>
        <Button variant="primary" @click="downloadBulletinPdf" :disabled="loading || !bulletin">
          <ArrowDownTrayIcon class="h-4 w-4 mr-2" /> Télécharger PDF
        </Button>
      </div>
    </div>

    <LoadingSpinner v-if="loading" text="Chargement du bulletin..." color="indigo" class="my-8" />
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
      <div class="text-red-800">{{ error }}</div>
    </div>
    <div v-else-if="!bulletin" class="text-center py-8 text-gray-500">
      Bulletin non trouvé.
    </div>
    
    <Card v-else class="p-8 border border-gray-200 shadow-md printable-area"> 
        <div class="bulletin-template bg-white rounded-lg font-sans text-sm mx-auto my-8">
            <div class="flex justify-between items-start mb-6 border-b pb-4 border-gray-300">
            <div>
                <p class="font-bold text-lg text-indigo-700">{{ schoolName || 'Nom de l\'Établissement' }}</p>
            </div>
            <div class="text-right">
                <h1 class="text-2xl font-bold text-gray-900 mb-1">Bulletin du {{ bulletin.semester?.toLowerCase() }}</h1>
                <p class="text-gray-700 text-base">Élève: <span class="font-semibold">{{ student?.profile?.firstName }} {{ student?.profile?.lastName }}</span></p>
                <p class="text-gray-700 text-base">Né le: <span class="font-semibold">{{ formatDate(student?.profile?.dateOfBirth) }}</span></p>
            </div>
            </div>

            <div class="mb-6 text-gray-700">
            <div>
                <p><strong>Année scolaire :</strong> {{ bulletin.year }}</p>
                <p><strong>Classe :</strong> {{ student?.profile?.classDisplayName }}</p>
                <p><strong>Professeur Principal :</strong> <span class="italic">{{ bulletin.professeurPrincipal || 'Non renseigné' }}</span></p>
            </div>
            </div>

            <div class="mb-6">
            <table class="w-full border-collapse">
                <thead>
                <tr class="bg-gray-100 border border-gray-300">
                    <th class="border border-gray-300 p-2 text-left w-1/5">Matière</th>
                    <th class="border border-gray-300 p-2 text-left w-1/6">Enseignant</th>
                    <th class="border border-gray-300 p-2 text-center w-[60px]">Moyenne Élève</th>
                    <th class="border border-gray-300 p-2 text-center w-[60px]">Coefficient</th>
                    <th class="border border-gray-300 p-2 text-center w-[60px]">Note Classe</th>
                    <th class="border border-gray-300 p-2 text-center w-[60px]">Note la plus haute</th>
                    <th class="border border-gray-300 p-2 text-left">Appréciation</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(subject, index) in bulletin.subjects" :key="index" class="border border-gray-300">
                    <td class="border border-gray-300 p-2 font-semibold">{{ subject.name }}</td>
                    <td class="border border-gray-300 p-2">{{ subject.teacher || '' }}</td>
                    <td class="border border-gray-300 p-2 text-center">{{ subject.grade !== null ? subject.grade : '' }}</td>
                    <td class="border border-gray-300 p-2 text-center">{{ subject.coefficient !== null ? subject.coefficient : '' }}</td>
                    <td class="border border-gray-300 p-2 text-center">{{ subject.classAverage || '' }}</td>
                    <td class="border border-gray-300 p-2 text-center">{{ subject.highestGrade || '' }}</td>
                    <td class="border border-gray-300 p-2 text-sm italic">{{ subject.comment || 'Aucune appréciation.' }}</td>
                </tr>
                </tbody>
                <tfoot>
                <tr>
                    <td colspan="2" class="border border-gray-300 p-2 text-right font-bold bg-gray-50">Moyennes générales :</td>
                    <td class="border border-gray-300 p-2 text-center font-bold bg-gray-50">{{ bulletin.generalAverage !== null ? bulletin.generalAverage : '' }}</td>
                    <td colspan="4" class="border border-gray-300 p-2 bg-gray-50"></td>
                </tr>
                </tfoot>
            </table>
            </div>

            <div class="mt-8 text-xs text-gray-500 border-t pt-4 mb-8">
                <div class="flex justify-between items-center mb-2">
                    <p><strong>Rang dans la classe :</strong> {{ bulletin.classRank || '' }} / {{ bulletin.totalStudents || '' }}</p>
                    <p><strong>Inscrit le :</strong> {{ formatDate(student?.createdAt) }}</p>
                </div>
            </div>

            <div class="flex flex-col gap-x-12 text-gray-700">
                <div class="mb-8">
                    <p><strong>Absences, vie scolaire :</strong></p>
                    <p class="italic text-sm ml-4 border-b border-gray-300 pb-2 mb-2">{{ bulletin.absencesComment || '' }}</p>
                    <p class="mt-4"><strong>Appréciation générale :</strong></p>
                    <p class="italic text-sm ml-4 border-b border-gray-300 pb-2 mb-2">{{ bulletin.generalComment || '' }}</p>
                </div>
                <div class="text-right flex flex-col justify-between">
                    <div>
                        <p>Visa du chef d'établissement ou de son délégué :</p>
                        <div class="border-b border-gray-500 w-full mt-8 mb-4 h-8"></div>
                    </div>
                    <div>
                        <p>Signature des parents :</p>
                        <div class="border-b border-gray-500 w-full mt-8 h-8"></div>
                    </div>
                </div>
            </div>
      </div>
    </Card>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { FirebaseService } from '../../services/firebaseService';
import { useConfirm } from '../../composables/useConfirm';
import LoadingSpinner from '../../components/UI/LoadingSpinner.vue';
import Card from '../../components/UI/Card.vue';
import Button from '../../components/UI/Button.vue';
import { PencilIcon, ArrowDownTrayIcon } from '@heroicons/vue/24/outline';
import html2pdf from 'html2pdf.js';

const props = defineProps({
  bulletinId: {
    type: String,
    required: true
  },
  studentId: { // Needed to fetch student details for the template
    type: String,
    required: true
  }
});

const emit = defineEmits([
  'open-edit-bulletin',
  'has-changes' // This component is primarily for viewing, so has-changes might always be false
]);

const { showAlert } = useConfirm();

const bulletin = ref(null);
const student = ref(null);
const schoolName = ref('');
const loading = ref(true);
const error = ref(null);

const formatDate = (dateValue) => {
  if (!dateValue) return "Non renseignée";
  let date;
  if (dateValue.seconds) {
    date = new Date(dateValue.seconds * 1000);
  } else if (typeof dateValue === 'string') {
    date = new Date(dateValue);
  } else if (dateValue instanceof Date) {
    date = dateValue;
  } else {
    return "Non renseignée";
  }
  return date.toLocaleDateString("fr-FR");
};

const loadBulletinAndStudent = async () => {
  loading.value = true;
  error.value = null;
  try {
    // Fetch bulletin
    const fetchedBulletin = await FirebaseService.getBulletinById(props.bulletinId);
    if (!fetchedBulletin) {
      error.value = "Bulletin non trouvé.";
      bulletin.value = null;
      return;
    }
    bulletin.value = fetchedBulletin;

    // Fetch student
    const fetchedStudent = await FirebaseService.getUserById(props.studentId);
    if (!fetchedStudent) {
      error.value = "Étudiant associé au bulletin non trouvé.";
      student.value = null;
      return;
    }
    student.value = fetchedStudent;

    // Fetch Admin Settings (School Information)
    if (student.value.profile?.school) {
        const adminSettings = await FirebaseService.getOrCreateSettingsForAdmin(student.value.profile.school);
        if (adminSettings) {
            schoolName.value = adminSettings.name || 'Nom de l\'Établissement';
        } else {
            schoolName.value = 'Nom de l\'Établissement';
        }
    } else {
        schoolName.value = 'Nom de l\'Établissement';
    }
    
    // Ensure class display name is available for the template
    if (student.value.profile?.class) {
      const classInfo = await FirebaseService.getClassById(student.value.profile.class);
      student.value.profile.classDisplayName = classInfo ? classInfo.name : student.value.profile.class;
    }

    // Calculate totalStudents if not already present in bulletin data
    if (!bulletin.value.totalStudents && student.value.profile.class && student.value.profile.school) {
        const totalStudentsInClass = await FirebaseService.getStudentCountInClass(
            student.value.profile.class,
            student.value.profile.school
        );
        // Update the bulletin ref directly, this won't persist to Firestore unless saved
        bulletin.value.totalStudents = totalStudentsInClass;
    }


  } catch (err) {
    console.error("Error loading bulletin or student:", err);
    error.value = "Erreur lors du chargement du bulletin: " + err.message;
  } finally {
    loading.value = false;
  }
};

const handleEditBulletin = () => {
  emit('open-edit-bulletin', bulletin.value);
};

const downloadBulletinPdf = async () => {
    try {
        const element = document.querySelector('.bulletin-template'); // Select the element to print
        if (!element) {
            showAlert('Erreur', 'Contenu du bulletin introuvable pour la génération PDF.', 'Ok');
            return;
        }

        const options = {
            margin: 10,
            filename: `bulletin_${student.value?.profile?.lastName || 'Eleve'}_${bulletin.value?.year || 'Annee'}_${bulletin.value?.semester || 'Semestre'}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        // Use a slight delay to ensure all content is rendered correctly before PDF generation
        await new Promise(resolve => setTimeout(resolve, 100)); // Small delay

        html2pdf().from(element).set(options).save();
        showAlert('Succès', 'Le bulletin PDF est en cours de téléchargement.', 'Ok');

    } catch (err) {
        console.error("Error downloading PDF:", err);
        showAlert('Erreur', "Impossible de télécharger le bulletin PDF: " + err.message, 'Compris');
    }
};

watch(() => props.bulletinId, loadBulletinAndStudent, { immediate: true });
watch(() => props.studentId, loadBulletinAndStudent, { immediate: true });

onMounted(() => {
  // Initial load is handled by watch with immediate:true
});
</script>

<style scoped>
.bulletin-template {
  max-width: 210mm; /* A4 width */
  /* min-height: 297mm;  */
  /* box-shadow: 0 0 10px rgba(0,0,0,0.1); */
}

/* Ensure table borders are visible for printing */
table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 8px;
  border: 1px solid #d1d5db; /* Tailwind gray-300 */
}

thead th {
  background-color: #f3f4f6; /* Tailwind gray-100 */
  font-weight: 600;
  text-align: left;
}

tfoot td {
  background-color: #f9fafb; /* Tailwind gray-50 */
}

@media print {
  .no-print {
    display: none !important;
  }
  .printable-area {
    box-shadow: none !important;
    border: none !important;
    margin: 0 !important;
    padding: 0 !important;
    min-height: 297mm;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
  }
}
</style>