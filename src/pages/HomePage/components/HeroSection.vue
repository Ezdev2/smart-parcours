<template>
  <section class="md:px-80 mt-8 md:mt-0 relative h-screen flex flex-col items-center justify-center text-center overflow-hidden animated-gradient">
    <!-- Main Content -->
    <div class="absolute inset-0 z-0 pattern-dots opacity-10"></div>
    <div class="relative z-10 flex flex-col items-center px-4 md:mb-80 animate-fade-in-up">
      <h1 class="text-5xl md:text-7xl font-extrabold text-gray-800 leading-tight mb-4">
                L'orientation <span class="text-indigo-600">scolaire</span> rendue <span
                    class="text-indigo-600">intelligente</span>.
            </h1>
            <p class="text-lg md:text-xl mb-10 text-gray-600 max-w-3xl mx-auto">
                Optimisez le parcours de vos élèves avec l'Intelligence Artificielle et un suivi personnalisé pour un
                avenir prometteur.
            </p>
            <div class="flex flex-col sm:flex-row items-center gap-4">
                <button @click="$emit('add-school')"
                    class="w-full sm:w-auto flex items-center justify-center gap-3 bg-indigo-600 text-white font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:bg-indigo-700 transform hover:-translate-y-1 transition-all duration-300">
                    <SparklesIcon class="h-8 w-8 text-white" />
                    <span>Inscrire mon Établissement</span>
                </button>
                <router-link to="/login" @click="mobileMenuOpen = false"
                    class="w-full sm:w-auto flex items-center justify-center gap-3 bg-white text-indigo-600 font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-xl border border-gray-200 transform hover:-translate-y-1 transition-all duration-300">
                    <UsersIcon class="h-8 w-8 text-indigo-600" />
                    <span>J'ai un compte</span>
                </router-link>
            </div>
    </div>

    <!-- Image Scroller -->
    <div class="absolute bottom-0 left-0 right-0 w-full scroller hidden md:block">
      <div class="scroller__inner">
        <img v-for="(src, index) in images" :key="index" :src="src" alt="Student photo" />
        <img v-for="(src, index) in images" :key="'duplicate-' + index" :src="src" alt="Student photo" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { SparklesIcon, UsersIcon } from '@heroicons/vue/24/outline'; // Adjust path and import relevant icons
import HeroTwoAnimated from '../../../assets/svg/hero2Animated.vue';
import { onMounted } from 'vue';

const images = [
  'https://images.pexels.com/photos/2880979/pexels-photo-2880979.jpeg',
  'https://images.pexels.com/photos/5003314/pexels-photo-5003314.jpeg',
  'https://images.pexels.com/photos/8106653/pexels-photo-8106653.jpeg',
  'https://images.pexels.com/photos/7713213/pexels-photo-7713213.jpeg',
  'https://images.pexels.com/photos/11694327/pexels-photo-11694327.jpeg',
  'https://images.pexels.com/photos/9829311/pexels-photo-9829311.jpeg',
]

onMounted(() => {
  const scrollers = document.querySelectorAll(".scroller")
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    scrollers.forEach(scroller => {
      scroller.setAttribute("data-animated", true)
    })
  }
})
</script>

<style scoped>
/* Background pattern for visual texture */
.pattern-dots {
    background-image: radial-gradient(#6f28bb 1px, transparent 1.5px);
    background-size: 20px 20px;
}
.animated-gradient {
  /* background: linear-gradient(-45deg, #eef2ff, #fbfaff, #ffffff); */
  background-size: 400% 400%;
  animation: gradient-flow 15s ease infinite;
}

@keyframes gradient-flow {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.scroller {
  max-width: 100%;
  overflow: hidden;
  -webkit-mask: linear-gradient(90deg, transparent, white 20%, white 80%, transparent);
  mask: linear-gradient(90deg, transparent, white 20%, white 80%, transparent);
}

.scroller__inner {
  display: flex;
  gap: 1.5rem;
  padding-block: 1rem;
  width: max-content;
  animation: scroll 40s linear infinite;
}

.scroller:hover .scroller__inner {
  animation-play-state: paused;
}

@keyframes scroll {
  to {
    transform: translate(calc(-50% - 0.75rem));
  }
}

.scroller__inner img {
  height: 400px;
  width: auto;
  max-width: none;
  border-radius: 1rem;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
}

.scroller__inner img:hover {
  transform: scale(1.05);
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out forwards;
}
</style>