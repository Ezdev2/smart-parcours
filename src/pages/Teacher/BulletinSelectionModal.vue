<!-- BulletinSelectionModal.vue -->
<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <Card class="relative w-full max-w-2xl p-6 overflow-y-auto max-h-[90vh]">
      <button @click="$emit('cancel')" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
        <XMarkIcon class="h-6 w-6" />
      </button>
      
      <div class="mb-6">
        <h2 class="text-xl font-bold text-gray-900">Bulletins de {{ student?.profile?.firstName }} {{ student?.profile?.lastName }}</h2>
        <p class="text-sm text-gray-600 mt-1">Sélectionnez un bulletin existant à modifier</p>
      </div>

      <div class="space-y-4">
        <!-- Create New Bulletin Button -->
        <!-- <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors">
          <Button @click="$emit('create-new')" class="w-full" variant="outline">
            <DocumentPlusIcon class="h-5 w-5 mr-2" />
            Créer un nouveau bulletin
          </Button>
        </div> -->

        <!-- Existing Bulletins -->
        <div v-if="existingBulletins.length > 0">
          <div class="space-y-3">
            <div 
              v-for="bulletin in sortedBulletins" 
              :key="bulletin.id"
              @click="selectBulletin(bulletin)"
              class="border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
              :class="{'bg-blue-50 border-blue-300': selectedBulletin?.id === bulletin.id}"
            >
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <div class="flex items-center space-x-3">
                    <div class="flex-shrink-0">
                      <DocumentTextIcon class="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 class="text-sm font-medium text-gray-900">
                        {{ bulletin.year }} - {{ bulletin.semester }}
                      </h4>
                      <p class="text-sm text-gray-600">
                        Classe: {{ getClassName(bulletin.classId) }}
                      </p>
                      <div class="flex items-center space-x-4 mt-1">
                        <span class="text-sm text-gray-500">
                          Moyenne: {{ bulletin.generalAverage ? bulletin.generalAverage.toFixed(2) + '/20' : 'N/A' }}
                        </span>
                        <span class="text-sm text-gray-500">
                          {{ bulletin.subjects?.length || 0 }} matière(s)
                        </span>
                        <span v-if="bulletin.classRank" class="text-sm text-gray-500">
                          Rang: {{ bulletin.classRank }}{{ bulletin.totalStudents ? '/' + bulletin.totalStudents : '' }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <span class="text-xs text-gray-400">
                    Mis àjour :
                    {{ formatDate(bulletin.updatedAt) }}
                  </span>
                  <ChevronRightIcon class="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-8">
          <DocumentTextIcon class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">Aucun bulletin existant</h3>
          <p class="mt-1 text-sm text-gray-500">Créez le premier bulletin pour cet élève.</p>
        </div>
      </div>

      <div class="flex justify-end space-x-3 mt-6 pt-4 border-t">
        <Button variant="outline" @click="$emit('cancel')">Annuler</Button>
        <Button 
          @click="confirmSelection" 
          :disabled="!selectedBulletin"
          v-if="selectedBulletin"
        >
          Modifier ce bulletin
        </Button>
      </div>
    </Card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { FirebaseService } from '../../services/firebaseService'
import Card from '../../components/UI/Card.vue'
import Button from '../../components/UI/Button.vue'
import { 
  XMarkIcon, 
  DocumentPlusIcon, 
  DocumentTextIcon, 
  ChevronRightIcon 
} from '@heroicons/vue/24/outline'

const props = defineProps({
  student: {
    type: Object,
    required: true
  },
  existingBulletins: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['bulletin-selected', 'create-new', 'cancel'])

const selectedBulletin = ref(null)
const classNames = ref({})

// Sort bulletins by year and semester (most recent first)
const sortedBulletins = computed(() => {
  return [...props.existingBulletins].sort((a, b) => {
    // First sort by year (descending)
    const yearComparison = b.year.localeCompare(a.year)
    if (yearComparison !== 0) return yearComparison
    
    // Then sort by semester (assuming format like "Semestre 1", "Trimestre 2", etc.)
    return b.semester.localeCompare(a.semester)
  })
})

const selectBulletin = (bulletin) => {
  selectedBulletin.value = bulletin
}

const confirmSelection = () => {
  if (selectedBulletin.value) {
    emit('bulletin-selected', selectedBulletin.value)
  }
}

const getClassName = (classId) => {
  return classNames.value[classId] || 'Classe inconnue'
}

const formatDate = (timestamp) => {
  if (!timestamp) return 'Date inconnue'
  
  let date
  if (timestamp.toDate) {
    // Firestore Timestamp
    date = timestamp.toDate()
  } else if (timestamp instanceof Date) {
    date = timestamp
  } else {
    // String or number timestamp
    date = new Date(timestamp)
  }
  
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Load class names for display
const loadClassNames = async () => {
  const classIds = [...new Set(props.existingBulletins.map(b => b.classId).filter(Boolean))]
  
  for (const classId of classIds) {
    try {
      const classData = await FirebaseService.getClassById(classId)
      if (classData) {
        classNames.value[classId] = `${classData.name} (${classData.level})`
      }
    } catch (error) {
      console.error(`Error loading class ${classId}:`, error)
      classNames.value[classId] = 'Classe inconnue'
    }
  }
}

onMounted(() => {
  loadClassNames()
})
</script>