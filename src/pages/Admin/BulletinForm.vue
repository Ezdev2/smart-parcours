<!-- Bulletin form -->
<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <Card class="relative w-full max-w-4xl p-6 overflow-y-auto max-h-[90vh]">
      <button @click="$emit('cancel')" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
        <XMarkIcon class="h-6 w-6" />
      </button>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold">{{ initialData ? 'Modifier le Bulletin' : 'Ajouter un Bulletin' }}</h2>
      </div>
      
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Année Académique</label>
            <input type="text" v-model="formData.year" required 
              placeholder="Ex: 2024-2025"
              :readonly="isTeacherRole"
              :class="{'bg-gray-100 cursor-not-allowed': isTeacherRole}"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            <p v-if="isTeacherRole" class="mt-1 text-xs text-gray-500">Non modifiable par les enseignants.</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Période (Semestre/Trimestre)</label>
            <input type="text" v-model="formData.semester" required 
              placeholder="Ex: Semestre 1, Trimestre 2"
              :readonly="isTeacherRole"
              :class="{'bg-gray-100 cursor-not-allowed': isTeacherRole}"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            <p v-if="isTeacherRole" class="mt-1 text-xs text-gray-500">Non modifiable par les enseignants.</p>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Classe du bulletin</label>
          <select v-model="formData.classId" required
            :disabled="isTeacherRole"
            :class="{'bg-gray-100 cursor-not-allowed': isTeacherRole}"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            <option value="">Sélectionner une classe</option>
            <option v-for="classe in availableClassesForBulletin" :key="classe.id" :value="classe.id">
              {{ classe.name }} ({{ classe.level }})
            </option>
          </select>
          <p class="mt-1 text-xs text-gray-500">
            {{ isTeacherRole ? 'Non modifiable par les enseignants.' : 'La classe associée à ce bulletin spécifique.' }}
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Professeur Principal</label>
          <template v-if="isTeacherRole">
            <input type="text" :value="teacherFullName" readonly
                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-700 cursor-not-allowed" />
            <p class="mt-1 text-xs text-gray-500">Nom de l'enseignant connecté.</p>
          </template>
          <template v-else-if="authStore.user?.role === 'admin'">
            <div class="flex items-center gap-2 mt-1">
                <select v-model="formData.professeurPrincipal"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                    <option value="">Sélectionner un enseignant</option>
                    <option v-for="teacher in availableTeachers" :key="teacher.id" :value="`${teacher.profile.firstName} ${teacher.profile.lastName}`">
                        {{ teacher.profile.firstName }} {{ teacher.profile.lastName }}
                        <span v-if="teacher.profile.classNames && teacher.profile.classNames.length > 0"> ({{ teacher.profile.classNames.join(', ') }})</span>
                    </option>
                    <option value="other">Autre (saisir manuellement)</option>
                </select>
                <input v-if="formData.professeurPrincipal === 'other'"
                       type="text" v-model="formData.professeurPrincipal"
                       placeholder="Saisir le nom de l'enseignant"
                       class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
            <p class="mt-1 text-xs text-gray-500">Sélectionner l'enseignant principal du bulletin ou saisir.</p>
          </template>
          <template v-else>
              <input type="text" :value="formData.professeurPrincipal || 'Non renseigné'" readonly
                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-700 cursor-not-allowed" />
              <p class="mt-1 text-xs text-gray-500">Non modifiable pour ce rôle.</p>
          </template>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Moyenne Générale</label>
          <input type="number" step="0.1" min="0" max="20" 
            :value="calculatedGeneralAverage" readonly class="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 cursor-not-allowed" />
          <p class="mt-1 text-xs text-gray-500">Calculée automatiquement à partir des matières.</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label class="block text-sm font-medium text-gray-700">Rang dans la classe (Optionnel)</label>
                <input type="number" min="1" v-model.number="formData.classRank" 
                    placeholder="Ex: 3"
                    :readonly="isTeacherRole"
                    :class="{'bg-gray-100 cursor-not-allowed': isTeacherRole}"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                <p v-if="isTeacherRole" class="mt-1 text-xs text-gray-500">Non modifiable par les enseignants.</p>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700">Nombre total d'élèves dans la classe</label>
                <input type="number" min="1" v-model.number="formData.totalStudents" readonly
                    placeholder="Calculé automatiquement"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 cursor-not-allowed" />
                <p class="mt-1 text-xs text-gray-500">Ce champ est automatiquement calculé.</p>
            </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Commentaire Général (Optionnel)</label>
          <textarea v-model="formData.generalComment" rows="3" 
            placeholder="Ex: Bon trimestre, élève sérieux et motivé."
            :readonly="isTeacherRole"
            :class="{'bg-gray-100 cursor-not-allowed': isTeacherRole}"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
          <p v-if="isTeacherRole" class="mt-1 text-xs text-gray-500">Non modifiable par les enseignants.</p>
        </div>

        <div>
            <label class="block text-sm font-medium text-gray-700">Commentaire Absences/Vie Scolaire (Optionnel)</label>
            <textarea v-model="formData.absencesComment" rows="2"
                placeholder="Ex: 2 retards, 1 absence justifiée."
                :readonly="isTeacherRole"
                :class="{'bg-gray-100 cursor-not-allowed': isTeacherRole}"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
            <p class="mt-1 text-xs text-gray-500">
              {{ isTeacherRole ? 'Non modifiable par les enseignants.' : 'Ce champ est à compléter manuellement pour les retards/absences non gérés par l\'application.' }}
            </p>
        </div>

        <div class="border-t pt-4 mt-4">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-lg font-bold text-gray-800">
              Notes par Matière
              <span v-if="isTeacherRole" class="text-sm font-normal text-gray-600 ml-2">
                (Seules les matières peuvent être modifiées)
              </span>
            </h3>
            <Button class="mt-6" type="button" @click="addSubject" size="sm" variant="secondary">
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
                          :disabled="false"
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                    <option value="">Sélectionner une matière</option>
                    <option v-for="s in availableSubjects" :key="s.id" :value="s.name">
                      {{ s.name }}
                    </option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Enseignant</label>
                  <template v-if="isTeacherRole">
                    <input type="text" :value="teacherFullName" readonly
                           class="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 cursor-not-allowed" />
                  </template>
                  <template v-else-if="authStore.user?.role === 'admin'">
                    <input type="text" v-model="subject.teacher"
                           placeholder="Ex: M. Dupont"
                           class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                  </template>
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
                          :disabled="false"
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
import { XMarkIcon, PlusIcon, TrashIcon, DocumentMagnifyingGlassIcon } from '@heroicons/vue/24/outline';
import { useAuthStore } from '../../stores/auth';

