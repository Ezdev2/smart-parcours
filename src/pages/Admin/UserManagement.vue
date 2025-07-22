<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
      <Button @click="showAddForm = true">
        <PlusIcon class="h-4 w-4 mr-2" />
        Ajouter un étudiant
      </Button>
    </div>

    <!-- Filters -->
    <Card>
      <div class="flex items-center space-x-4">
        <label class="text-sm font-medium text-gray-700">Filtrer par classe :</label>
        <select
          v-model="selectedClass"
          class="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="all">Toutes les classes</option>
          <option v-for="className in uniqueClasses" :key="className" :value="className">
            {{ className }}
          </option>
        </select>
        <div class="ml-auto text-sm text-gray-600">
          {{ filteredStudents.length }} étudiant(s) affiché(s)
        </div>
      </div>
    </Card>

    <!-- Add Student Form -->
    <Card v-if="showAddForm">
      <AddStudentForm
        @submit="handleAddStudent"
        @cancel="showAddForm = false"
        :generate-code="generateRegistrationCode"
      />
    </Card>

    <!-- Students List -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card v-for="student in filteredStudents" :key="student.id">
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="text-lg font-medium text-gray-900">
              {{ student.profile.firstName }} {{ student.profile.lastName }}
            </h3>
            <p class="text-sm text-gray-600">{{ student.email }}</p>
          </div>
          <div class="flex space-x-1">
            <button class="p-1 text-gray-400 hover:text-blue-600">
              <PencilIcon class="h-4 w-4" />
            </button>
            <button class="p-1 text-gray-400 hover:text-red-600">
              <TrashIcon class="h-4 w-4" />
            </button>
          </div>
        </div>

        <div class="space-y-2">
          <div class="flex justify-between">
            <span class="text-sm text-gray-600">Classe:</span>
            <span class="text-sm font-medium">{{ student.profile.class }}</span>
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
          <Button size="sm" class="flex-1">Voir détails</Button>
          <Button size="sm" variant="outline" class="flex-1">Éditer</Button>
        </div>
      </Card>
    </div>

    <!-- Empty State -->
    <Card v-if="filteredStudents.length === 0 && !loading">
      <div class="text-center py-12">
        <h3 class="text-lg font-medium text-gray-900 mb-2">
          Aucun étudiant trouvé
        </h3>
        <p class="text-gray-600">
          {{ selectedClass === 'all' 
            ? "Aucun étudiant n'a été ajouté pour le moment."
            : `Aucun étudiant dans la classe ${selectedClass}.`
          }}
        </p>
      </div>
    </Card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { FirebaseService } from '../../services/firebaseService'
import Card from '../../components/UI/Card.vue'
import Button from '../../components/UI/Button.vue'
import { PlusIcon, PencilIcon, TrashIcon, KeyIcon } from '@heroicons/vue/24/outline'
import AddStudentForm from './AddStudentForm.vue'

const students = ref([])
const showAddForm = ref(false)
const loading = ref(true)
const selectedClass = ref('all')

const filteredStudents = computed(() => {
  return selectedClass.value === 'all' 
    ? students.value 
    : students.value.filter(student => student.profile.class === selectedClass.value)
})

const uniqueClasses = computed(() => {
  return Array.from(new Set(students.value.map(s => s.profile.class)))
})

const loadStudents = async () => {
  try {
    const data = await FirebaseService.getAllStudents()
    students.value = data
  } catch (error) {
    console.error('Error loading students:', error)
    // Mock data for demo
    students.value = [
      {
        id: '1',
        email: 'marie.dubois@example.com',
        profile: {
          firstName: 'Marie',
          lastName: 'Dubois',
          class: 'Première S',
          averageGrade: 15.2,
          registrationCode: 'STU001'
        },
        createdAt: new Date('2024-01-15')
      },
      {
        id: '2',
        email: 'pierre.martin@example.com',
        profile: {
          firstName: 'Pierre',
          lastName: 'Martin',
          class: 'Terminale ES',
          averageGrade: 13.8,
          registrationCode: 'STU002'
        },
        createdAt: new Date('2024-01-20')
      },
      {
        id: '3',
        email: 'sophie.bernard@example.com',
        profile: {
          firstName: 'Sophie',
          lastName: 'Bernard',
          class: 'Seconde',
          averageGrade: 16.1,
          registrationCode: 'STU003'
        },
        createdAt: new Date('2024-02-01')
      }
    ]
  } finally {
    loading.value = false
  }
}

const generateRegistrationCode = () => {
  return 'STU' + Math.random().toString(36).substr(2, 6).toUpperCase()
}

const handleAddStudent = (data) => {
  console.log('Adding student:', data)
  showAddForm.value = false
  loadStudents()
}

const formatDate = (date) => {
  return date.toLocaleDateString()
}

onMounted(() => {
  loadStudents()
})
</script>