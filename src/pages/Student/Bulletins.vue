<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Mes Bulletins</h1>
    </div>

    <LoadingSpinner v-if="loading" text="Chargement de vos bulletins..." color="indigo" class="my-8" />

    <div v-else>
      <template v-if="!viewingBulletinId">

        <Card>
          <div class="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
            <div class="flex items-center space-x-4 w-full sm:w-auto">
              <label class="text-sm font-medium text-gray-700 whitespace-nowrap">Trier par :</label>
              <select v-model="sortOrder"
                class="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 w-full">
                <option value="latest">Date (plus récent)</option>
                <option value="oldest">Date (plus ancien)</option>
                <option value="avg_desc">Moyenne (la plus élevée)</option>
                <option value="avg_asc">Moyenne (la plus basse)</option>
              </select>
            </div>

            <div class="flex items-center space-x-4 w-full sm:w-auto">
              <label class="text-sm font-medium text-gray-700 whitespace-nowrap">Filtrer par classe :</label>
              <select v-model="filterClassId"
                class="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 w-full">
                <option value="all">Toutes les classes</option>
                <option v-for="classe in availableClassesForFilter" :key="classe.id" :value="classe.id">
                  {{ classe.name }} ({{ classe.level }})
                </option>
              </select>
            </div>

            <div class="flex items-center gap-4 sm:ml-auto">
              <span class="text-sm text-gray-600 whitespace-nowrap">
                {{ filteredAndSortedBulletins.length }} bulletin(s)
              </span>
              <button @click="viewMode = 'card'" :class="viewMode === 'card' ? 'text-blue-600' : 'text-gray-400'">
                <Squares2X2Icon class="w-5 h-5" />
              </button>
              <button @click="viewMode = 'list'" :class="viewMode === 'list' ? 'text-blue-600' : 'text-gray-400'">
                <Bars3Icon class="w-5 h-5" />
              </button>
            </div>
          </div>
        </Card>

        <Card v-if="filteredAndSortedBulletins.length === 0">
          <EmptyState :icon="DocumentTextIcon" title="Aucun bulletin trouvé"
            :description="filterClassId === 'all' ? 'Vous n\'avez pas encore de bulletin scolaire.' : 'Aucun bulletin pour la classe sélectionnée.'" />
        </Card>

        <div v-else-if="viewMode === 'card'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          <Card v-for="bulletin in filteredAndSortedBulletins" :key="bulletin.id">
            <div class="flex flex-col gap-4 mb-4">
              <div>
                <h3 class="text-lg font-medium text-gray-900">
                  Bulletin {{ bulletin.semester }} {{ bulletin.year }}
                </h3>
                <p class="text-sm text-gray-600">
                  Mis à jour le {{ formatDate(bulletin.updatedAt) }}
                </p>
                <p class="text-sm text-gray-600 mt-1">
                  Classe: {{ getClassNameById(bulletin.classId) }} </p>
              </div>
              <div class="text-sm text-gray-600">
                Moyenne: 
                <span class="text-2xl font-bold text-blue-600">
                  {{ bulletin.generalAverage || 'N/A' }}/20
                </span> 
              </div>
            </div>

            <div v-if="bulletin.generalComment" class="bg-blue-50 p-3 rounded-lg">
              <p class="text-sm text-blue-800 italic truncate">{{ bulletin.generalComment }}</p>
            </div>

            <div class="mt-4">
              <Button variant="primary" size="sm" class="w-full" @click="viewSingleBulletin(bulletin.id)">
                <EyeIcon class="h-4 w-4 mr-2" /> Voir le bulletin complet
              </Button>
            </div>
          </Card>
        </div>

        <Card v-else-if="viewMode === 'list'" class="mt-6 overflow-auto">
          <table class="min-w-full divide-y divide-gray-200 text-sm">
            <thead class="bg-gray-100">
              <tr>
                <th class="px-4 py-2 text-left font-medium text-gray-700">Période</th>
                <th class="px-4 py-2 text-left font-medium text-gray-700">Année</th>
                <th class="px-4 py-2 text-left font-medium text-gray-700">Classe</th>
                <th class="px-4 py-2 text-left font-medium text-gray-700">Moyenne Générale</th>
                <th class="px-4 py-2 text-left font-medium text-gray-700">Dernière MàJ</th>
                <th class="px-4 py-2 text-left font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 bg-white">
              <tr v-for="bulletin in filteredAndSortedBulletins" :key="bulletin.id">
                <td class="px-4 py-2">{{ bulletin.semester }}</td>
                <td class="px-4 py-2">{{ bulletin.year }}</td>
                <td class="px-4 py-2">{{ getClassNameById(bulletin.classId) }}</td> <td class="px-4 py-2">{{ bulletin.generalAverage || 'N/A' }}/20</td>
                <td class="px-4 py-2">{{ formatDate(bulletin.updatedAt) }}</td>
                <td class="px-4 py-2">
                  <Button variant="secondary" size="sm" @click="viewSingleBulletin(bulletin.id)">
                    <EyeIcon class="h-4 w-4 mr-2" /> Voir
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </Card>
      </template>

      <template v-else>
        <Button class="mb-6" variant="outline" @click="cancelBulletinView">
          <ArrowUturnLeftIcon class="h-4 w-4 mr-2" /> Retour à la liste des bulletins
        </Button>
        <BulletinViewer :bulletin-id="viewingBulletinId" :student-id="user.id" :hide-edit-button="true" />
      </template>
    </div>
  </div>
  <ConfirmDialog />
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { FirebaseService } from '../../services/firebaseService'
import Card from '../../components/UI/Card.vue'
import Button from '../../components/UI/Button.vue'
import EmptyState from '../../components/UI/EmptyState.vue'
import LoadingSpinner from '../../components/UI/LoadingSpinner.vue';
import BulletinViewer from '../Admin/BulletinViewer.vue'; // Reuse the viewer component
import Breadcrumb from '../../components/UI/Breadcrumb.vue';
import ConfirmDialog from '../../components/UI/ConfirmDialog.vue';
import { useConfirm } from '../../composables/useConfirm';

