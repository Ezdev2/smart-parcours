<template>
  <section class="relative h-screen flex items-center justify-center text-center overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-br from-indigo-700 to-purple-600 opacity-90 animate-gradient-shift"></div>
    <div class="absolute inset-0 z-0 pattern-dots opacity-10"></div> <div class="relative z-10 text-white max-w-4xl px-4 animate-fade-in-up">
      <h1 class="text-5xl md:text-7xl font-extrabold leading-tight mb-4 drop-shadow-lg">
        Smart Parcours
      </h1>
      <p class="text-2xl md:text-3xl font-light mb-6 drop-shadow-md">
        L'orientation scolaire rendue intelligente et accessible.
      </p>
      <p class="text-lg md:text-xl mb-10 opacity-90 max-w-2xl mx-auto">
        Optimisez le parcours de vos élèves avec l'Intelligence Artificielle et un suivi personnalisé pour un avenir prometteur.
      </p>
      <Button @click="$emit('add-school')" variant="primary" size="lg" class="px-8 py-4 text-xl rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition duration-300">
        Inscrire mon Établissement
      </Button>
    </div>
  </section>
</template>

<script setup>
import Button from '@/components/UI/Button.vue'; // Adjust path
// Component has no internal script logic, just emits the event
</script>

<style scoped>
/* Background pattern for visual texture */
.pattern-dots {
  background-image: radial-gradient(#ffffff 1px, transparent 1px);
  background-size: 20px 20px;
}

/* Keyframe animation for background gradient shifting */
@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
.animate-gradient-shift {
  background-size: 400% 400%; /* Makes the gradient larger than the container to allow movement */
  animation: gradient-shift 15s ease infinite; /* Applies the animation */
}

/* Keyframe animation for fade-in and slide-up effect */
@keyframes fade-in-up {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in-up {
  animation: fade-in-up 1s ease-out forwards;
  opacity: 0; /* Start invisible */
  transform: translateY(20px); /* Start slightly below */
}
</style>