<template>
    <section class="relative py-8 h-screen flex items-center justify-center text-center overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-600 opacity-90 animate-gradient-shift">
        </div>
        <div class="absolute inset-0 z-0 pattern-dots opacity-10"></div>
        <div class="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            <div class="animate-fade-in-on-scroll flex flex-col gap-6">
                <h2 class="text-4xl font-bold text-white mb-6 text-start">
                    Notre Histoire, Votre Avenir : Pourquoi SmartParcours ?
                </h2>
                <p class="text-lg text-white mb-6 text-start text-justify">
                    Étant personnellement victime du manque d'orientation au moment crucial des choix post-bac,
                    <span class="font-semibold text-gray-100">Ezra Fanomezantsoa</span> (le créateur et développeur
                    unique de l'application)
                    a conçu SmartParcours. Notre mission est de garantir que chaque jeune trouve sa voie
                    et réalise son plein potentiel, sans les incertitudes que la génération précédente a pu connaître.
                </p>
                <p class="text-lg text-white mb-6 text-start text-justify">
                    Nous exploitons la puissance de l'Intelligence Artificielle pour analyser en profondeur
                    les parcours académiques, les intérêts et les performances de chaque élève, offrant des
                    recommandations ultra-personnalisées et basées sur des données concrètes.
                </p>
                <p class="text-lg text-white text-start text-justify">
                    Convaincus que le succès futur repose sur des bases solides, SmartParcours valorise l'importance
                    du dossier académique complet pour une orientation éclairée. Notre vision s'étend au-delà des
                    résultats:
                    nous explorons des fonctionnalités pour inclure des aspects de développement personnel et
                    d'expériences sociales, préparant les élèves à un monde en constante évolution.
                </p>
                <button @click="$emit('add-school')"
                    class="flex gap-4 items-center rounded-full w-[fit-content] justify-center text-indigo-600 text-md font-medium bg-white px-12 py-5 hover:shadow-xl transform hover:-translate-y-1 transition duration-300">
                    <SparklesIcon class="h-8 w-8 text-indigo-600" />
                    <span>Je m'embarque maintenant</span>
                </button>
            </div>
            <div class="relative animate-fade-in-on-scroll delay-200">
                <!-- <img src="https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg?_gl=1*1thlf0j*_ga*MTc4MDAwOTUxOC4xNzQ5OTgwMjgw*_ga_8JE65Q40S6*czE3NTM3OTI2MjckbzckZzEkdDE3NTM3OTI2NDAkajQ3JGwwJGgw"
                    alt="Illustration de l'histoire" class="rounded-xl shadow-2xl" /> -->
                <AnimatedImg/>
            </div>
        </div>
    </section>
</template>

<script setup>
import { SparklesIcon, UsersIcon } from '@heroicons/vue/24/outline'; // Adjust path and import relevant icons
import AnimatedImg from '../../../assets/svg/whoWeAre.vue'
</script>

<style scoped>
/* Background pattern for visual texture */
.pattern-dots {
    background-image: radial-gradient(#fff 1px, transparent 1.5px);
    background-size: 20px 20px;
}

/* Keyframe animation for background gradient shifting */
@keyframes gradient-shift {
    0% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0% 50%;
    }
}

.animate-gradient-shift {
    background-size: 400% 400%;
    /* Makes the gradient larger than the container to allow movement */
    animation: gradient-shift 15s ease infinite;
    /* Applies the animation */
}

/* Keyframe animation for fade-in and slide-up effect */
@keyframes fade-in-up {
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in-up {
    animation: fade-in-up 1s ease-out forwards;
    opacity: 0;
    /* Start invisible */
    transform: translateY(20px);
    /* Start slightly below */
}
</style>