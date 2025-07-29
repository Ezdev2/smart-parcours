<template>
  <section class="py-40 bg-white flex items-center">
    <div class="container mx-auto px-4">
      <h2 class="text-4xl font-bold text-gray-900 text-center mb-12 animate-fade-in-on-scroll">
        Ce que Smart Parcours offre à votre établissement.
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card class="p-6 text-center animate-fade-in-on-scroll delay-100">
          <SparklesIcon class="h-12 w-12 text-indigo-600 mx-auto mb-4" />
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Orientation Personnalisée par IA</h3>
          <p class="text-gray-700">Des recommandations sur mesure pour chaque élève, basées sur une analyse profonde de leur parcours académique et de leurs intérêts, propulsée par l'intelligence artificielle.</p>
        </Card>
        <Card class="p-6 text-center animate-fade-in-on-scroll delay-200">
          <DocumentTextIcon class="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Gestion Complète des Bulletins</h3>
          <p class="text-gray-700">Centralisez, gérez et éditez facilement les bulletins de notes. Accès historique complet pour les élèves et les administrateurs, avec génération PDF instantanée.</p>
        </Card>
        <Card class="p-6 text-center animate-fade-in-on-scroll delay-300">
          <UsersIcon class="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Suivi des Élèves Intuitif</h3>
          <p class="text-gray-700">Des tableaux de bord clairs pour les administrateurs et enseignants, offrant une vue d'ensemble des performances, des moyennes et des activités récentes de chaque élève.</p>
        </Card>
        <Card class="p-6 text-center animate-fade-in-on-scroll delay-400">
          <BriefcaseIcon class="h-12 w-12 text-purple-600 mx-auto mb-4" />
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Optimisation des Carrières</h3>
          <p class="text-gray-700">Aidez les élèves à visualiser leur futur professionnel avec des suggestions de métiers potentiels et des analyses de compatibilité pour les domaines et filières.</p>
        </Card>
        <Card class="p-6 text-center animate-fade-in-on-scroll delay-500">
          <CogIcon class="h-12 w-12 text-orange-600 mx-auto mb-4" />
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Paramètres Personnalisables</h3>
          <p class="text-gray-700">Configurez facilement le nom de votre établissement, les classes, les matières, et gérez les accès des enseignants selon les besoins de votre école.</p>
        </Card>
        <Card class="p-6 text-center animate-fade-in-on-scroll delay-600">
          <ShieldCheckIcon class="h-12 w-12 text-teal-600 mx-auto mb-4" />
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Sécurité et Confidentialité</h3>
          <p class="text-gray-700">Vos données et celles de vos élèves sont protégées par les meilleures pratiques de sécurité de Firebase et des contrôles d'accès rigoureux.</p>
        </Card>
      </div>
    </div>
  </section>
</template>

<script setup>
import Card from '@/components/UI/Card.vue'; // Adjust path
import { SparklesIcon, DocumentTextIcon, UsersIcon, BriefcaseIcon, CogIcon, ShieldCheckIcon } from '@heroicons/vue/24/outline'; // Adjust path and import relevant icons
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
.delay-100 { transition-delay: 0.1s; }
.delay-200 { transition-delay: 0.2s; }
.delay-300 { transition-delay: 0.3s; }
.delay-400 { transition-delay: 0.4s; }
.delay-500 { transition-delay: 0.5s; }
.delay-600 { transition-delay: 0.6s; }
</style>