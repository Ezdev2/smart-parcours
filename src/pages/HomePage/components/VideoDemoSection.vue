<template>
    <section class="py-20 bg-white">
        <div class="container md:grid grid grid-cols-3 gap-4 md:flex-row flex flex-col mx-auto px-4 text-center">
            <div class="col-span-1  animate-fade-in-on-scroll delay-200 flex flex-col gap-6 " >
                <h2 class="text-4xl font-bold text-gray-900 text-start">
                    Découvrez Smart Parcours en Action
                </h2>
                <p class="text-lg text-gray-700 text-start">
                    Voyez comment notre plateforme transforme la gestion scolaire et l'orientation des élèves grâce à
                    une
                    interface intuitive et des outils puissants.
                </p>
                <div class="w-1/2 h-1 bg-gray-900 rounded"></div>
            </div>

            <!-- Youtube -->
            <!-- <div class="relative w-full mx-auto bg-gray-200 rounded-xl overflow-hidden shadow-2xl animate-fade-in-on-scroll delay-400"
                style="padding-top: 56.25%;">
                <iframe class="absolute top-0 left-0 w-full h-full" src="https://www.youtube.com/embed/4Cgn5cLSaSA"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen>
                </iframe>
            </div> -->

            <video
                class="col-span-2 relative w-full mx-auto bg-gray-200 rounded-xl overflow-hidden shadow-1xl animate-fade-in-on-scroll delay-400 h-full object-cover"
                autoplay muted loop playsinline>
                <source src="https://videos.pexels.com/video-files/9198421/9198421-hd_1920_1080_25fps.mp4"
                    type="video/mp4" />
                Votre navigateur ne supporte pas la vidéo HTML5.
            </video>
        </div>
    </section>
</template>

<script setup>
import { onMounted } from 'vue';
import { SparklesIcon } from '@heroicons/vue/24/outline';

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
    transition: opacity 0.6s ease-out, transform 0.6s ease-out;
    /* Smooth transition */
}

/* Final state when element is visible */
.animate-fade-in-on-scroll.is-visible {
    opacity: 1;
    transform: translateY(0);
}

.delay-200 {
    transition-delay: 0.2s;
}

.delay-400 {
    transition-delay: 0.4s;
}
</style>