<template>
  <transition name="modal-fade">
    <div class="fixed inset-0 z-[100] flex items-center justify-center bg-white/70 backdrop-blur-md p-4">
      <Card
        class="relative w-full max-w-3xl bg-white/95 backdrop-blur-sm border-0 shadow-2xl overflow-hidden max-h-[95vh] transition-all duration-500 transform"
        >

        <div class="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 p-8 text-white rounded-xl">
          <h2 class="text-3xl font-bold text-center mb-2">
            Inscrire Votre Établissement
          </h2>
          <p class="text-center text-indigo-100 text-sm">
            Rejoignez SmartParcours et transformez l'orientation de vos élèves
          </p>
        </div>

        <!-- Modern Step Indicator -->
        <div class="px-8 py-6 bg-gray-50/50">
          <div class="flex items-center justify-center space-x-4">
            <!-- Step 1 -->
            <div class="flex items-center">
              <div class="relative">
                <div :class="[
                  'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300',
                  currentStep >= 1
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-500'
                ]">
                  <span v-if="currentStep > 1" class="text-xs">✓</span>
                  <span v-else>1</span>
                </div>
                <div v-if="currentStep === 1"
                  class="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full opacity-30 animate-pulse">
                </div>
              </div>
              <div class="ml-3 hidden sm:block">
                <p :class="['text-sm font-medium', currentStep >= 1 ? 'text-gray-900' : 'text-gray-500']">
                  Présentation
                </p>
                <p class="text-xs text-gray-500">Bienvenue</p>
              </div>
            </div>

            <!-- Connector -->
            <div class="flex-1 h-px bg-gradient-to-r from-gray-300 to-gray-300 max-w-[60px]">
              <div :class="[
                'h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500',
                currentStep > 1 ? 'w-full' : 'w-0'
              ]"></div>
            </div>

            <!-- Step 2 -->
            <div class="flex items-center">
              <div class="relative">
                <div :class="[
                  'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300',
                  currentStep >= 2
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-500'
                ]">
                  <span v-if="currentStep > 2" class="text-xs">✓</span>
                  <span v-else>2</span>
                </div>
                <div v-if="currentStep === 2"
                  class="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full opacity-30 animate-pulse">
                </div>
              </div>
              <div class="ml-3 hidden sm:block">
                <p :class="['text-sm font-medium', currentStep >= 2 ? 'text-gray-900' : 'text-gray-500']">
                  Vos Infos
                </p>
                <p class="text-xs text-gray-500">Coordonnées</p>
              </div>
            </div>

            <!-- Connector -->
            <div class="flex-1 h-px bg-gradient-to-r from-gray-300 to-gray-300 max-w-[60px]">
              <div :class="[
                'h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500',
                currentStep > 2 ? 'w-full' : 'w-0'
              ]"></div>
            </div>

            <!-- Step 3 -->
            <div class="flex items-center">
              <div class="relative">
                <div :class="[
                  'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300',
                  currentStep >= 3
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-500'
                ]">
                  <span v-if="currentStep > 3" class="text-xs">✓</span>
                  <span v-else>3</span>
                </div>
                <div v-if="currentStep === 3"
                  class="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full opacity-30 animate-pulse">
                </div>
              </div>
              <div class="ml-3 hidden sm:block">
                <p :class="['text-sm font-medium', currentStep >= 3 ? 'text-gray-900' : 'text-gray-500']">
                  Conditions
                </p>
                <p class="text-xs text-gray-500">Finalisation</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Form Content -->
        <div class="px-8 py-6 overflow-y-auto md:max-h-[60vh] max-h-[50vh]">
          <form @submit.prevent="submitForm">
            <!-- Step 1: Welcome -->
            <div v-show="currentStep === 1" class="space-y-6">
              <div class="text-center space-y-4">
                <div
                  class="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35.524 9.015 9.015 0 00-.4.04z" />
                  </svg>
                </div>

                <h3
                  class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                  Bienvenue sur SmartParcours !
                </h3>

                <div class="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 space-y-4 text-gray-700">
                  <p class="leading-relaxed">
                    Nous sommes ravis de vous compter parmi nos futurs partenaires.
                    Grâce à notre plateforme, vous pourrez transformer l'orientation de vos élèves avec des outils basés
                    sur l'IA,
                    une gestion simplifiée des bulletins, et un suivi personnalisé.
                  </p>
                  <p class="leading-relaxed">
                    Pour commencer, nous aurons besoin de quelques informations sur votre établissement
                    et la personne qui en sera l'administrateur principal.
                  </p>
                </div>

                <div class="flex items-center justify-center space-x-2 text-indigo-600">
                  <span class="text-sm font-medium">Cliquez sur "Suivant" pour démarrer</span>
                  <svg class="w-4 h-4 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clip-rule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Step 2: Form -->
            <div v-show="currentStep === 2" class="space-y-6">
              <h3
                class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-6">
                Vos Coordonnées & Votre Établissement
              </h3>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Prénom de l'administrateur</label>
                  <input type="text" v-model="formData.adminFirstName" required
                    class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-0 transition-colors duration-200 bg-gray-50/50" />
                </div>
                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Nom de l'administrateur</label>
                  <input type="text" v-model="formData.adminLastName" required
                    class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-0 transition-colors duration-200 bg-gray-50/50" />
                </div>
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-semibold text-gray-700">Votre email personnel (pour la
                  connexion)</label>
                <input type="email" v-model="formData.adminEmail" required
                  class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-0 transition-colors duration-200 bg-gray-50/50" />
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-semibold text-gray-700">Nom de votre établissement</label>
                <input type="text" v-model="formData.schoolName" required
                  class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-0 transition-colors duration-200 bg-gray-50/50" />
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Ville de l'établissement</label>
                  <input type="text" v-model="formData.schoolCity" required
                    class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-0 transition-colors duration-200 bg-gray-50/50" />
                </div>
                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Numéro de téléphone (WhatsApp)</label>
                  <input type="tel" v-model="formData.whatsappNumber" placeholder="+261 xx xxx xx xx"
                    class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-0 transition-colors duration-200 bg-gray-50/50" />
                </div>
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-semibold text-gray-700">Votre rôle dans l'établissement</label>
                <select v-model="formData.adminRoleInSchool" required
                  class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-0 transition-colors duration-200 bg-gray-50/50">
                  <option value="">Sélectionner votre rôle</option>
                  <option value="Directeur">Directeur</option>
                  <option value="Enseignant">Enseignant</option>
                  <option value="Administrateur IT">Administrateur IT</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
            </div>

            <!-- Step 3: Terms -->
            <div v-show="currentStep === 3" class="space-y-6">
              <h3
                class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                Conditions Générales d'Utilisation
              </h3>

              <div
                class="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl p-6 max-h-64 overflow-y-auto text-gray-700 text-sm leading-relaxed">
                <p class="font-bold mb-2">Préambule :</p>
                <p>Bienvenue sur SmartParcours. En utilisant nos services, vous acceptez les présentes conditions
                  d'utilisation. Ces conditions visent à définir les modalités d'accès et d'utilisation de notre
                  plateforme pour les établissements scolaires.</p>
                <p class="font-bold mt-4 mb-2">1. Objet :</p>
                <p>SmartParcours est une application de gestion scolaire et d'orientation, propulsée par l'intelligence
                  artificielle, destinée à accompagner les élèves et les établissements dans leur parcours éducatif. Les
                  services incluent la gestion des bulletins, le suivi des élèves et la génération de recommandations
                  personnalisées.</p>
                <p class="font-bold mt-4 mb-2">2. Accès aux Services :</p>
                <p>L'accès à la plateforme est réservé aux établissements scolaires après validation de leur demande
                  d'inscription par l'équipe SmartParcours. Chaque établissement se verra attribuer un compte
                  administrateur unique.</p>
                <p class="font-bold mt-4 mb-2">3. Responsabilités de l'Établissement :</p>
                <ul class="list-disc pl-5 space-y-1">
                  <li>Maintenir la confidentialité des identifiants de connexion.</li>
                  <li>Assurer l'exactitude des données élèves et enseignants saisies.</li>
                  <li>Respecter la législation en vigueur concernant la protection des données personnelles (RGPD, si
                    applicable, ou lois locales).</li>
                  <li>Utiliser la plateforme conformément à son objectif éducatif.</li>
                </ul>
                <p class="font-bold mt-4 mb-2">4. Propriété Intellectuelle :</p>
                <p>Tous les contenus, éléments graphiques, et logiciels de SmartParcours sont la propriété exclusive
                  d'Ezra Fanomezantsoa et sont protégés par les lois sur la propriété intellectuelle. Toute reproduction
                  ou utilisation sans autorisation est strictement interdite.</p>
                <p class="font-bold mt-4 mb-2">5. Confidentialité et Protection des Données :</p>
                <p>SmartParcours s'engage à protéger les données personnelles collectées. Celles-ci sont traitées
                  conformément à notre Politique de Confidentialité, accessible sur notre site. Les données élèves sont
                  utilisées uniquement dans le cadre des services d'orientation et de suivi scolaire.</p>
                <p class="font-bold mt-4 mb-2">6. Limitation de Responsabilité :</p>
                <p>SmartParcours s'efforce d'assurer la disponibilité et la fiabilité de la plateforme. Cependant, nous
                  ne pouvons garantir une absence totale d'interruption ou d'erreurs. La plateforme est fournie "telle
                  quelle" sans garantie de performance.</p>
                <p class="font-bold mt-4 mb-2">7. Modifications des Conditions :</p>
                <p>SmartParcours se réserve le droit de modifier les présentes conditions d'utilisation à tout moment.
                  Les utilisateurs seront informés des modifications par voie d'affichage sur la plateforme ou par
                  email.</p>
                <p class="font-bold mt-4 mb-2">8. Droit Applicable et Juridiction :</p>
                <p>Les présentes conditions sont régies par le droit malgache. Tout litige relatif à l'utilisation de
                  SmartParcours sera soumis à la juridiction exclusive des tribunaux d'Antananarivo.</p>
              </div>

              <div class="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4">
                <label class="flex items-start text-sm text-gray-900">
                  <input type="checkbox" v-model="termsAccepted" required
                    class="mt-1 rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500" />
                  <span class="ml-3 leading-relaxed">J'ai lu et j'accepte les conditions générales d'utilisation de
                    SmartParcours.</span>
                </label>
                <p class="text-xs text-gray-500 mt-3 ml-6">
                  Vous pouvez lire les conditions complètes
                  <router-link to="/terms-conditions" target="_blank"
                    class="text-indigo-600 hover:underline font-medium">ici</router-link>.
                </p>
              </div>
            </div>
          </form>
        </div>

        <!-- Footer Actions -->
        <div class="px-8 py-6 bg-gray-50/50 border-t border-gray-200">
          <div class="flex justify-between items-center">
            <Button v-if="currentStep > 1" @click="prevStep"
              class="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-medium transition-all duration-200 hover:scale-105">
              ← <span class="hidden md:block">Précédent</span>
            </Button>
            <div class="flex-grow"></div>
            <!-- Close Button -->
            <button @click="$emit('close')"
              class="p-2 rounded-full bg-gray-100/80 text-gray-600 hover:text-gray-800 transition-all duration-200 mr-4">
              Annuler
            </button>
            <Button v-if="currentStep < 3" @click="nextStep"
              class="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg">
              <span class="hidden md:block">Suivant</span> →
            </Button>
            <Button v-if="currentStep === 3" @click="submitForm" :disabled="!termsAccepted || submitting" :class="[
              'px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg',
              (!termsAccepted || submitting)
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white hover:scale-105'
            ]">
              <span v-if="submitting" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                  </path>
                </svg>
                Envoi...
              </span>
              <span v-else>🚀 Envoyer la demande</span>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  </transition>
