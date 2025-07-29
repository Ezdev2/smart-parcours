<template>
  <transition name="modal-fade">
    <div class="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <Card class="relative w-full max-w-2xl p-6 overflow-y-auto max-h-[90vh] transition-all duration-300 transform scale-95 opacity-0"
            :class="{ 'scale-100 opacity-100': true }"> <button @click="$emit('close')" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <XMarkIcon class="h-6 w-6" />
        </button>

        <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">
          Inscrire Votre Établissement
        </h2>

        <div class="flex justify-center mb-6 text-sm font-medium text-gray-600">
          <span :class="{'text-indigo-600': currentStep === 1}">Étape 1: Présentation</span>
          <span class="mx-2">/</span>
          <span :class="{'text-indigo-600': currentStep === 2}">Étape 2: Vos Infos</span>
          <span class="mx-2">/</span>
          <span :class="{'text-indigo-600': currentStep === 3}">Étape 3: Conditions</span>
        </div>

        <form @submit.prevent="submitForm">
          <div v-show="currentStep === 1" class="space-y-4 text-center">
            <h3 class="text-xl font-semibold text-gray-800 mb-3">
              Bienvenue sur Smart Parcours !
            </h3>
            <p class="text-gray-700 leading-relaxed">
              Nous sommes ravis de vous compter parmi nos futurs partenaires.
              Grâce à notre plateforme, vous pourrez transformer l'orientation de vos élèves avec des outils basés sur l'IA,
              une gestion simplifiée des bulletins, et un suivi personnalisé.
            </p>
            <p class="text-gray-700 leading-relaxed">
              Pour commencer, nous aurons besoin de quelques informations sur votre établissement
              et la personne qui en sera l'administrateur principal.
            </p>
            <p class="text-gray-700 font-medium">Cliquez sur "Suivant" pour démarrer.</p>
          </div>

          <div v-show="currentStep === 2" class="space-y-4">
            <h3 class="text-xl font-semibold text-gray-800 mb-4">
              Vos Coordonnées & Votre Établissement
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Prénom de l'administrateur</label>
                <input type="text" v-model="formData.adminFirstName" required
                       class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Nom de l'administrateur</label>
                <input type="text" v-model="formData.adminLastName" required
                       class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Votre email personnel (pour la connexion)</label>
              <input type="email" v-model="formData.adminEmail" required
                     class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Nom de votre établissement</label>
              <input type="text" v-model="formData.schoolName" required
                     class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Ville de l'établissement</label>
                <input type="text" v-model="formData.schoolCity" required
                       class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Numéro de téléphone (WhatsApp si possible)</label>
                <input type="tel" v-model="formData.whatsappNumber"
                       placeholder="+261 xx xxx xx xx"
                       class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Votre rôle dans l'établissement</label>
              <select v-model="formData.adminRoleInSchool" required
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                <option value="">Sélectionner votre rôle</option>
                <option value="Directeur">Directeur</option>
                <option value="Enseignant">Enseignant</option>
                <option value="Administrateur IT">Administrateur IT</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
          </div>

          <div v-show="currentStep === 3" class="space-y-4">
            <h3 class="text-xl font-semibold text-gray-800 mb-4">
              Conditions Générales d'Utilisation
            </h3>
            <div class="bg-gray-50 border border-gray-200 rounded-md p-4 max-h-60 overflow-y-auto text-gray-700 text-sm leading-relaxed">
              <p class="font-bold mb-2">Préambule :</p>
              <p>Bienvenue sur Smart Parcours. En utilisant nos services, vous acceptez les présentes conditions d'utilisation. Ces conditions visent à définir les modalités d'accès et d'utilisation de notre plateforme pour les établissements scolaires.</p>
              <p class="font-bold mt-4 mb-2">1. Objet :</p>
              <p>Smart Parcours est une application de gestion scolaire et d'orientation, propulsée par l'intelligence artificielle, destinée à accompagner les élèves et les établissements dans leur parcours éducatif. Les services incluent la gestion des bulletins, le suivi des élèves et la génération de recommandations personnalisées.</p>
              <p class="font-bold mt-4 mb-2">2. Accès aux Services :</p>
              <p>L'accès à la plateforme est réservé aux établissements scolaires après validation de leur demande d'inscription par l'équipe Smart Parcours. Chaque établissement se verra attribuer un compte administrateur unique.</p>
              <p class="font-bold mt-4 mb-2">3. Responsabilités de l'Établissement :</p>
              <ul class="list-disc pl-5 space-y-1">
                <li>Maintenir la confidentialité des identifiants de connexion.</li>
                <li>Assurer l'exactitude des données élèves et enseignants saisies.</li>
                <li>Respecter la législation en vigueur concernant la protection des données personnelles (RGPD, si applicable, ou lois locales).</li>
                <li>Utiliser la plateforme conformément à son objectif éducatif.</li>
              </ul>
              <p class="font-bold mt-4 mb-2">4. Propriété Intellectuelle :</p>
              <p>Tous les contenus, éléments graphiques, et logiciels de Smart Parcours sont la propriété exclusive d'Ezra Fanomezantsoa et sont protégés par les lois sur la propriété intellectuelle. Toute reproduction ou utilisation sans autorisation est strictement interdite.</p>
              <p class="font-bold mt-4 mb-2">5. Confidentialité et Protection des Données :</p>
              <p>Smart Parcours s'engage à protéger les données personnelles collectées. Celles-ci sont traitées conformément à notre Politique de Confidentialité, accessible sur notre site. Les données élèves sont utilisées uniquement dans le cadre des services d'orientation et de suivi scolaire.</p>
              <p class="font-bold mt-4 mb-2">6. Limitation de Responsabilité :</p>
              <p>Smart Parcours s'efforce d'assurer la disponibilité et la fiabilité de la plateforme. Cependant, nous ne pouvons garantir une absence totale d'interruption ou d'erreurs. La plateforme est fournie "telle quelle" sans garantie de performance.</p>
              <p class="font-bold mt-4 mb-2">7. Modifications des Conditions :</p>
              <p>Smart Parcours se réserve le droit de modifier les présentes conditions d'utilisation à tout moment. Les utilisateurs seront informés des modifications par voie d'affichage sur la plateforme ou par email.</p>
              <p class="font-bold mt-4 mb-2">8. Droit Applicable et Juridiction :</p>
              <p>Les présentes conditions sont régies par le droit malgache. Tout litige relatif à l'utilisation de Smart Parcours sera soumis à la juridiction exclusive des tribunaux d'Antananarivo.</p>
            </div>
            <label class="flex items-center text-sm text-gray-900 mt-4">
              <input type="checkbox" v-model="termsAccepted" required
                     class="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500" />
              <span class="ml-2">J'ai lu et j'accepte les conditions générales d'utilisation.</span>
            </label>
            <p class="text-xs text-gray-500 mt-2">
              Vous pouvez lire les conditions complètes <router-link to="/terms-conditions" target="_blank" class="text-indigo-600 hover:underline">ici</router-link>.
            </p>
          </div>

          <div class="flex justify-between mt-8">
            <Button v-if="currentStep > 1" @click="prevStep" variant="outline" type="button">
              Précédent
            </Button>
            <div class="flex-grow"></div>
            <Button v-if="currentStep < 3" @click="nextStep" variant="primary" type="button">
              Suivant
            </Button>
            <Button v-if="currentStep === 3" type="submit" variant="primary" :disabled="!termsAccepted || submitting">
              {{ submitting ? 'Envoi...' : 'Envoyer la demande' }}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  </transition>
</template>

<script setup>
import { ref, reactive } from 'vue';
import Card from '@/components/UI/Card.vue';
import Button from '@/components/UI/Button.vue';
import { XMarkIcon } from '@heroicons/vue/24/outline'; // Adjust path

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
  // Basic validation for current step before proceeding
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
    // Simulate API call/email send
    console.log("Demande d'inscription envoyée:", formData);
    // In a real app, send this formData to a backend endpoint (e.g., Firebase Cloud Function, Email.js service)
    // Example using fetch (conceptual, requires a real endpoint):
    /*
    const response = await fetch('/api/send-school-registration-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    if (!response.ok) {
      throw new Error('Failed to send registration request');
    }
    */
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    emit('submit-success', formData); // Emit success with form data
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la demande:', error);
    alert('Une erreur est survenue lors de l\'envoi de votre demande. Veuillez réessayer.');
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
/* Modal transition */
.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
}

/* Ensure Card animation works with transition */
.modal-fade-enter-active .card,
.modal-fade-leave-active .card {
  transition: all 0.3s ease-out;
}
.modal-fade-enter-from .card,
.modal-fade-leave-to .card {
  transform: translateY(-20px) scale(0.95);
  opacity: 0;
}
</style>