<template>
  <section class="py-20 bg-gray-50">
    <div class="container mx-auto px-4 text-center">
      <h2 class="text-4xl font-bold text-gray-900 mb-6 animate-fade-in-on-scroll">
        Découvrez Smart Parcours en Action
      </h2>
      <p class="text-lg text-gray-700 mb-10 max-w-3xl mx-auto animate-fade-in-on-scroll delay-200">
        Voyez comment notre plateforme transforme la gestion scolaire et l'orientation des élèves grâce à une interface intuitive et des outils puissants.
      </p>

      <div class="relative w-full max-w-4xl mx-auto bg-gray-200 rounded-xl overflow-hidden shadow-2xl animate-fade-in-on-scroll delay-400" style="padding-top: 56.25%;"> <iframe
          class="absolute top-0 left-0 w-full h-full"
          src="https://www.youtube.com/embed/dQw4w9WgXcQ?si=W88q4pS_wK_7gN8P" frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen>
        </iframe>
      </div>
    </div>
  </section>
</template>

<script setup>
// Intersection Observer for scroll animations (basic implementation)
import { onMounted } from 'vue';

onMounted(() => {
  // Select elements that should animate on scroll
  const elements = document.querySelectorAll('.animate-fade-in-on-scroll');
  
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add a class when element is in view
        entry.target.classList.add('is-visible');
      } else {
        // Optionally remove class if you want animation to repeat on scroll out/in
        // entry.target.classList.remove('is-visible');
      }
    });
  }, { threshold: 0.1 }); // Trigger when 10% of element is visible

  // Observe each element
  elements.forEach(el => observer.observe(el));
});
</script>

<style scoped>
/* Initial state for elements that animate on scroll */
.animate-fade-in-on-scroll {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out; /* Smooth transition */
}

/* Final state when element is visible */
.animate-fade-in-on-scroll.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* Utility classes for staggered animations */
.delay-200 { transition-delay: 0.2s; }
.delay-400 { transition-delay: 0.4s; }
</style>