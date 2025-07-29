<template>
  <section class="py-20 bg-indigo-50">
    <div class="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div class="animate-fade-in-on-scroll">
        <h2 class="text-4xl font-bold text-gray-900 mb-6">
          Notre Histoire, Votre Avenir : Pourquoi Smart Parcours ?
        </h2>
        <p class="text-lg text-gray-700 mb-6 leading-relaxed">
          Étant personnellement victime du manque d'orientation au moment crucial des choix post-bac,
          <span class="font-semibold text-indigo-700">Ezra Fanomezantsoa</span> (le créateur et développeur unique de l'application)
          a conçu Smart Parcours. Notre mission est de garantir que chaque jeune trouve sa voie
          et réalise son plein potentiel, sans les incertitudes que la génération précédente a pu connaître.
        </p>
        <p class="text-lg text-gray-700 mb-6 leading-relaxed">
          Nous exploitons la puissance de l'Intelligence Artificielle pour analyser en profondeur
          les parcours académiques, les intérêts et les performances de chaque élève, offrant des
          recommandations ultra-personnalisées et basées sur des données concrètes.
        </p>
        <p class="text-lg text-gray-700 leading-relaxed">
          Convaincus que le succès futur repose sur des bases solides, Smart Parcours valorise l'importance
          du dossier académique complet pour une orientation éclairée. Notre vision s'étend au-delà des résultats:
          nous explorons des fonctionnalités pour inclure des aspects de développement personnel et
          d'expériences sociales, préparant les élèves à un monde en constante évolution.
        </p>
      </div>
      <div class="relative animate-fade-in-on-scroll delay-200">
        <img src="https://via.placeholder.com/600x400/818CF8/FFFFFF?text=Votre+Histoire" alt="Illustration de l'histoire" class="rounded-xl shadow-2xl" />
        </div>
    </div>
  </section>
</template>

<script setup>
// Intersection Observer setup (as in VideoDemoSection)
import { onMounted } from 'vue';
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
.delay-200 { transition-delay: 0.2s; }
</style>