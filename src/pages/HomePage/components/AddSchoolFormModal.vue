<template>
  <transition name="modal-fade">
    <div class="fixed inset-0 z-[100] flex items-center justify-center bg-white/70 backdrop-blur-md p-4">
      <Card
        class="relative w-full max-w-3xl bg-white/95 backdrop-blur-sm border-0 shadow-2xl overflow-hidden max-h-[95vh] transition-all duration-500 transform">

        <div class="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 p-8 text-white rounded-xl">
          <h2 class="text-3xl font-bold text-center mb-2">
            Inscrire Votre Établissement
          </h2>
          <p class="text-center text-indigo-100 text-sm">
            Rejoignez SmartParcours et transformez l'orientation de vos élèves
          </p>
        </div>

        <div v-if="!status" class="px-8 py-6 bg-gray-50/50">
          <div class="flex items-center justify-center space-x-4">
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

            <div class="flex-1 h-px bg-gradient-to-r from-gray-300 to-gray-300 max-w-[60px]">
              <div :class="[
                'h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500',
                currentStep > 1 ? 'w-full' : 'w-0'
              ]"></div>
            </div>

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

            <div class="flex-1 h-px bg-gradient-to-r from-gray-300 to-gray-300 max-w-[60px]">
              <div :class="[
                'h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500',
                currentStep > 2 ? 'w-full' : 'w-0'
              ]"></div>
            </div>

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

        <div class="px-8 py-6 overflow-y-auto md:max-h-[60vh] max-h-[50vh]">
          <div v-if="status === 'success'" class="flex flex-col items-center text-center space-y-6 text-gray-800">
            <div class="flex justify-center">
              <CheckCircleIcon class="h-16 w-16 text-green-500" />
            </div>
            <h3 class="text-2xl font-bold">Merci pour votre inscription !</h3>
            <p class="text-sm leading-relaxed">
              Votre demande a été envoyée avec succès. <br />
              Notre équipe technique vous contactera dans les plus brefs délais pour finaliser votre intégration sur
              SmartParcours.
            </p>
            <Button @click="$emit('close')"
              class="mt-6 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:scale-105 transition-all duration-200">
              Découvrir SmartParcours
            </Button>
          </div>

          <div v-else-if="status === 'error'" class="text-center space-y-6 text-red-600">
            <div class="flex justify-center">
              <XCircleIcon class="h-16 w-16 text-red-500" />
            </div>
            <h3 class="text-xl font-semibold">Oups... une erreur est survenue</h3>
            <p class="text-sm leading-relaxed text-gray-700">
              Nous rencontrons une erreur interne. Veuillez réessayer dans quelques instants ou nous contacter si le
              problème persiste.
            </p>
            <Button @click="status = ''" class="mt-6 px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-xl">
              Retour au formulaire
            </Button>
          </div>
          
          <form v-if="!status" @submit.prevent="submitForm">
            <div v-show="currentStep === 1" class="space-y-6">
              <div class="text-center space-y-4">
                <div class="flex items-center justify-center mx-auto mb-6">
                  <Logo type="sigle" />
                </div>

                <h3
                  class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                  Bienvenue sur SmartParcours !
                </h3>

                <div class="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 space-y-4 text-gray-700">
                  <p class="leading-relaxed">
                    Nous sommes ravis de vous compter parmi nos futurs partenaires.
                    Grâce à notre plateforme, vous pourrez transformer l'orientation de vos élèves avec des outils
                    basés
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

            <div v-show="currentStep === 2" class="space-y-6">
              <h3
                class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-6">
                Vos Coordonnées & Votre Établissement
              </h3>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label for="adminFirstName" class="block text-sm font-semibold text-gray-700">
                    Prénom de l'administrateur <span class="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    id="adminFirstName" 
                    name="adminFirstName" 
                    v-model="formData.adminFirstName"
                    required 
                    placeholder="Ex : Rivo"
                    :class="[
                      'w-full px-4 py-3 rounded-xl border-2 transition-colors duration-200 bg-gray-50/50',
                      errors.adminFirstName 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                        : 'border-gray-200 focus:border-indigo-500 focus:ring-0'
                    ]"
                    @blur="validateField('adminFirstName')"
                    @input="clearFieldError('adminFirstName')" />
                  <p v-if="errors.adminFirstName" class="text-red-500 text-xs mt-1 flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                    {{ errors.adminFirstName }}
                  </p>
                </div>
                <div class="space-y-2">
                  <label for="adminLastName" class="block text-sm font-semibold text-gray-700">
                    Nom de l'administrateur <span class="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    id="adminLastName" 
                    name="adminLastName" 
                    v-model="formData.adminLastName" 
                    required
                    placeholder="Ex : Rakoto"
                    :class="[
                      'w-full px-4 py-3 rounded-xl border-2 transition-colors duration-200 bg-gray-50/50',
                      errors.adminLastName 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                        : 'border-gray-200 focus:border-indigo-500 focus:ring-0'
                    ]"
                    @blur="validateField('adminLastName')"
                    @input="clearFieldError('adminLastName')" />
                  <p v-if="errors.adminLastName" class="text-red-500 text-xs mt-1 flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                    {{ errors.adminLastName }}
                  </p>
                </div>
              </div>

              <div class="space-y-2">
                <label for="adminEmail" class="block text-sm font-semibold text-gray-700">
                  Votre email (pour la connexion) <span class="text-red-500">*</span>
                </label>
                <input 
                  type="email" 
                  id="adminEmail" 
                  name="adminEmail" 
                  v-model="formData.adminEmail" 
                  required
                  placeholder="exemple@domaine.com"
                  :class="[
                    'w-full px-4 py-3 rounded-xl border-2 transition-colors duration-200 bg-gray-50/50',
                    errors.adminEmail 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                      : 'border-gray-200 focus:border-indigo-500 focus:ring-0'
                  ]"
                  @blur="validateField('adminEmail')"
                  @input="clearFieldError('adminEmail')" />
                <p v-if="errors.adminEmail" class="text-red-500 text-xs mt-1 flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                  {{ errors.adminEmail }}
                </p>
              </div>

              <div class="space-y-2">
                <label for="schoolName" class="block text-sm font-semibold text-gray-700">
                  Nom de votre établissement <span class="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  id="schoolName" 
                  name="schoolName" 
                  v-model="formData.schoolName" 
                  required
                  placeholder="Ex : Lycée Moderne d'Analamahitsy"
                  :class="[
                    'w-full px-4 py-3 rounded-xl border-2 transition-colors duration-200 bg-gray-50/50',
                    errors.schoolName 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                      : 'border-gray-200 focus:border-indigo-500 focus:ring-0'
                  ]"
                  @blur="validateField('schoolName')"
                  @input="clearFieldError('schoolName')" />
                <p v-if="errors.schoolName" class="text-red-500 text-xs mt-1 flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                  {{ errors.schoolName }}
                </p>
              </div>

              <div class="space-y-2">
                <label for="studentTotal" class="block text-sm font-semibold text-gray-700">
                  Effectif total estimé de vos étudiants <span class="text-red-500">*</span>
                </label>
                <input 
                  type="number" 
                  id="studentTotal" 
                  name="studentTotal" 
                  v-model="formData.studentTotal" 
                  required
                  min="1"
                  placeholder="Ex : 350"
                  :class="[
                    'w-full px-4 py-3 rounded-xl border-2 transition-colors duration-200 bg-gray-50/50',
                    errors.studentTotal 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                      : 'border-gray-200 focus:border-indigo-500 focus:ring-0'
                  ]"
                  @blur="validateField('studentTotal')"
                  @input="clearFieldError('studentTotal')" />
                <p v-if="errors.studentTotal" class="text-red-500 text-xs mt-1 flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                  {{ errors.studentTotal }}
                </p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label for="schoolCity" class="block text-sm font-semibold text-gray-700">
                    Ville de l'établissement <span class="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    id="schoolCity" 
                    name="schoolCity" 
                    v-model="formData.schoolCity" 
                    required
                    placeholder="Ex : Antananarivo"
                    :class="[
                      'w-full px-4 py-3 rounded-xl border-2 transition-colors duration-200 bg-gray-50/50',
                      errors.schoolCity 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                        : 'border-gray-200 focus:border-indigo-500 focus:ring-0'
                    ]"
                    @blur="validateField('schoolCity')"
                    @input="clearFieldError('schoolCity')" />
                  <p v-if="errors.schoolCity" class="text-red-500 text-xs mt-1 flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                    {{ errors.schoolCity }}
                  </p>
                </div>
                <div class="space-y-2">
                  <label for="whatsappNumber" class="block text-sm font-semibold text-gray-700">
                    Numéro de téléphone (WhatsApp)
                  </label>
                  <input 
                    type="tel" 
                    id="whatsappNumber" 
                    name="whatsappNumber" 
                    v-model="formData.whatsappNumber"
                    placeholder="+261 34 12 345 67"
                    :class="[
                      'w-full px-4 py-3 rounded-xl border-2 transition-colors duration-200 bg-gray-50/50',
                      errors.whatsappNumber 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                        : 'border-gray-200 focus:border-indigo-500 focus:ring-0'
                    ]"
                    @blur="validateField('whatsappNumber')"
                    @input="clearFieldError('whatsappNumber')" />
                  <p v-if="errors.whatsappNumber" class="text-red-500 text-xs mt-1 flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                    {{ errors.whatsappNumber }}
                  </p>
                </div>
              </div>

              <div class="space-y-2">
                <label for="adminRoleInSchool" class="block text-sm font-semibold text-gray-700">
                  Votre rôle dans l'établissement <span class="text-red-500">*</span>
                </label>
                <select 
                  id="adminRoleInSchool" 
                  name="adminRoleInSchool" 
                  v-model="formData.adminRoleInSchool" 
                  required
                  :class="[
                    'w-full px-4 py-3 rounded-xl border-2 transition-colors duration-200 bg-gray-50/50',
                    errors.adminRoleInSchool 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                      : 'border-gray-200 focus:border-indigo-500 focus:ring-0'
                  ]"
                  @blur="validateField('adminRoleInSchool')"
                  @change="clearFieldError('adminRoleInSchool')">
                  <option value="">Sélectionner votre rôle</option>
                  <option value="Directeur">Directeur</option>
                  <option value="Enseignant">Enseignant</option>
                  <option value="Administrateur IT">Administrateur IT</option>
                  <option value="Autre">Autre</option>
                </select>
                <p v-if="errors.adminRoleInSchool" class="text-red-500 text-xs mt-1 flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                  {{ errors.adminRoleInSchool }}
                </p>
              </div>
            </div>

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
                <p>SmartParcours est une application de gestion scolaire et d'orientation, propulsée par
                  l'intelligence
                  artificielle, destinée à accompagner les élèves et les établissements dans leur parcours éducatif.
                  Les
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
                  d'Ezra Fanomezantsoa et sont protégés par les lois sur la propriété intellectuelle. Toute
                  reproduction
                  ou utilisation sans autorisation est strictement interdite.</p>
                <p class="font-bold mt-4 mb-2">5. Confidentialité et Protection des Données :</p>
                <p>SmartParcours s'engage à protéger les données personnelles collectées. Celles-ci sont traitées
                  conformément à notre Politique de Confidentialité, accessible sur notre site. Les données élèves
                  sont
                  utilisées uniquement dans le cadre des services d'orientation et de suivi scolaire.</p>
                <p class="font-bold mt-4 mb-2">6. Limitation de Responsabilité :</p>
                <p>SmartParcours s'efforce d'assurer la disponibilité et la fiabilité de la plateforme. Cependant,
                  nous
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
                  <input 
                    type="checkbox" 
                    v-model="termsAccepted" 
                    required
                    :class="[
                      'mt-1 rounded border-gray-300 shadow-sm focus:ring-indigo-500',
                      errors.termsAccepted ? 'border-red-500 text-red-600' : 'text-indigo-600'
                    ]"
                    @change="clearFieldError('termsAccepted')" />
                  <span class="ml-3 leading-relaxed">J'ai lu et j'accepte les conditions générales d'utilisation de
                    SmartParcours.</span>
                </label>
                <p v-if="errors.termsAccepted" class="text-red-500 text-xs mt-2 ml-6 flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                  {{ errors.termsAccepted }}
                </p>
                <p class="text-xs text-gray-500 mt-3 ml-6">
                  Vous pouvez lire les conditions complètes
                  <a href="#" target="_blank" class="text-indigo-600 hover:underline font-medium">ici</a>.
                </p>
              </div>
            </div>
          </form>
        </div>

        <div v-if="!status" class="px-8 py-6 bg-gray-50/50 border-t border-gray-200">
          <div class="flex justify-between items-center">
            <Button v-if="currentStep > 1" @click="prevStep"
              class="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-medium transition-all duration-200 hover:scale-105">
              ← <span class="hidden md:block">Précédent</span>
            </Button>
            <div class="flex-grow"></div>
            <button @click="$emit('close')"
              class="p-2 rounded-full bg-gray-100/80 text-gray-600 hover:text-gray-800 transition-all duration-200 mr-4">
              Annuler
            </button>
            <Button v-if="currentStep < 3" @click="nextStep"
              class="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg">
              <span class="hidden md:block">Suivant</span> →
            </Button>
            <Button v-if="currentStep === 3" @click="submitForm" :disabled="!canSubmit || submitting" :class="[
              'px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg',
              (!canSubmit || submitting)
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
              <span v-else class="flex items-center">
                <SparklesIcon class="w-5 h-5 mr-2" />
                Envoyer la demande
              </span>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  </transition>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import Card from '@/components/UI/Card.vue';
