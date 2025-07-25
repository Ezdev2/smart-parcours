<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <Card class="relative w-full max-w-4xl p-6 overflow-y-auto max-h-[90vh]">
      <button @click="$emit('cancel')" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
        <XMarkIcon class="h-6 w-6" />
      </button>
      <h2 class="text-xl font-bold mb-4">{{ initialData ? 'Modifier le Bulletin' : 'Ajouter un Bulletin' }}</h2>
      
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Année Académique</label>
            <input type="text" v-model="formData.year" required 
              placeholder="Ex: 2024-2025"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Période (Semestre/Trimestre)</label>
            <input type="text" v-model="formData.semester" required 
              placeholder="Ex: Semestre 1, Trimestre 2"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Professeur Principal</label>
          <input type="text" :value="adminFullName" readonly
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-700" />
          <p class="mt-1 text-xs text-gray-500">Nom de l'administrateur connecté.</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Moyenne Générale</label>
          <input type="number" step="0.1" min="0" max="20" 
            :value="calculatedGeneralAverage" readonly class="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100" />
          <p class="mt-1 text-xs text-gray-500">Calculée automatiquement à partir des matières.</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label class="block text-sm font-medium text-gray-700">Rang dans la classe (Optionnel)</label>
                <input type="number" min="1" v-model.number="formData.classRank" 
                    placeholder="Ex: 3"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700">Nombre total d'élèves dans la classe</label>
                <input type="number" min="1" v-model.number="formData.totalStudents" readonly
                    placeholder="Calculé automatiquement"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100" />
                <p class="mt-1 text-xs text-gray-500">Ce champ est automatiquement calculé.</p>
            </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Commentaire Général (Optionnel)</label>
          <textarea v-model="formData.generalComment" rows="3" 
            placeholder="Ex: Bon trimestre, élève sérieux et motivé."
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
        </div>

        <div>
            <label class="block text-sm font-medium text-gray-700">Commentaire Absences/Vie Scolaire (Optionnel)</label>
            <textarea v-model="formData.absencesComment" rows="2"
                placeholder="Ex: 2 retards, 1 absence justifiée."
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
            <p class="mt-1 text-xs text-gray-500">Ce champ est à compléter manuellement pour les retards/absences non gérés par l'application.</p>
        </div>

        <div class="border-t pt-4 mt-4">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-lg font-bold text-gray-800">Notes par Matière</h3>
            <Button type="button" @click="addSubject" size="sm" variant="secondary">
              <PlusIcon class="h-4 w-4 mr-1" /> Ajouter une matière
            </Button>
          </div>

          <div v-if="formData.subjects.length === 0" class="text-center text-gray-500 py-4">
            Aucune matière ajoutée pour le moment.
          </div>

          <div v-else class="space-y-4">
            <div 
              v-for="(subject, index) in formData.subjects" 
              :key="index" 
              class="p-4 border border-gray-200 rounded-md bg-white shadow-sm relative"
            >
              <button 
                type="button" 
                @click="removeSubject(index)" 
                class="absolute top-2 right-2 text-red-500 hover:text-red-700 p-1 rounded-full bg-gray-50"
              >
                <TrashIcon class="h-5 w-5"/>
              </button>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Nom de la matière</label>
                  <select v-model="subject.name" 
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                    <option value="">Sélectionner une matière</option>
                    <option v-for="s in availableSubjects" :key="s.id" :value="s.name">
                      {{ s.name }}
                    </option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Enseignant</label>
                  <input type="text" v-model="subject.teacher" 
                    placeholder="Ex: M. Dupont"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Note (/20)</label>
                  <input type="number" step="0.1" min="0" max="20" v-model.number="subject.grade" required 
                    placeholder="Ex: 16.5"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Coefficient</label>
                  <select v-model.number="subject.coefficient" 
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                    <option :value="null">Auto (si sélectionné)</option>
                    <option v-for="i in 10" :key="i" :value="i">{{ i }}</option>
                  </select>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Moyenne de la Classe (Optionnel)</label>
                  <input type="number" step="0.1" min="0" max="20" v-model.number="subject.classAverage"
                    placeholder="Ex: 14.5"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Note la plus haute (Optionnel)</label>
                  <input type="number" step="0.1" min="0" max="20" v-model.number="subject.highestGrade"
                    placeholder="Ex: 19.0"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
              </div>
              <div class="mt-4">
                <label class="block text-sm font-medium text-gray-700">Commentaire (Optionnel)</label>
                <textarea v-model="subject.comment" rows="2" 
                  placeholder="Ex: Excellent travail, continue ainsi."
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end space-x-3 mt-6">
          <Button type="button" variant="outline" @click="$emit('cancel')">Annuler</Button>
          <Button type="submit">
            {{ initialData ? 'Mettre à jour le bulletin' : 'Créer le bulletin' }}
          </Button>
        </div>
      </form>
    </Card>
  </div>
