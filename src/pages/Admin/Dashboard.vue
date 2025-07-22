<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900">Tableau de bord - Administration</h1>
      <Button>
        <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Ajouter un étudiant
      </Button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg">
            <svg class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Étudiants</p>
            <p class="text-2xl font-semibold text-gray-900">{{ totalStudents }}</p>
          </div>
        </div>
      </Card>

      <Card>
        <div class="flex items-center">
          <div class="p-2 bg-green-100 rounded-lg">
            <svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Moyenne Générale</p>
            <p class="text-2xl font-semibold text-gray-900">14.8/20</p>
          </div>
        </div>
      </Card>

      <Card>
        <div class="flex items-center">
          <div class="p-2 bg-purple-100 rounded-lg">
            <svg class="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Bulletins ce mois</p>
            <p class="text-2xl font-semibold text-gray-900">24</p>
          </div>
        </div>
      </Card>

      <Card>
        <div class="flex items-center">
          <div class="p-2 bg-orange-100 rounded-lg">
            <svg class="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Classes</p>
            <p class="text-2xl font-semibold text-gray-900">
              {{ Object.keys(classDistribution).length }}
            </p>
          </div>
        </div>
      </Card>
    </div>

    <!-- Quick Actions -->
    <Card>
      <h3 class="text-lg font-medium text-gray-900 mb-4">Actions rapides</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Button class="h-20 flex-col">
          <svg class="h-6 w-6 mb-2" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
          </svg>
          Ajouter un étudiant
        </Button>
        <Button variant="outline" class="h-20 flex-col">
          <svg class="h-6 w-6 mb-2" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
          </svg>
          Rapport mensuel
        </Button>
        <Button variant="outline" class="h-20 flex-col">
          <svg class="h-6 w-6 mb-2" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
          </svg>
          Liste des étudiants
        </Button>
        <Button variant="outline" class="h-20 flex-col">
          <svg class="h-6 w-6 mb-2" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
          </svg>
          Exporter données
        </Button>
      </div>
    </Card>

    <!-- Charts and Analytics -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          Moyennes par niveau
        </h3>
        <div class="h-64">
          <canvas ref="chartCanvas"></canvas>
        </div>
      </Card>

      <Card>
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          Distribution par classe
        </h3>
        <div class="space-y-3">
          <div 
            v-for="[className, count] in Object.entries(classDistribution)" 
            :key="className" 
            class="flex justify-between items-center"
          >
            <span class="text-sm text-gray-700">{{ className }}</span>
            <div class="flex items-center">
              <div class="w-32 bg-gray-200 rounded-full h-2 mr-3">
                <div 
                  class="bg-blue-600 h-2 rounded-full" 
                  :style="{width: `${(count / totalStudents) * 100}%`}"
                ></div>
              </div>
              <span class="text-sm font-medium text-gray-900">{{ count }}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>

    <!-- Recent Activity -->
    <Card>
      <h3 class="text-lg font-medium text-gray-900 mb-4">Activité récente</h3>
      <div class="space-y-3">
        <div class="flex items-center p-3 bg-gray-50 rounded-lg">
          <div class="flex-shrink-0 w-2 h-2 bg-green-400 rounded-full mr-3"></div>
          <span class="text-sm text-gray-700">Marie Dubois a téléchargé un nouveau bulletin</span>
          <span class="ml-auto text-sm text-gray-500">Il y a 2h</span>
        </div>
        <div class="flex items-center p-3 bg-gray-50 rounded-lg">
          <div class="flex-shrink-0 w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
          <span class="text-sm text-gray-700">Pierre Martin a généré une analyse IA</span>
          <span class="ml-auto text-sm text-gray-500">Il y a 4h</span>
        </div>
        <div class="flex items-center p-3 bg-gray-50 rounded-lg">
          <div class="flex-shrink-0 w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
          <span class="text-sm text-gray-700">Nouveau compte créé : Sophie Bernard</span>
          <span class="ml-auto text-sm text-gray-500">Hier</span>
        </div>
      </div>
    </Card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue'
import { FirebaseService } from '../../services/firebaseService'
import Card from '../../components/UI/Card.vue'
import Button from '../../components/UI/Button.vue'

const students = ref([])
const loading = ref(true)
const chartCanvas = ref(null)

const totalStudents = computed(() => students.value.length)

const classDistribution = computed(() => {
  return students.value.reduce((acc, student) => {
    const className = student.profile.class
    acc[className] = (acc[className] || 0) + 1
    return acc
  }, {})
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
        profile: { firstName: 'Marie', lastName: 'Dubois', class: 'Première S', averageGrade: 15.2 }
      },
      {
        id: '2',
        profile: { firstName: 'Pierre', lastName: 'Martin', class: 'Terminale ES', averageGrade: 13.8 }
      },
      {
        id: '3',
        profile: { firstName: 'Sophie', lastName: 'Bernard', class: 'Seconde', averageGrade: 16.1 }
      }
    ]
  } finally {
    loading.value = false
  }
}

const initChart = async () => {
  await nextTick()
  
  if (!chartCanvas.value) return

  // Import Chart.js dynamically
  try {
    const { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } = await import('chart.js')
    
    Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

    const chartData = {
      labels: ['6ème', '5ème', '4ème', '3ème', 'Seconde', 'Première', 'Terminale'],
      datasets: [
        {
          label: 'Moyenne de classe',
          data: [14.2, 14.5, 13.8, 14.9, 15.1, 14.7, 15.3],
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1,
        },
      ],
    }

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Moyennes par niveau de classe',
        },
      },
      scales: {
        y: {
          beginAtZero: false,
          min: 10,
          max: 20,
        },
      },
    }

    new Chart(chartCanvas.value, {
      type: 'bar',
      data: chartData,
      options: chartOptions,
    })
  } catch (error) {
    console.error('Error loading Chart.js:', error)
    // Fallback: display a simple text message
    if (chartCanvas.value) {
      const ctx = chartCanvas.value.getContext('2d')
      ctx.font = '16px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('Graphique non disponible', chartCanvas.value.width / 2, chartCanvas.value.height / 2)
    }
  }
}

onMounted(async () => {
  await loadStudents()
  await initChart()
})
</script>