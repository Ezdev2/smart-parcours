<template>
  <header :class="['fixed top-0 left-0 w-full z-50 transition-all duration-300', {'bg-white/95 backdrop-blur-md shadow-sm': scrolled}]">
    <nav class="container mx-auto px-4 py-3 flex items-center justify-between">
      <div class="flex items-center">
        <router-link to="/" class="flex items-center">
          <Logo class="w-1/2" />
        </router-link>
      </div>

      <div class="hidden md:flex items-center space-x-6">
        <a href="#why-smart-parcours" class="nav-link" @click.prevent="scrollToSection('why-smart-parcours')">Pourquoi Smart Parcours ?</a>
        <a href="#services" class="nav-link" @click.prevent="scrollToSection('services')">Nos Services</a>
        <a href="#pricing" class="nav-link" @click.prevent="scrollToSection('pricing')">Tarifs</a>
        <router-link to="/login">
          <Button variant="primary" size="sm">Connexion</Button>
        </router-link>
      </div>

      <div class="md:hidden">
        <button @click="toggleMobileMenu" class="text-gray-600 hover:text-indigo-600 focus:outline-none">
          <Bars3Icon class="h-7 w-7" />
        </button>
      </div>
    </nav>

    <transition name="slide-fade">
      <div v-if="mobileMenuOpen" class="md:hidden fixed inset-0 bg-white/95 backdrop-blur-md z-40 p-4">
        <div class="flex justify-end mb-4">
          <button @click="toggleMobileMenu" class="text-gray-600 hover:text-indigo-600 focus:outline-none">
            <XMarkIcon class="h-7 w-7" />
          </button>
        </div>
        <nav class="flex flex-col items-center space-y-6 text-lg">
          <a href="#why-smart-parcours" class="nav-link" @click="closeMenuAndScroll('why-smart-parcours')">Pourquoi Smart Parcours ?</a>
          <a href="#services" class="nav-link" @click="closeMenuAndScroll('services')">Nos Services</a>
          <a href="#pricing" class="nav-link" @click="closeMenuAndScroll('pricing')">Tarifs</a>
          <router-link to="/login" @click="mobileMenuOpen = false">
            <Button variant="primary" size="lg">Connexion</Button>
          </router-link>
        </nav>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import Button from './Button.vue';
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline';
import Logo from '../../assets/logo.vue'

const router = useRouter();
const scrolled = ref(false);
const mobileMenuOpen = ref(false);

const handleScroll = () => {
  scrolled.value = window.scrollY > 50;
};

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

// Function to scroll to a section by ID or navigate if not on homepage
const scrollToSection = (id) => {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  } else {
    // If not on homepage, navigate to homepage first, then scroll
    router.push({ path: '/', hash: `#${id}` });
  }
};

const closeMenuAndScroll = (id) => {
  mobileMenuOpen.value = false;
  scrollToSection(id);
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.nav-link {
  @apply text-gray-600 hover:text-indigo-600 transition-colors duration-200;
}

/* Mobile slide-in/out animation */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease-out;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>