import Button from '@/components/UI/Button.vue';
import { SparklesIcon, UsersIcon, XMarkIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/vue/24/outline';
import Logo from '../../../assets/logo.vue'

const emit = defineEmits(['close', 'submit-success']);

const currentStep = ref(1);
const termsAccepted = ref(false);
const submitting = ref(false);
const status = ref('');

const formData = reactive({
  adminFirstName: '',
  adminLastName: '',
  adminEmail: '',
  schoolName: '',
  studentTotal: '',
  schoolCity: '',
  whatsappNumber: '',
  adminRoleInSchool: ''
});

const errors = reactive({
  adminFirstName: '',
  adminLastName: '',
  adminEmail: '',
  schoolName: '',
  studentTotal: '',
  schoolCity: '',
  whatsappNumber: '',
  adminRoleInSchool: '',
  termsAccepted: ''
});

const canSubmit = computed(() => {
  return termsAccepted.value && 
         formData.adminFirstName &&
         formData.adminLastName &&
         formData.adminEmail &&
         formData.schoolName &&
         formData.studentTotal &&
         formData.schoolCity &&
         formData.adminRoleInSchool &&
         !Object.values(errors).some(error => error !== '');
});

const validateField = (fieldName) => {
  switch (fieldName) {
    case 'adminFirstName':
      if (!formData.adminFirstName.trim()) {
        errors.adminFirstName = 'Le prénom est obligatoire';
      } else if (formData.adminFirstName.trim().length < 2) {
        errors.adminFirstName = 'Le prénom doit contenir au moins 2 caractères';
      }
      break;
      
    case 'adminLastName':
      if (!formData.adminLastName.trim()) {
        errors.adminLastName = 'Le nom est obligatoire';
      } else if (formData.adminLastName.trim().length < 2) {
        errors.adminLastName = 'Le nom doit contenir au moins 2 caractères';
      }
      break;
      
    case 'adminEmail':
      if (!formData.adminEmail.trim()) {
        errors.adminEmail = 'L\'email est obligatoire';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.adminEmail)) {
        errors.adminEmail = 'Veuillez saisir une adresse email valide';
      }
      break;
      
    case 'schoolName':
      if (!formData.schoolName.trim()) {
        errors.schoolName = 'Le nom de l\'établissement est obligatoire';
      } else if (formData.schoolName.trim().length < 3) {
        errors.schoolName = 'Le nom doit contenir au moins 3 caractères';
      }
      break;
      
    case 'studentTotal':
      if (!formData.studentTotal) {
        errors.studentTotal = 'L\'effectif est obligatoire';
      } else if (parseInt(formData.studentTotal) < 1) {
        errors.studentTotal = 'L\'effectif doit être supérieur à 0';
      } else if (parseInt(formData.studentTotal) > 10000) {
        errors.studentTotal = 'L\'effectif semble trop élevé';
      }
      break;
      
    case 'schoolCity':
      if (!formData.schoolCity.trim()) {
        errors.schoolCity = 'La ville est obligatoire';
      } else if (formData.schoolCity.trim().length < 2) {
        errors.schoolCity = 'La ville doit contenir au moins 2 caractères';
      }
      break;
      
    case 'whatsappNumber':
      if (formData.whatsappNumber && !/^[\+]?[0-9\s\-\(\)]{10,}$/.test(formData.whatsappNumber)) {
        errors.whatsappNumber = 'Format de numéro invalide';
      }
      break;
      
    case 'adminRoleInSchool':
      if (!formData.adminRoleInSchool) {
        errors.adminRoleInSchool = 'Veuillez sélectionner votre rôle';
      }
      break;
      
    case 'termsAccepted':
      if (!termsAccepted.value) {
        errors.termsAccepted = 'Vous devez accepter les conditions d\'utilisation';
      }
      break;
  }
};