const props = defineProps({
  initialData: {
    type: Object,
    default: null
  },
  studentId: {
    type: String,
    required: true
  },
  studentCurrentClassId: { // This is the ID of the student's *current* class, used for default selection
    type: String,
    default: null
  }
});

const emit = defineEmits(['submit', 'cancel']);
const authStore = useAuthStore();

const formData = reactive({
  year: new Date().getFullYear().toString(),
  semester: '',
  generalAverage: null,
  classRank: null,
  totalStudents: null,
  generalComment: '',
  professeurPrincipal: null, // This will be managed by admin's full name or selected teacher
  absencesComment: null,
  classId: null, // Class ID for this specific bulletin
  subjects: []
});

const availableSubjects = ref([]);
const availableClassesForBulletin = ref([]);
const studentClassAndSchool = ref(null);

// Teacher specific refs
const availableTeachers = ref([]); // List of teachers for admin to select from

const isTeacherRole = computed(() => authStore.user?.role === 'teacher'); // Computed for role check

// Computed property for teacher's full name (if current user is teacher)
const teacherFullName = computed(() => {
  if (isTeacherRole.value && authStore.user?.profile?.firstName && authStore.user?.profile?.lastName) {
    return `${authStore.user.profile.firstName} ${authStore.user.profile.lastName}`;
  }
  return '';
});

// Computed property for admin's full name (if current user is admin, for Professeur Principal default)
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

// Load all classes from admin settings for the bulletin class dropdown
const loadAvailableClassesForBulletin = async () => {
    if (!authStore.user || !authStore.user.id) {
        console.warn("User ID not available to load classes for bulletin.");
        return;
    }
    const adminId = authStore.user.role === 'admin' ? authStore.user.id : authStore.user.profile.school; // Get adminId from user or teacher profile
    try {
        const adminSettings = await FirebaseService.getOrCreateSettingsForAdmin(adminId);
        if (adminSettings && adminSettings.classes && adminSettings.classes.length > 0) {
            const classPromises = adminSettings.classes.map(id => FirebaseService.getClassById(id));
            const fetchedClasses = await Promise.all(classPromises);
            availableClassesForBulletin.value = fetchedClasses.filter(cls => cls !== null);
        } else {
            availableClassesForBulletin.value = [];
        }
    } catch (error) {
        console.error("Error loading available classes for bulletin:", error);
        availableClassesForBulletin.value = [];
    }
};

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

