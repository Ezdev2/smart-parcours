<template>
  <section class="md:py-20 py-12 bg-white">
    <div class="container gap-4 flex flex-col mx-auto px-4">
      <div class="text-center mb-16">
        <h2 class="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
          Testez SmartParcours
        </h2>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          Découvrez comment notre IA peut analyser votre profil et vous recommander 
          des orientations personnalisées. Essayez gratuitement notre démonstration !
        </p>
      </div>

      <div class="mx-auto flex flex-col gap-6 lg:grid grid-cols-3">
        <div class="col-span-2 bg-white rounded-2xl border overflow-hidden flex flex-col items-center justify-center">

          <div class="p-8">
            <div class="grid md:grid-cols-3 gap-6 md:gap-10 items-center">
              <div class="col-span-2">
                <div class="space-y-6">
                  <div class="flex items-start space-x-4">
                    <div class="flex-shrink-0">
                      <div class="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h4 class="text-2xl font-bold text-gray-900">Questionnaire Personnalisé</h4>
                      <p class="text-gray-600">25+ questions adaptées pour évaluer vos aptitudes académiques, aspirations et capacités logiques</p>
                    </div>
                  </div>

                  <div class="flex items-start space-x-4">
                    <div class="flex-shrink-0">
                      <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h4 class="text-2xl font-bold text-gray-900">Analyse IA Avancée</h4>
                      <p class="text-gray-600">Notre intelligence artificielle analyse vos réponses pour identifier votre profil académique optimal</p>
                    </div>
                  </div>

                  <div class="flex items-start space-x-4">
                    <div class="flex-shrink-0">
                      <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h4 class="text-2xl font-bold text-gray-900">Recommandations Ciblées</h4>
                      <p class="text-gray-600">Obtenez des filières universitaires recommandées avec des scores de compatibilité précis</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="md:col-span-1 col-span-2 text-center">
                <div class="bg-black rounded-xl p-8 text-white mb-6">
                  <div class="text-5xl font-bold mb-2">25+</div>
                  <div class="text-lg">Questions Personnalisées</div>
                </div>
                
                <router-link 
                  to="/demo" 
                  class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                  Commencer la Démo
                </router-link>
                
                <p class="text-sm text-gray-500 mt-4">
                  Gratuit • Sans inscription • Résultats instantanés
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Badges des catégories -->
        <div class="col-span-1 flex flex-col gap-6">
          <div class="bg-white rounded-lg p-6 shadow-md">
            <div class="flex items-center space-x-3 mb-3">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Academic
              </span>
            </div>
            <h4 class="font-semibold text-gray-900 mb-2">Évaluation Académique</h4>
            <p class="text-gray-600 text-sm">Analyse de vos compétences dans différentes matières et votre style d'apprentissage</p>
          </div>

          <div class="bg-white rounded-lg p-6 shadow-md">
            <div class="flex items-center space-x-3 mb-3">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Aspiration
              </span>
            </div>
            <h4 class="font-semibold text-gray-900 mb-2">Aspirations Personnelles</h4>
            <p class="text-gray-600 text-sm">Exploration de vos motivations, valeurs et objectifs de carrière</p>
          </div>

          <div class="bg-white rounded-lg p-6 shadow-md">
            <div class="flex items-center space-x-3 mb-3">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Logique
              </span>
            </div>
            <h4 class="font-semibold text-gray-900 mb-2">Capacités Logiques</h4>
            <p class="text-gray-600 text-sm">Évaluation de votre raisonnement, analyse et résolution de problèmes</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
</script>