const clearFieldError = (fieldName) => {
  errors[fieldName] = '';
};

const validateStep2 = () => {
  const requiredFields = ['adminFirstName', 'adminLastName', 'adminEmail', 'schoolName', 'studentTotal', 'schoolCity', 'adminRoleInSchool'];
  let hasErrors = false;
  
  requiredFields.forEach(field => {
    validateField(field);
    if (errors[field]) hasErrors = true;
  });
  
  if (formData.whatsappNumber) {
    validateField('whatsappNumber');
    if (errors.whatsappNumber) hasErrors = true;
  }
  
  return !hasErrors;
};

const nextStep = () => {
  if (currentStep.value === 1) {
    currentStep.value++;
  } else if (currentStep.value === 2) {
    if (validateStep2()) {
      currentStep.value++;
    }
  }
};

const prevStep = () => {
  currentStep.value--;
};

const submitForm = async () => {
  // Final validation
  validateField('termsAccepted');
  if (!validateStep2() || !termsAccepted.value) {
    return;
  }

  submitting.value = true;
  try {
    const formBody = new FormData();
    for (const key in formData) {
      formBody.append(key, formData[key]);
    }

    const response = await fetch("https://usebasin.com/f/cf4073ed2495", {
      method: "POST",
      headers: { Accept: "application/json" },
      body: formBody,
    });

    if (response.status === 200) {
      status.value = 'success';
    } else {
      status.value = 'error';
    }
  } catch (error) {
    console.error(error);
    status.value = 'error';
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.8) translateY(-50px);
}

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

input:focus,
select:focus {
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

input.border-red-500:focus,
select.border-red-500:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.hover\:scale-105:hover {
  transform: scale(1.05);
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes bounce {
  0%, 100% {
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