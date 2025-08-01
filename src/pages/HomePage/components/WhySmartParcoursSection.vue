<template>
    <section class="relative py-20 mt-4  flex items-center justify-center text-center overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-600 opacity-90 animate-gradient-shift">
        </div>
        <div class="absolute inset-0 z-0 pattern-dots opacity-10"></div>
        <div class="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            <div class="animate-fade-in-on-scroll flex flex-col gap-6">
                <h2 class="text-3xl md:text-6xl font-bold text-white mb-6 text-start">
                    Notre Histoire, Votre Avenir : Pourquoi SmartParcours ?
                </h2>
                <p class="text-lg text-white mb-6 text-start text-justify">
                    Étant personnellement victime du manque d'orientation au moment crucial des choix post-bac,
                    <span class="font-semibold text-gray-100">Ezra Fanomezantsoa</span> (le créateur et développeur
                    de l'application)
                    a conçu SmartParcours. Notre mission est de garantir que chaque jeune trouve sa voie
                    et réalise son plein potentiel, sans les incertitudes que la génération précédente a pu connaître.
                </p>
                <p class="text-lg text-white mb-6 text-start text-justify">
                    Nous exploitons la puissance de l'Intelligence Artificielle pour nous analysons parcours, intérêts et résultats pour offrir des recommandations personnalisées et fiables.
                </p>
                <p class="text-lg text-white text-start text-justify">
                    SmartParcours valorise un dossier scolaire complet et prépare les élèves aux défis futurs, en intégrant développement personnel et vie sociale. 
                </p>
                <button @click="$emit('add-school')"
                    class="flex gap-4 items-center rounded-full md:w-[fit-content] justify-center text-indigo-600 bg-white px-12 md:py-5 py-3 hover:shadow-xl transform hover:-translate-y-1 transition duration-300">
                    <SparklesIcon class="h-8 w-8 text-indigo-600" />
                    <span class="font-bold">Je m'embarque maintenant</span>
                </button>
            </div>
            <div class="relative animate-fade-in-on-scroll delay-200 hidden md:block">
                <AnimatedImg/>
            </div>
        </div>
    </section>
</template>

<script setup>
import { SparklesIcon, UsersIcon } from '@heroicons/vue/24/outline';
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