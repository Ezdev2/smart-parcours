<!-- SelectStudentForBulletinModal.vue -->
<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <Card class="relative w-full max-w-lg p-6 overflow-y-auto max-h-[90vh]">
      <button @click="$emit('cancel')" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
        <XMarkIcon class="h-6 w-6" />
      </button>
      <h2 class="text-xl font-bold mb-4">Sélectionner un élève pour le bulletin</h2>

      <LoadingSpinner v-if="loading" text="Chargement des élèves..." color="blue" class="my-6" />
      
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-md p-4 text-red-800 mb-4">
        {{ error }}
      </div>

      <div v-else-if="students.length === 0">
        <EmptyState
          :icon="UsersIcon"
          title="Aucun élève trouvé"
          description="Vous n'avez pas d'élèves assignés ou actifs dans vos classes."
        />
      </div>

      <div v-else class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Filtrer par nom ou email :</label>
          <input
            type="text"
            v-model="searchTerm"
            placeholder="Rechercher un élève..."
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div class="max-h-60 overflow-y-auto border border-gray-200 rounded-md">
          <ul class="divide-y divide-gray-100">
            <li v-for="student in filteredStudents" :key="student.id"
                @click="selectStudent(student)"
                class="p-3 cursor-pointer hover:bg-blue-50 transition-colors duration-200"
                :class="{'bg-blue-100': selectedStudent?.id === student.id}">
              <p class="font-medium text-gray-900">{{ student.profile.firstName }} {{ student.profile.lastName }}</p>
              <p class="text-sm text-gray-600">{{ student.email }} (Classe: {{ student.profile.classDisplayName }})</p>
              <!-- Show existing bulletins count -->
              <p class="text-xs text-blue-600 mt-1" v-if="student.bulletinsCount > 0">
                {{ student.bulletinsCount }} bulletin(s) existant(s)
              </p>
            </li>
            <li v-if="filteredStudents.length === 0 && searchTerm" class="p-3 text-center text-gray-500">
                Aucun élève ne correspond à votre recherche.
            </li>
          </ul>
        </div>
        
        <div class="flex justify-end space-x-3 mt-4">
          <Button variant="outline" @click="$emit('cancel')">Annuler</Button>
          <Button @click="confirmSelection" :disabled="!selectedStudent">Sélectionner</Button>
        </div>
      </div>
    </Card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { FirebaseService } from './../../services/firebaseService'
import Card from './../../components/UI/Card.vue'
import Button from './../../components/UI/Button.vue'
import LoadingSpinner from './../../components/UI/LoadingSpinner.vue'
import EmptyState from './../../components/UI/EmptyState.vue'
import { XMarkIcon, UsersIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  teacherId: {
    type: String,
    required: true
  },
  assignedClasses: { // Array of class IDs assigned to the teacher
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['student-selected', 'cancel']);

const students = ref([]);
const loading = ref(true);
const error = ref(null);
const searchTerm = ref('');
const selectedStudent = ref(null);

const filteredStudents = computed(() => {
  if (!searchTerm.value) {
    return students.value;
  }
  const lowerCaseSearch = searchTerm.value.toLowerCase();
  return students.value.filter(s =>
    s.profile.firstName.toLowerCase().includes(lowerCaseSearch) ||
    s.profile.lastName.toLowerCase().includes(lowerCaseSearch) ||
    s.email.toLowerCase().includes(lowerCaseSearch)
  );
});

const loadStudents = async () => {
  loading.value = true;
  error.value = null;
  try {
    if (!props.teacherId) {
        throw new Error("Teacher ID is required to load students.");
    }
    // The FirebaseService.getStudentsForTeacher(props.teacherId) already filters by assignedClasses internally.
    const fetchedStudents = await FirebaseService.getStudentsForTeacher(props.teacherId);
    
    // Load bulletins count for each student
    const studentsWithBulletins = await Promise.all(
      fetchedStudents.map(async (student) => {
        try {
          const bulletins = await FirebaseService.getBulletinsByStudent(student.id);
          return {
            ...student,
            bulletinsCount: bulletins.length,
            existingBulletins: bulletins
          };
        } catch (err) {
          console.error(`Error loading bulletins for student ${student.id}:`, err);
          return {
            ...student,
            bulletinsCount: 0,
            existingBulletins: []
          };
        }
      })
    );
    
    students.value = studentsWithBulletins;
  } catch (err) {
    console.error("Error loading students for teacher:", err);
    error.value = "Erreur lors du chargement de la liste des élèves: " + err.message;
  } finally {
    loading.value = false;
  }
};

const selectStudent = (student) => {
  selectedStudent.value = student;
};

const confirmSelection = () => {
  if (selectedStudent.value) {
    emit('student-selected', selectedStudent.value);
  }
};

onMounted(() => {
  loadStudents();
});
</script>