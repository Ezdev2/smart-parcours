<template>
  <section class="py-40 bg-white">
    <div class="container flex flex-col gap-6 items-center mx-auto px-4 text-center">
      <h2 class="text-4xl font-bold text-gray-900 mb-12 animate-fade-in-on-scroll">
        Prêts à Transformer l'Orientation ?
        <span class="block text-indigo-600 mt-2">Voici Comment Démarrer.</span>
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div class="flex flex-col items-center animate-fade-in-on-scroll delay-100">
          <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-600 text-3xl font-bold ">1</div>
          <h3 class="text-xl font-semibold text-gray-900 mb-3">Explorez nos outils</h3>
          <p class="text-gray-700 max-w-xs">Découvrez la démo vidéo et toutes les fonctionnalités clés de Smart Parcours.</p>
        </div>
        <div class="flex flex-col items-center animate-fade-in-on-scroll delay-200">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600 text-3xl font-bold ">2</div>
          <h3 class="text-xl font-semibold text-gray-900 mb-3">Contactez-nous pour vous inscrire</h3>
          <p class="text-gray-700 max-w-xs">Cliquez sur le bouton 'Inscrire mon Établissement' et remplissez un court formulaire sécurisé.</p>
        </div>
        <div class="flex flex-col items-center animate-fade-in-on-scroll delay-300">
          <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 text-purple-600 text-3xl font-bold ">3</div>
          <h3 class="text-xl font-semibold text-gray-900 mb-3">Accès & Configuration Personnalisés</h3>
          <p class="text-gray-700 max-w-xs">Nous créons votre espace administrateur et vous guidons dans la configuration initiale pour un démarrage rapide.</p>
        </div>
      </div>

      <div class="mt-16 animate-fade-in-on-scroll delay-400">
        <router-link to="#" @click.prevent="scrollToAddSchoolSection">
            <Button variant="primary" size="lg" class="px-8 py-4 text-xl rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition duration-300">
                Inscrire mon Établissement
            </Button>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import Button from '@/components/UI/Button.vue'; // Adjust path
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';

const router = useRouter();

const scrollToAddSchoolSection = () => {
    // This function will emit the event to open the modal from Home.vue
    // For this example, it's simplified. In Home.vue, you'd listen for this and set showAddSchoolModal = true.
    // Given the current structure, HeroSection and PricingSection already directly emit 'add-school'.
    // This button here should also just emit 'add-school' if the modal is to open.
    // For now, it navigates to #pricing as a simple proxy.
    const el = document.getElementById('pricing'); // Scroll to pricing section which has the "Démarrer gratuitement" button
    if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
    }
};

// Intersection Observer setup (as in VideoDemoSection)
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
</script>

<style scoped>
/* Same animation styles as VideoDemoSection */
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
</style>