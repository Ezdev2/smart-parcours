<template>
    <div
        class="w-full p-12 rounded-2xl shadow-lg bg-gradient-to-r from-indigo-900 to-indigo-500 relative overflow-hidden">
        <div class="flex flex-col md:flex-row justify-between items-center gap-6 relative">
            <div class="flex-1 text-center md:text-left">
                <h2 class="text-3xl font-bold text-white mb-4">
                    Bienvenue, {{ user?.profile?.firstName }} {{ user?.profile?.lastName }} !
                </h2>

                <div class="text-base text-gray-200 flex flex-wrap gap-4 justify-center md:justify-start">
                    <div v-if="user?.role === 'student'"
                        class="flex flex-col gap-1 sm:gap-2 justify-center md:justify-start py-2 px-4 rounded-2xl bg-white/15">
                        <p class="font-semibold">Classe actuelle</p>
                        <p>{{ className }}</p>
                    </div>
                    <div v-if="user?.role === 'teacher'"
                        class="flex flex-col gap-1 sm:gap-2 justify-center md:justify-start py-2 px-4 rounded-2xl bg-white/15">
                        <p class="font-semibold">Vos classes assignées</p>
                        <p v-if="user?.profile?.classes?.length > 0">
                            <span v-for="(item, index) in classList" :key="index">
                                {{ item }}, {{ ' ' }}
                            </span>
                        </p>
                        <p v-else class="text-gray-500">
                            Aucune classe assignée.
                        </p>
                    </div>

                    <div v-if="schoolName"
                        class="flex flex-col gap-1 sm:gap-2 justify-center md:justify-start py-2 px-4 rounded-2xl bg-white/15">
                        <span class="font-semibold">École</span>
                        <span>{{ schoolName }}</span>
                    </div>

                    <div v-if="principalName"
                        class="flex flex-col gap-1 sm:gap-2 justify-center md:justify-start py-2 px-4 rounded-2xl bg-white/15">
                        <span class="font-semibold">Directeur(trice)</span>
                        <span>{{ principalName }}</span>
                    </div>
                </div>

                <router-link :to="btnLink"
                    class="mt-6 bg-white hover:bg-indigo-600 text-indigo-900 font-semibold px-6 py-3 rounded-full inline-flex items-center gap-2 transition duration-300">
                    {{ buttonText }}
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd"
                            d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                            clip-rule="evenodd" />
                    </svg>
                </router-link>
            </div>

            <div class="mt-6 md:mt-0">
                <img width="180" height="180" class="rounded-lg shadow-md" :src="schoolLogo" alt="School Logo" />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'UserWelcomeBanner',
    props: {
        user: {
            type: Object,
            required: true,
            default: () => ({ profile: { firstName: 'Utilisateur', lastName: '' } }),
        },
        className: {
            type: String,
            default: String
        },
        classList: {
            type: Array,
            default: null
        },
        schoolName: {
            type: String,
            default: null,
        },
        principalName: {
            type: String,
            default: null,
        },
        schoolLogo: {
            type: String,
            required: true,
        },
        btnLink: {
            type: String,
            default: '/profil',
        },
        buttonText: {
            type: String,
            default: 'Voir les détails',
        },
    },
};
</script>
