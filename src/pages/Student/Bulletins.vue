<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900">Mes Bulletins</h1>
      <Button @click="showForm = true">
        <PlusIcon class="h-4 w-4 mr-2" />
        Ajouter un bulletin
      </Button>
    </div>

    <Card v-if="showForm">
      <BulletinForm
        :loading="loading"
        @submit="handleUpload"
        @cancel="showForm = false"
      />
    </Card>

    <Card v-if="bulletins.length === 0">
      <div class="text-center py-12">
        <DocumentTextIcon class="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">
          Aucun bulletin
        </h3>
        <p class="text-gray-600 mb-4">
          Vous n'avez pas encore ajouté de bulletin scolaire.
        </p>
        <Button @click="showForm = true">
          Ajouter votre premier bulletin
        </Button>
      </div>
    </Card>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card v-for="bulletin in bulletins" :key="bulletin.id">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-lg font-medium text-gray-900">
              {{ bulletin.period }} {{ bulletin.year }}
            </h3>
            <p class="text-sm text-gray-600">
              Ajouté le {{ formatDate(bulletin.uploadedAt) }}
            </p>
          </div>
          <div class="text-2xl font-bold text-blue-600">
            {{ bulletin.averageGrade }}/20
          </div>
        </div>

        <div class="space-y-2 mb-4">
          <div 
            v-for="(subject, index) in bulletin.subjects" 
            :key="index" 
            class="flex justify-between items-center p-2 bg-gray-50 rounded"
          >
            <span class="text-sm text-gray-900">{{ subject.subject }}</span>
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-600">Coeff. {{ subject.coefficient }}</span>
              <span class="font-medium text-gray-900">{{ subject.grade }}/20</span>
            </div>
          </div>
        </div>

        <div v-if="bulletin.comments" class="bg-blue-50 p-3 rounded-lg">
          <p class="text-sm text-blue-800">{{ bulletin.comments }}</p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { FirebaseService } from '../../services/firebaseService'
import Card from '../../components/UI/Card.vue'
import Button from '../../components/UI/Button.vue'
import BulletinForm from './BulletinForm.vue'
import { DocumentTextIcon, PlusIcon } from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
const user = computed(() => authStore.user)

const bulletins = ref([])
const showForm = ref(false)
const loading = ref(false)

const loadBulletins = async () => {
  if (!user.value) return
  try {
    const data = await FirebaseService.getBulletinsByStudent(user.value.id)
    bulletins.value = data
  } catch (error) {
    console.error('Error loading bulletins:', error)
    // Mock data for demo
    bulletins.value = [
      {
        id: '1',
        period: 'Trimestre 1',
        year: '2024',
        averageGrade: 15.2,
        subjects: [
          { subject: 'Mathématiques', grade: 16.5, coefficient: 4 },
          { subject: 'Physique', grade: 17.0, coefficient: 3 },
          { subject: 'Français', grade: 13.5, coefficient: 4 },
          { subject: 'Histoire-Géo', grade: 14.0, coefficient: 3 },
          { subject: 'Anglais', grade: 15.5, coefficient: 3 }
        ],
        comments: 'Très bon travail, continuez ainsi !',
        uploadedAt: new Date('2024-01-15')
      },
      {
        id: '2',
        period: 'Trimestre 2',
        year: '2024',
        averageGrade: 15.8,
        subjects: [
          { subject: 'Mathématiques', grade: 17.0, coefficient: 4 },
          { subject: 'Physique', grade: 17.5, coefficient: 3 },
          { subject: 'Français', grade: 14.0, coefficient: 4 },
          { subject: 'Histoire-Géo', grade: 14.5, coefficient: 3 },
          { subject: 'Anglais', grade: 16.0, coefficient: 3 }
        ],
        comments: 'Progression constante, félicitations !',
        uploadedAt: new Date('2024-04-15')
      }
    ]
  }
}

const handleUpload = async (formData) => {
  loading.value = true
  try {
    await FirebaseService.createBulletin({
      studentId: user.value.id,
      ...formData
    })
    showForm.value = false
    loadBulletins()
    alert('Bulletin ajouté avec succès !')
  } catch (error) {
    console.error('Error uploading bulletin:', error)
    alert("Erreur lors de l'ajout du bulletin")
  } finally {
    loading.value = false
  }
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}

onMounted(() => {
  loadBulletins()
})
</script>

