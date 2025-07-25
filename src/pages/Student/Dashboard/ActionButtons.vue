<template>
  <div class="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
    <!-- Card 1 -->
    <div
      class="bg-white/95 border border-white/20 rounded-2xl p-6 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl"
      style="backdrop-filter: blur(20px);"
    >
      <div class="flex items-center gap-4 mb-4">
        <div
          class="w-10 h-10 rounded-lg flex items-center justify-center"
          style="background: rgba(139, 69, 19, 0.1); color: #8b4513;"
        >
          🤖
        </div>
        <div>
          <h3 class="text-[1.1rem] font-semibold mb-1">Générer une recommandation</h3>
          <p class="text-sm text-gray-500">
            Obtenez des suggestions d'orientation personnalisées basées sur vos résultats.
          </p>
        </div>
      </div>
      <Button @click="$emit('analyze')" :disabled="loading">
        {{ loading ? 'Génération...' : 'Analyser mon profil avec l\'IA' }}
      </Button>
    </div>

    <!-- Card 2 -->
    <div
      class="bg-white/95 border border-white/20 rounded-2xl p-6 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl"
      style="backdrop-filter: blur(20px);"
    >
      <div class="flex items-center gap-4 mb-4">
        <div
          class="w-10 h-10 rounded-lg flex items-center justify-center"
          style="background: rgba(59, 130, 246, 0.1); color: #3b82f6;"
        >
          📝
        </div>
        <div>
          <h3 class="text-[1.1rem] font-semibold mb-1">Compléter mon profil</h3>
          <p class="text-sm text-gray-500">
            Ajoutez vos aspirations et centres d'intérêt pour des recommandations plus précises.
          </p>
        </div>
      </div>
      <Button variant="secondary">
        Mettre à jour mon profil
      </Button>
    </div>

    <!-- Card 3 -->
    <div
      class="bg-white/95 border border-white/20 rounded-2xl p-6 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl"
      style="backdrop-filter: blur(20px);"
    >
      <div class="flex items-center gap-4 mb-4">
        <div
          class="w-10 h-10 rounded-lg flex items-center justify-center"
          style="background: rgba(16, 185, 129, 0.1); color: #10b981;"
        >
          📋
        </div>
        <div>
          <h3 class="text-[1.1rem] font-semibold mb-1">Mettre à jour mes bulletins</h3>
          <p class="text-sm text-gray-500">
            Ajoutez vos dernières notes pour améliorer la précision des analyses.
          </p>
        </div>
      </div>
      <Button variant="secondary">
        Télécharger/Mettre à jour bulletin
      </Button>
    </div>
  </div>
</template>

<script setup>
import Button from '../../../components/UI/Button.vue'

defineProps({
  loading: Boolean
})
defineEmits(['analyze'])
</script>