// Icons for view toggle
import { DocumentTextIcon, EyeIcon, ArrowUturnLeftIcon, Squares2X2Icon, Bars3Icon } from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
const user = computed(() => authStore.user)
const { showAlert } = useConfirm();

const bulletins = ref([])
const loading = ref(true)
const viewingBulletinId = ref(null);
const availableClasses = ref([]);
const filterClassId = ref('all');
const sortOrder = ref('latest');
const viewMode = ref('card'); // 'card' or 'list'

// --- Computed ---
const availableClassesForFilter = computed(() => {
  const uniqueClassIds = new Set(bulletins.value.map(b => b.classId).filter(id => id));
  return Array.from(uniqueClassIds).map(id => {
    const classInfo = availableClasses.value.find(c => c.id === id);
    return classInfo || { id: id, name: 'Classe Inconnue', level: '' };
  });
});

const filteredAndSortedBulletins = computed(() => {
  let filtered = bulletins.value;

  if (filterClassId.value !== 'all') {
    filtered = filtered.filter(b => b.classId === filterClassId.value);
  }

  return [...filtered].sort((a, b) => {
    if (sortOrder.value === 'latest') {
      return b.updatedAt.getTime() - a.updatedAt.getTime();
    } else if (sortOrder.value === 'oldest') {
      return a.updatedAt.getTime() - b.updatedAt.getTime();
    } else if (sortOrder.value === 'avg_desc') {
      const avgA = a.generalAverage !== null ? parseFloat(a.generalAverage) : -Infinity;
      const avgB = b.generalAverage !== null ? parseFloat(b.generalAverage) : -Infinity;
      return avgB - avgA;
    } else if (sortOrder.value === 'avg_asc') {
      const avgA = a.generalAverage !== null ? parseFloat(a.generalAverage) : Infinity;
      const avgB = b.generalAverage !== null ? parseFloat(b.generalAverage) : Infinity;
      return avgA - avgB;
    }
    return 0;
  });
});

// --- Methods ---
const loadBulletinsAndClasses = async () => {
  if (!user.value || !user.value.id) {
    loading.value = false;
    return;
  }
  loading.value = true;
  try {
    const fetchedBulletins = await FirebaseService.getBulletinsByStudent(user.value.id);
    bulletins.value = fetchedBulletins;

    // Fetch ALL classes to map classIds to names for filtering and display
    const allClasses = await FirebaseService.getAllClasses();
    availableClasses.value = allClasses;

  } catch (error) {
    console.error('Error loading bulletins or classes:', error);
    showAlert('Erreur', 'Impossible de charger vos bulletins: ' + error.message, 'Ok');
  } finally {
    loading.value = false;
  }
};

const formatDate = (date) => {
  if (!date) return 'N/A';
  let d = date instanceof Date ? date : (date.toDate ? date.toDate() : new Date(date));
  return d.toLocaleDateString('fr-FR');
};

const getClassNameById = (classId) => {
  const classe = availableClasses.value.find(c => c.id === classId);
  return classe ? classe.name : 'Classe inconnue';
};

const viewSingleBulletin = (bulletinId) => {
  viewingBulletinId.value = bulletinId;
};

const cancelBulletinView = async () => {
    viewingBulletinId.value = null;
    await loadBulletinsAndClasses();
}

onMounted(() => {
  loadBulletinsAndClasses();
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>