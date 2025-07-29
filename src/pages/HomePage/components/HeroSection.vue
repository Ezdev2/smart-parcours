<template>
    <section class="relative h-screen flex items-center justify-center text-center overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-indigo-100 to-white-100 opacity-50 animate-gradient-shift">
        </div>
        <div class="absolute inset-0 z-0 pattern-dots opacity-10"></div>
        <div class="flex flex-col items-center gap-4 relative z-10 text-white max-w-6xl px-4 animate-fade-in-up">
            <h1 class="text-5xl md:text-7xl font-extrabold text-gray-600 leading-tight mb-4 drop-shadow-sm">
                L'orientation <span class="text-indigo-600">scolaire</span> rendue <span class="text-indigo-600">intelligente</span> et accessible.
            </h1>
            <div class="absolute left-[-200px] top-[-200px]">
                <HeroAnimated class="w-[400px]"/>
            </div>
            <p class="text-lg md:text-xl mb-10 text-gray-700 max-w-2xl mx-auto">
                Optimisez le parcours de vos élèves avec l'Intelligence Artificielle et un suivi personnalisé pour un
                avenir prometteur.
            </p>
            <div class="flex lg:flex-row flex-col items center gap-6 lg:w-3/4">
                <button @click="$emit('add-school')"
                    class="flex gap-4 items-center rounded-full w-full justify-center text-white text-md font-medium bg-indigo-600 px-8 py-5 hover:shadow-xl transform hover:-translate-y-1 transition duration-300">
                    <SparklesIcon class="h-8 w-8 text-white" />
                    <span>Inscrire mon Établissement</span>
                </button>
                <router-link 
                    to="/login" 
                    @click="mobileMenuOpen = false" 
                    class="flex gap-4 items-center rounded-full w-full justify-center text-indigo-600 text-md font-medium bg-white border px-8 py-5 hover:shadow-xl transform hover:-translate-y-1 transition duration-300"
                >
                    <UsersIcon class="h-8 w-8 text-indigo-600" />
                    <span>J'ai un compte</span>
                </router-link>
            </div>
        </div>
    </section>
</template>

<script setup>
import { SparklesIcon, UsersIcon } from '@heroicons/vue/24/outline'; // Adjust path and import relevant icons
import HeroAnimated from '../../../assets/svg/heroAnimated.vue';

</script>

<style scoped>
/* Background pattern for visual texture */
.pattern-dots {
    background-image: radial-gradient(#6f28bb 1px, transparent 1.5px);
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