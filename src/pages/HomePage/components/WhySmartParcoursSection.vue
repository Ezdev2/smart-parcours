<template>
    <section ref="sectionRef" class="relative md:py-40 py-20 mt-4 flex items-center justify-center overflow-hidden">
        <!-- Background -->
        <div class="absolute inset-0 bg-gradient-to-br from-indigo-900 to-slate-900 opacity-90"></div>
        <div class="absolute inset-0 z-0 pattern-dots opacity-10"></div>

        <div class="absolute bottom-0 left-0 z-0 opacity-10 w-full max-w-xl animate-fade-in-on-scroll">

            <svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M85.248 204.8L256 307.2L512 153.6L256 0L0 153.6L85.248 204.8ZM0 204.8V409.6L51.2 352.768V235.52L0 204.8ZM256 512L128 435.2L76.8 404.48V250.88L256 358.4L435.2 250.88V404.48L256 512Z"
                    fill="white" />
            </svg>

        </div>

        <div class="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            <!-- Left Column -->
            <div
                :class="['flex flex-col gap-6 transform transition-all duration-1000', isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10']">
                <h2 class="text-4xl md:text-5xl font-bold text-white mb-4 text-start">
                    Notre Histoire, Votre Avenir : Pourquoi SmartParcours ?
                </h2>
                <p class="text-lg text-gray-200 mb-2 text-start text-justify">
                    Étant personnellement victime du manque d'orientation au moment crucial des choix post-bac,
                    <a href="https://ez-dev.netlify.app" class="font-semibold text-gray-50">Ezra Fanomezantsoa</a>
                    (le créateur et développeur de l'application) a conçu SmartParcours. Notre mission est de garantir
                    que chaque jeune trouve sa voie et réalise son plein potentiel, sans les incertitudes que la
                    génération précédente a pu connaître.
                </p>
                <p class="text-lg text-gray-200 mb-2 text-start text-justify">
                    Nous exploitons la puissance de l'Intelligence Artificielle pour analyser parcours, intérêts et
                    résultats pour offrir des recommandations personnalisées et fiables.
                </p>
                <p class="text-lg text-gray-200 text-start text-justify">
                    SmartParcours valorise un dossier scolaire complet et prépare les élèves aux défis futurs, en
                    intégrant développement personnel et vie sociale.
                </p>
                <button
                    class="flex md:gap-4 items-center rounded-full md:w-[fit-content] justify-center text-indigo-600 bg-white px-12 md:py-5 py-3 hover:shadow-xl transform hover:-translate-y-1 transition duration-300 font-semibold">
                    <SparklesIcon class="h-6 w-6 text-indigo-600" />
                    <span>Je m'embarque maintenant</span>
                </button>
            </div>

            <!-- Right Column -->
            <div class="flex flex-col gap-6 relative">
                <div class="flex flex-col gap-6">
                    <div v-for="(card, index) in cards" :key="index" :style="{ transitionDelay: `${index * 150}ms` }"
                        :class="['flex items-start gap-4 p-6 rounded-2xl bg-gray-800 bg-opacity-70 backdrop-blur-sm shadow-xl transition-all duration-1000 transform', isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10']">
                        <div class="p-3 bg-indigo-500 rounded-lg text-white">
                            <component :is="card.icon" class="text-white h-6 w-6" />
                        </div>
                        <div>
                            <h3 class="text-xl font-semibold text-white mb-1">{{ card.title }}</h3>
                            <p class="text-gray-300 text-sm">{{ card.description }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { SparklesIcon, UsersIcon, AcademicCapIcon, LightBulbIcon } from '@heroicons/vue/24/outline';

const isVisible = ref(false);
const sectionRef = ref(null);

const cards = [
    {
        icon: AcademicCapIcon,
        title: 'Guidance Personnalisée',
        description: 'Trouvez votre voie et réalisez votre plein potentiel avec un accompagnement sur mesure pour les choix post-bac.',
    },
    {
        icon: LightBulbIcon,
        title: 'Analyses Intelligentes',
        description: "Nous exploitons l'Intelligence Artificielle pour des recommandations personnalisées et fiables basées sur vos intérêts et résultats.",
    },
    {
        icon: UsersIcon,
        title: 'Développement Holistique',
        description: 'Valorisez un dossier scolaire complet et préparez-vous aux défis futurs en intégrant le développement personnel et social.',
    },
    {
        icon: SparklesIcon,
        title: 'Support Dédié',
        description: 'Accédez à une assistance experte pour vous accompagner à chaque étape de votre parcours éducatif.',
    },
];

onMounted(() => {
    const observer = new IntersectionObserver(
        ([entry]) => {
            if (entry.isIntersecting) isVisible.value = true;
        },
        {
            root: null,
            rootMargin: '0px',
            threshold: 0.2,
        }
    );

    if (sectionRef.value) observer.observe(sectionRef.value);
});
</script>