</template>

<script setup>
import { ref, reactive } from 'vue';
import Card from '@/components/UI/Card.vue';
import Button from '@/components/UI/Button.vue';
import { XMarkIcon } from '@heroicons/vue/24/outline';

const emit = defineEmits(['close', 'submit-success']);

const currentStep = ref(1);
const termsAccepted = ref(false);
const submitting = ref(false);

const formData = reactive({
  adminFirstName: '',
  adminLastName: '',
  adminEmail: '',
  schoolName: '',
  schoolCity: '',
  whatsappNumber: '',
  adminRoleInSchool: ''
});

const nextStep = () => {
  if (currentStep.value === 1) {
    currentStep.value++;
  } else if (currentStep.value === 2) {
    // Validate Step 2 fields
    if (!formData.adminFirstName || !formData.adminLastName || !formData.adminEmail || !formData.schoolName || !formData.schoolCity || !formData.adminRoleInSchool) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.adminEmail)) {
      alert('Veuillez saisir une adresse email valide.');
      return;
    }
    currentStep.value++;
  }
};

const prevStep = () => {
  currentStep.value--;
};

const submitForm = async () => {
  if (!termsAccepted.value) {
    alert('Vous devez accepter les conditions générales d\'utilisation.');
    return;
  }

  submitting.value = true;
  try {
    console.log("Demande d'inscription envoyée:", formData);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    emit('submit-success', formData);
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la demande:', error);
    alert('Une erreur est survenue lors de l\'envoi de votre demande. Veuillez réessayer.');
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
/* Enhanced modal transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.8) translateY(-50px);
}

/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #6366f1, #8b5cf6);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #4f46e5, #7c3aed);
}

/* Input focus effects */
input:focus,
select:focus {
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

/* Button hover effects */
.hover\:scale-105:hover {
  transform: scale(1.05);
}

/* Pulse animation for active step */
@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Bounce animation for arrow */
@keyframes bounce {

  0%,
  100% {
    transform: translateX(0);
  }

  50% {
    transform: translateX(4px);
  }
}

.animate-bounce {
  animation: bounce 1s infinite;
}
</style>