const loadAvailableSubjects = async () => {
  if (!authStore.user || !authStore.user.id) {
    console.warn("User ID not available to load subjects from settings.");
    return;
  }
  const adminId = authStore.user.role === 'admin' ? authStore.user.id : authStore.user.profile.school;
  try {
    const adminSettings = await FirebaseService.getOrCreateSettingsForAdmin(adminId);
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

// Load teachers for admin to select from
const loadAvailableTeachers = async () => {
  // Only load if current user is admin, as only admin will select teachers
  if (authStore.user?.role === 'admin' && authStore.user?.id) {
    try {
      const teachers = await FirebaseService.getAllTeachersForAdmin(authStore.user.id);
      availableTeachers.value = teachers;
    } catch (error) {
      console.error("Error loading teachers for selection:", error);
      availableTeachers.value = [];
    }
  }
};

watch(() => props.initialData, async (newVal) => {
  // Load necessary data regardless of role or initialData state
  await loadAvailableSubjects();
  await loadAvailableClassesForBulletin();
  await loadStudentClassAndSchool();
  await loadAvailableTeachers();

  if (newVal) {
    // Editing existing bulletin: populate form with bulletin data
    formData.year = newVal.year || new Date().getFullYear().toString();
    formData.semester = newVal.semester || '';
    formData.generalAverage = newVal.generalAverage || null;
    formData.classRank = newVal.classRank || null;
    formData.totalStudents = newVal.totalStudents || null;
    formData.generalComment = newVal.generalComment || '';
    formData.professeurPrincipal = newVal.professeurPrincipal || null; // Use existing principal from bulletin
    formData.absencesComment = newVal.absencesComment || null;
    formData.classId = newVal.classId || null; // Populate with bulletin's classId
    formData.subjects = newVal.subjects ? newVal.subjects.map(sub => ({
      ...sub,
      coefficient: typeof sub.coefficient === 'string' ? parseFloat(sub.coefficient) : sub.coefficient,
      classAverage: sub.classAverage || null,
      highestGrade: sub.highestGrade || null
    })) : [];
  } else {
    // Creating new bulletin: default values
    formData.year = new Date().getFullYear().toString();
    formData.semester = '';
    formData.generalAverage = null;
    formData.classRank = null;
    formData.totalStudents = null; // Will be calculated on submit
    formData.generalComment = '';
    formData.absencesComment = null;
    formData.subjects = [];

    // Auto-select principal based on role
    if (isTeacherRole.value) {
      formData.professeurPrincipal = teacherFullName.value;
    } else if (authStore.user?.role === 'admin') {
      formData.professeurPrincipal = adminFullName.value;
    } else {
      formData.professeurPrincipal = null;
    }

    // Auto-select student's current class for new bulletins
    formData.classId = props.studentCurrentClassId || null;
  }
}, { immediate: true });

watch(formData.subjects, (newSubjects) => {
  newSubjects.forEach(subject => {
    const selectedSubjectFromSettings = availableSubjects.value.find(s => s.name === subject.name);
    
    if (selectedSubjectFromSettings && (subject.coefficient === null || isNaN(subject.coefficient))) {
      subject.coefficient = selectedSubjectFromSettings.coefficient;
    }
  });
}, { deep: true });

watch(studentClassAndSchool, async (newVal) => {
    if (newVal) {
        formData.totalStudents = await FirebaseService.getStudentCountInClass(
            newVal.classId,
            newVal.schoolId
        );
    } else {
        formData.totalStudents = null;
    }
}, { immediate: true });

const addSubject = () => {
  formData.subjects.push({
    name: '',
    grade: null,
    coefficient: null,
    comment: '',
    teacher: isTeacherRole.value ? teacherFullName.value : '', // Auto-fill for teacher
    classAverage: null,
    highestGrade: null
  });
};

const removeSubject = (index) => {
  formData.subjects.splice(index, 1);
};

const handleSubmit = async () => {
  try {
    if (!formData.classId) {
        alert("Veuillez sélectionner une classe pour ce bulletin.");
        return;
    }

    if (studentClassAndSchool.value) {
        formData.totalStudents = await FirebaseService.getStudentCountInClass(
            studentClassAndSchool.value.classId,
            studentClassAndSchool.value.schoolId
        );
    } else {
        formData.totalStudents = null;
    }

    formData.generalAverage = calculatedGeneralAverage.value !== '' ? parseFloat(calculatedGeneralAverage.value) : null;

    const bulletinPayload = {
      studentId: props.studentId,
      classId: formData.classId,
      year: formData.year,
      semester: formData.semester,
      generalAverage: formData.generalAverage,
      classRank: formData.classRank,
      totalStudents: formData.totalStudents,
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