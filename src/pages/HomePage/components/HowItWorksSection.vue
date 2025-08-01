<template>
  <section class="py-20 bg-hero">
    <div class="container flex flex-col gap-6 items-center mx-auto px-4 text-center">
      <h2 ref="titleRef" class="text-4xl md:text-6xl font-bold text-white mb-12 animate-fade-in-on-scroll">
        Prêts à transformer l'orientation ?
        <span class="block text-indigo-400 mt-2 text-2xl md:text-3xl font-normal">Voici Comment Démarrer.</span>
      </h2>

      <!-- Étapes -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div
          v-for="(step, index) in steps"
          :key="index"
          :ref="el => stepRefs[index] = el"
          class="flex flex-col items-center animate-fade-in-on-scroll"
          :class="`delay-${(index + 1) * 100}`"
        >
          <div :class="step.iconClass">
            {{ index + 1 }}
          </div>
          <h3 class="text-xl font-semibold text-white mb-3">{{ step.title }}</h3>
          <p class="text-gray-300 max-w-xs">{{ step.description }}</p>
        </div>
      </div>

      <!-- CTA -->
      <div ref="ctaRef" class="mt-16 animate-fade-in-on-scroll delay-400">
        <button
          @click="scrollToSection"
          class="flex items-center gap-3 bg-indigo-600 text-white font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:bg-indigo-700 transform hover:-translate-y-1 transition duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Inscrire mon Établissement
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const titleRef = ref(null)
const ctaRef = ref(null)
const stepRefs = []

const steps = [
  {
    title: 'Explorez nos outils',
    description: 'Découvrez la démo vidéo et toutes les fonctionnalités clés de SmartParcours.',
    iconClass: 'w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-600 text-3xl font-bold',
  },
  {
    title: 'Contactez-nous pour vous inscrire',
    description: "Cliquez sur le bouton 'Inscrire mon Établissement' et remplissez un court formulaire sécurisé.",
    iconClass: 'w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600 text-3xl font-bold',
  },
  {
    title: 'Accès & Configuration Personnalisés',
    description: 'Nous créons votre espace administrateur et vous guidons dans la configuration initiale pour un démarrage rapide.',
    iconClass: 'w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 text-purple-600 text-3xl font-bold',
  },
]

const scrollToSection = () => {
  const el = document.getElementById('pricing')
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  } else {
    console.warn('Section avec l’ID "pricing" introuvable.')
  }
}

onMounted(() => {
  const elements = [titleRef.value, ctaRef.value, ...stepRefs]

  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => el?.classList.add('is-visible'))
    return
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.1 }
  )

  elements.forEach(el => el && observer.observe(el))
})
</script>

<style scoped>
.bg-hero {
  background-image: linear-gradient(rgba(27, 32, 58, 0.8), rgba(27, 32, 58, 0.8)),
    url('https://images.pexels.com/photos/5357185/pexels-photo-5357185.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}

.animate-fade-in-on-scroll {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}
.animate-fade-in-on-scroll.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.delay-100 {
  transition-delay: 0.1s;
}
.delay-200 {
  transition-delay: 0.2s;
}
.delay-300 {
  transition-delay: 0.3s;
}
.delay-400 {
  transition-delay: 0.4s;
}
</style>
