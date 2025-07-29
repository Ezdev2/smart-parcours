<template>
  <section class="py-20 bg-gray-100" id="pricing">
    <div class="container mx-auto px-4 text-center">
      <h2 class="text-4xl font-bold text-gray-900 mb-6 animate-fade-in-on-scroll">
        Nos Offres : Un Accès Inclusif à l'Innovation.
      </h2>
      <p class="text-lg text-gray-700 mb-12 max-w-3xl mx-auto animate-fade-in-on-scroll delay-200">
        Nous sommes actuellement en phase <span class="font-semibold text-indigo-600">BÊTA</span>.
        Profitez d'un accès <span class="font-semibold text-green-600">GRATUIT</span> et illimité
        à toutes nos fonctionnalités pour une durée limitée. Nos tarifs seront annoncés prochainement.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Card class="p-8 animate-fade-in-on-scroll delay-100">
          <h3 class="text-2xl font-bold text-indigo-600 mb-4">Offre BÊTA (Gratuit)</h3>
          <p class="text-gray-600 mb-6">Accès complet à toutes les fonctionnalités pendant la phase de test.</p>
          <div class="text-5xl font-extrabold text-gray-900 mb-6">
            0€<span class="text-xl font-normal">/mois</span>
          </div>
          <ul class="text-left text-gray-700 space-y-3 mb-8">
            <li class="flex items-center"><CheckCircleIcon class="h-5 w-5 text-green-500 mr-2" /> Accès complet à l'IA d'orientation</li>
            <li class="flex items-center"><CheckCircleIcon class="h-5 w-5 text-green-500 mr-2" /> Gestion illimitée des élèves et bulletins</li>
            <li class="flex items-center"><CheckCircleIcon class="h-5 w-5 text-green-500 mr-2" /> Tableau de bord administrateur détaillé</li>
            <li class="flex items-center"><CheckCircleIcon class="h-5 w-5 text-green-500 mr-2" /> Accès enseignant et profil élève</li>
            <li class="flex items-center"><CheckCircleIcon class="h-5 w-5 text-green-500 mr-2" /> Support prioritaire</li>
          </ul>
          <Button @click="$emit('add-school')" variant="primary" size="lg" class="w-full">
            Démarrer gratuitement
          </Button>
        </Card>

        <Card class="p-8 border-2 border-dashed border-gray-300 animate-fade-in-on-scroll delay-200">
          <h3 class="text-2xl font-bold text-gray-700 mb-4">Offre Premium (À Venir)</h3>
          <p class="text-gray-600 mb-6">Découvrez des fonctionnalités avancées et des options de personnalisation dans nos offres futures.</p>
          <div class="text-5xl font-extrabold text-gray-500 mb-6">
            ???€<span class="text-xl font-normal">/mois</span>
          </div>
          <ul class="text-left text-gray-500 space-y-3 mb-8">
            <li class="flex items-center"><QuestionMarkCircleIcon class="h-5 w-5 text-gray-400 mr-2" /> Fonctionnalités avancées</li>
            <li class="flex items-center"><QuestionMarkCircleIcon class="h-5 w-5 text-gray-400 mr-2" /> Personnalisation étendue</li>
            <li class="flex items-center"><QuestionMarkCircleIcon class="h-5 w-5 text-gray-400 mr-2" /> Rapports personnalisés</li>
            <li class="flex items-center"><QuestionMarkCircleIcon class="h-5 w-5 text-gray-400 mr-2" /> Intégrations tierces</li>
            <li class="flex items-center"><QuestionMarkCircleIcon class="h-5 w-5 text-gray-400 mr-2" /> Accompagnement dédié</li>
          </ul>
          <Button variant="secondary" size="lg" class="w-full text-gray-500 cursor-not-allowed">
            Contactez-nous (Prochainement)
          </Button>
        </Card>
      </div>
    </div>
  </section>
</template>

<script setup>
import Card from '@/components/UI/Card.vue'; // Adjust path
import Button from '@/components/UI/Button.vue'; // Adjust path
import { CheckCircleIcon, QuestionMarkCircleIcon } from '@heroicons/vue/24/outline'; // Adjust path
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
</style>