<template>
  <footer class="bg-gray-800 text-white py-8">
    <div class="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
      <div class="mb-4 md:mb-0">
        <router-link to="/" class="flex items-center justify-center md:justify-start">
          <img src="@/assets/logo.vue" alt="Smart Parcours Logo" class="h-10 mr-2" /> <span class="text-2xl font-bold">Smart Parcours</span>
        </router-link>
        <p class="text-sm mt-2 opacity-80 max-w-sm">
          Votre partenaire pour une orientation scolaire réussie et une gestion académique optimisée.
        </p>
      </div>

      <div class="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8 mb-4 md:mb-0">
        <div class="flex flex-col space-y-2">
          <h3 class="font-semibold text-lg mb-1">Navigation</h3>
          <router-link to="/" class="hover:text-indigo-400 transition-colors">Accueil</router-link>
          <a href="#why-smart-parcours" class="hover:text-indigo-400 transition-colors" @click.prevent="scrollToSection('why-smart-parcours')">Pourquoi Smart Parcours ?</a>
          <a href="#services" class="hover:text-indigo-400 transition-colors" @click.prevent="scrollToSection('services')">Nos Services</a>
          <a href="#pricing" class="hover:text-indigo-400 transition-colors" @click.prevent="scrollToSection('pricing')">Tarifs</a>
          <router-link to="/login" class="hover:text-indigo-400 transition-colors">Connexion</router-link>
        </div>

        <div class="flex flex-col space-y-2">
          <h3 class="font-semibold text-lg mb-1">Légal</h3>
          <router-link to="/terms-conditions" class="hover:text-indigo-400 transition-colors">Conditions Générales</router-link>
          <a href="#" class="hover:text-indigo-400 transition-colors">Politique de Confidentialité (à venir)</a>
        </div>
      </div>
    </div>

    <div class="border-t border-gray-700 mt-8 pt-6 text-sm opacity-70 text-center">
      <p>© {{ currentYear }} Smart Parcours. Tous droits réservés.</p>
      <p class="mt-2">
        Conçu et développé par <a href="https://ez-dev.netlify.app/" target="_blank" rel="noopener noreferrer" class="text-indigo-400 hover:underline">Ezra Fanomezantsoa</a>
      </p>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
// If you have your logo as an SVG/Vue component:
// import AppLogo from '@/assets/logo.vue';

const router = useRouter();
const currentYear = computed(() => new Date().getFullYear());

const scrollToSection = (id) => {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  } else {
    // If not on homepage, navigate to homepage and then scroll
    router.push({ path: '/', hash: `#${id}` });
  }
};
</script>

<style scoped>
/* No specific styles beyond Tailwind */
</style>