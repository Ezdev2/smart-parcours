<template>
  <section class="py-20 bg-indigo-900 animate-fade-in-on-scroll">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl lg:text-8xl font-bold text-white text-center mb-20">
        Ce que SmartParcours offre à votre établissement.
      </h2>

      <div class="relative">
        <div
          ref="slider"
          class="flex flex-col gap-4 lg:gap-0 lg:flex-row overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar lg:ml-20 lg:gap-x-8"
        >
          <div
            v-for="(card, index) in cards"
            :key="index"
            class="lg:flex-shrink-0 w-full lg:w-[calc(33.333%_-_22px)] snap-start lg:mr-0"
          >
            <div
              class="bg-gray-50 hover:bg-white transition-all duration-300 rounded-3xl p-12 h-full flex flex-col justify-between lg:items-end items-center gap-4 shadow-lg"
            >
              <component :is="card.icon" :class="[card.color, 'h-10', 'w-10', 'lg:hidden']"/>
              <div>
                <h3 class="text-3xl lg:text-4xl text-center lg:text-start font-bold text-gray-900 mb-3">
                  {{ card.title }}
                </h3>
                <p class="text-gray-600 text-center lg:text-start">{{ card.description }}</p>
              </div>
              <div class="mt-2 p-6 bg-blue-100 w-[fit-content] rounded-full hidden lg:block">
                <component :is="card.icon" :class="[card.color, 'h-10', 'w-10']"/>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div
          class="hidden lg:block absolute top-1/2 -translate-y-1/2 w-full"
        >
          <div class="container mx-auto flex justify-between items-center px-0">
            <button
              @click="scrollLeft"
              :disabled="isAtStart"
              class="bg-white/70 hover:bg-white text-indigo-700 rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-opacity disabled:opacity-0 disabled:cursor-not-allowed"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M11 17l-5-5m0 0l5-5m-5 5h12"
                />
              </svg>
            </button>
            <button
              @click="scrollRight"
              :disabled="isAtEnd"
              class="bg-white/70 hover:bg-white text-indigo-700 rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-opacity disabled:opacity-0 disabled:cursor-not-allowed"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Card from '../../../components/UI/Card.vue';
import { SparklesIcon, DocumentTextIcon, UsersIcon, BriefcaseIcon, CogIcon, ShieldCheckIcon } from '@heroicons/vue/24/outline'; // Adjust path and import relevant icons

onMounted(() => {
  const elements = document.querySelectorAll('.animate-fade-in-on-scroll');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, { threshold: 0.1 });
  elements.forEach(el => observer.observe(el));
});

const slider = ref(null)
const isAtStart = ref(true)
const isAtEnd = ref(false)

const updateButtonState = () => {
  if (!slider.value) return
  const el = slider.value
  const tolerance = 1
  isAtStart.value = el.scrollLeft <= tolerance
  isAtEnd.value =
    el.scrollLeft >= el.scrollWidth - el.clientWidth - tolerance
}

const scrollRight = () => {
  slider.value?.scrollBy({ left: slider.value.clientWidth, behavior: 'smooth' })
}

const scrollLeft = () => {
  slider.value?.scrollBy({ left: -slider.value.clientWidth, behavior: 'smooth' })
}

onMounted(() => {
  updateButtonState()
  slider.value?.addEventListener('scroll', updateButtonState)
  window.addEventListener('resize', updateButtonState)
})

onBeforeUnmount(() => {
  slider.value?.removeEventListener('scroll', updateButtonState)
  window.removeEventListener('resize', updateButtonState)
})

const cards = [
  {
    title: 'Gestion complète des bulletins',
    description:
      'Centralisez, gérez et éditez facilement les bulletins de notes. Accès historique complet et génération PDF instantanée.',
    icon: DocumentTextIcon,
    color: "text-green-600"
  },
  {
    title: 'Orientation IA sur mesure',
    description:
      'Des recommandations sur mesure pour chaque élève, basées sur une analyse profonde de leur parcours académique et de leurs intérêts.',
      icon: SparklesIcon,
      color: "text-indigo-600"
  },
  {
    title: 'Suivi des élèves intuitif',
    description:
      'Des tableaux de bord clairs offrant une vue d\'ensemble des performances, des moyennes et des activités récentes de chaque élève.',
    icon: UsersIcon,
    color: "text-blue-600"
  },
  {
    title: 'Croissance de carrière',
    description:
      'Aidez les élèves à visualiser leur futur professionnel avec des suggestions de métiers et des analyses de compatibilité.',
    icon: BriefcaseIcon,
    color: "text-indigo-600"
  },
  {
    title: 'Paramètres avancées',
    description:
      'Configurez facilement le nom de votre établissement, les classes, les matières, et gérez les accès des enseignants.',
    icon: CogIcon,
    color: "text-red-600"
  },
  {
    title: 'Protection des données',
    description:
      'Vos données et celles de vos élèves sont protégées par les meilleures pratiques de sécurité et des contrôles d\'accès rigoureux.',
    icon: ShieldCheckIcon,
    color: "text-teal-600"
  },
]
</script>

<style scoped>
.animate-fade-in-on-scroll {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}
.animate-fade-in-on-scroll.is-visible {
  opacity: 1;
  transform: translateY(0);
}
.delay-100 { transition-delay: 0.1s; }
.delay-200 { transition-delay: 0.2s; }
.delay-300 { transition-delay: 0.3s; }
.delay-400 { transition-delay: 0.4s; }
.delay-500 { transition-delay: 0.5s; }
.delay-600 { transition-delay: 0.6s; }

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>