</template>

<script setup>
import { reactive, watch, ref, onMounted, computed } from 'vue';
import { FirebaseService } from '../../services/firebaseService';
import Card from '../../components/UI/Card.vue';
import Button from '../../components/UI/Button.vue';
import { XMarkIcon, PlusIcon, TrashIcon } from '@heroicons/vue/24/outline';
import { useAuthStore } from '../../stores/auth';

const props = defineProps({
  initialData: {
    type: Object,
    default: null
  },
  studentId: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['submit', 'cancel']);
const authStore = useAuthStore();

const formData = reactive({
  year: new Date().getFullYear().toString(),
  semester: '',
  generalAverage: null, // Will be calculated
  classRank: null,
  totalStudents: null, // Will be calculated
  generalComment: '',
  professeurPrincipal: null, // This will be managed by admin's full name
  absencesComment: null,
  subjects: []
});

const availableSubjects = ref([]);
const studentClassAndSchool = ref(null); // To store student's class and school for totalStudents calculation

// Computed property for admin's full name
const adminFullName = computed(() => {
  if (authStore.user?.profile?.firstName && authStore.user?.profile?.lastName) {
    return `${authStore.user.profile.firstName} ${authStore.user.profile.lastName}`;
  }
  return 'Non renseigné';
});

// Computed property to calculate general average
const calculatedGeneralAverage = computed(() => {
  let totalWeightedGrades = 0;
  let totalCoefficients = 0;

  formData.subjects.forEach(subject => {
    const grade = parseFloat(subject.grade);
    const coefficient = parseFloat(subject.coefficient);

    if (!isNaN(grade) && !isNaN(coefficient) && grade >= 0 && grade <= 20 && coefficient > 0) {
      totalWeightedGrades += grade * coefficient;
      totalCoefficients += coefficient;
    }
  });

  if (totalCoefficients > 0) {
    return (totalWeightedGrades / totalCoefficients).toFixed(2);
  }
  return '';
});


// Load student's class and school to calculate totalStudents
const loadStudentClassAndSchool = async () => {
    try {
        const studentInfo = await FirebaseService.getUserById(props.studentId);
        if (studentInfo && studentInfo.profile?.class && studentInfo.profile?.school) {
            studentClassAndSchool.value = {
                classId: studentInfo.profile.class,
                schoolId: studentInfo.profile.school
            };
        } else {
            console.warn("Student class or school ID not found for totalStudents calculation.");
            studentClassAndSchool.value = null;
        }
    } catch (error) {
        console.error("Error loading student info for totalStudents:", error);
        studentClassAndSchool.value = null;
    }
};

// Load available subjects from admin settings
const loadAvailableSubjects = async () => {
  if (!authStore.user || !authStore.user.id) {
    console.warn("Admin ID not available to load subjects from settings.");
    return;
  }
  try {
    const adminSettings = await FirebaseService.getOrCreateSettingsForAdmin(authStore.user.id);
    if (adminSettings && adminSettings.subjects && adminSettings.subjects.length > 0) {
      const subjectPromises = adminSettings.subjects.map(id => FirebaseService.getSubjectById(id));
      const fetchedSubjects = await Promise.all(subjectPromises);
      availableSubjects.value = fetchedSubjects.filter(s => s !== null);
    } else {
      availableSubjects.value = [];
    }
  } catch (error) {
    console.error("Error loading available subjects:", error);
    availableSubjects.value = [];
  }
};

// Watch for initialData changes to populate the form (for edit mode)
watch(() => props.initialData, async (newVal) => {
  await loadAvailableSubjects(); // Load subjects first
  await loadStudentClassAndSchool(); // Load student's class/school for totalStudents

  // Pre-fill professeurPrincipal with admin's name if creating a new bulletin,
  // or use existing value if editing.
  // Note: if initialData.professeurPrincipal is null but adminFullName is available, use adminFullName.
  // Otherwise, use initialData.professeurPrincipal.
  formData.professeurPrincipal = newVal?.professeurPrincipal || adminFullName.value;


  if (newVal) {
    formData.year = newVal.year || new Date().getFullYear().toString();
    formData.semester = newVal.semester || '';
    formData.generalAverage = newVal.generalAverage || null; // Will be overridden by calculated average on submit
    formData.classRank = newVal.classRank || null;
    formData.totalStudents = newVal.totalStudents || null; // Existing value if any
    formData.generalComment = newVal.generalComment || '';
    formData.absencesComment = newVal.absencesComment || null;
    formData.subjects = newVal.subjects ? newVal.subjects.map(sub => ({
      ...sub,
      coefficient: typeof sub.coefficient === 'string' ? parseFloat(sub.coefficient) : sub.coefficient,
      classAverage: sub.classAverage || null,
      highestGrade: sub.highestGrade || null
    })) : [];
  } else {
    // Reset for new bulletin (add mode)
    formData.year = new Date().getFullYear().toString();
    formData.semester = '';
    formData.generalAverage = null; // Will be calculated on submit
    formData.classRank = null;
    formData.totalStudents = null; // Will be calculated on submit
    formData.generalComment = '';
    formData.absencesComment = null;
    formData.subjects = [];
  }
}, { immediate: true });


// Watch for selected subject name to auto-fill coefficient, classAverage, highestGrade
watch(formData.subjects, (newSubjects) => {
  newSubjects.forEach(subject => {
    const selectedSubjectFromSettings = availableSubjects.value.find(s => s.name === subject.name);
    
    // Auto-fill coefficient if selected and not manually set
    if (selectedSubjectFromSettings && (subject.coefficient === null || isNaN(subject.coefficient))) {
      subject.coefficient = selectedSubjectFromSettings.coefficient;
    }
    // No auto-fill for classAverage and highestGrade from subject settings as they are specific to a bulletin.
  });
}, { deep: true });

// Also watch for studentClassAndSchool to trigger totalStudents calculation when it's available
watch(studentClassAndSchool, async (newVal) => {
    if (newVal) {
        formData.totalStudents = await FirebaseService.getStudentCountInClass(
            newVal.classId,
            newVal.schoolId
        );
    } else {
        formData.totalStudents = null;
    }
}, { immediate: true }); // Run immediately if studentClassAndSchool is already set

const addSubject = () => {
  formData.subjects.push({
    name: '',
    grade: null,
    coefficient: null,
    comment: '',
    teacher: '',
    classAverage: null,
    highestGrade: null
  });
};

const removeSubject = (index) => {
  formData.subjects.splice(index, 1);
};

const handleSubmit = async () => {
  try {
    // Re-calculate totalStudents right before submission to ensure it's up-to-date
    if (studentClassAndSchool.value) {
        formData.totalStudents = await FirebaseService.getStudentCountInClass(
            studentClassAndSchool.value.classId,
            studentClassAndSchool.value.schoolId
        );
    } else {
        formData.totalStudents = null;
    }

    // Assign the calculated general average to formData before sending
    // Ensure it's a number, convert 'N/A' to null if applicable
    formData.generalAverage = calculatedGeneralAverage.value !== 'N/A' ? parseFloat(calculatedGeneralAverage.value) : null;


    const bulletinPayload = {
      studentId: props.studentId,
      year: formData.year,
      semester: formData.semester,
      generalAverage: formData.generalAverage, // Now correctly populated
      classRank: formData.classRank,
      totalStudents: formData.totalStudents, // Now correctly populated
      generalComment: formData.generalComment,
      professeurPrincipalName: formData.professeurPrincipal, // Pass the name
      absencesComment: formData.absencesComment,
      subjects: formData.subjects.filter(s => s.name && s.grade !== null && s.coefficient !== null).map(s => ({
        ...s,
        coefficient: parseFloat(s.coefficient)
      })),
    };

    if (props.initialData?.id) {
      await FirebaseService.updateBulletin(props.initialData.id, bulletinPayload);
    } else {
      await FirebaseService.createBulletin(bulletinPayload);
    }
    emit('submit');
  } catch (error) {
    console.error("Error saving bulletin:", error);
    alert("Erreur lors de la sauvegarde du bulletin: " + error.message);
  }
};
</script>