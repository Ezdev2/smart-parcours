# Cahier de Présentation des Fonctionnalités Actuelles
Application **SmartParcours**

**Date: 26 juillet 2025**

## Vue d'ensemble des fonctionnalités opérationnelles

### 1. Système d'authentification et de gestion des rôles

Le cœur de l'application repose sur un système d'authentification robuste via Firebase Authentication, permettant une gestion sécurisée des accès.

* **Connexion sécurisée :** Les utilisateurs peuvent se connecter à l'application en utilisant leur adresse e-mail et leur mot de passe. Le système de connexion est géré par Firebase Authentication, garantissant la sécurité des identifiants.
* **Création de compte administrateur (sur rendez-vous) :** Pour le moment, la création de comptes administrateur est une opération contrôlée. Seul le propriétaire de l'application (ou une personne désignée ayant un accès direct à la console Firebase ou à des outils d'administration spécifiques) peut créer de nouveaux comptes administrateur. Cela assure un contrôle strict sur les accès privilégiés à l'application.
* **Gestion des rôles :** L'application différencie les utilisateurs par des rôles (`admin`, `student`, `teacher`). Ces rôles déterminent les fonctionnalités accessibles et les actions autorisées pour chaque utilisateur.
* **Alertes et Confirmations :** Des modales d'alerte et de confirmation stylisées (`ConfirmDialog`) sont utilisées pour une meilleure expérience utilisateur lors des opérations sensibles ou des messages d'information.

---

### 2. Gestion des paramètres de l'établissement (pour les administrateurs)

Les administrateurs disposent d'un module complet pour configurer les informations et les préférences de leur établissement.

* **Récupération ou création automatique des paramètres :** Lorsqu'un administrateur se connecte pour la première fois et n'a pas encore de paramètres configurés, l'application crée automatiquement un ensemble de paramètres par défaut associés à son ID. Si des paramètres existent déjà, ils sont simplement récupérés.
* **Informations de l'établissement :** L'administrateur peut définir le nom de l'établissement et l'année académique en cours.
* **Personnalisation de l'interface :** Il est possible de choisir une couleur thématique principale et de télécharger l'URL d'un logo pour personnaliser l'apparence de l'application.
* **Configuration des classes :** L'administrateur peut ajouter, supprimer et gérer la liste des classes de son établissement. Il peut sélectionner des classes existantes ou en créer de nouvelles directement depuis l'interface.
* **Configuration des matières :** Similairement aux classes, l'administrateur peut définir les différentes matières enseignées, avec un nom, un code et un coefficient.
* **Configuration des enseignants (Nouveau) :** Les administrateurs peuvent désormais visualiser, modifier, gérer et ajouter une liste d'enseignants associés à leur établissement. Cette gestion s'intègre aux paramètres généraux de l'établissement.
* **Sauvegarde des modifications :** Toutes les modifications apportées aux paramètres sont persistantes et sauvegardées dans Firestore, garantissant que la configuration de l'établissement est toujours à jour.

---

### 3. Gestion des étudiants (pour les administrateurs)

Un module dédié permet aux administrateurs de gérer efficacement la base de données de leurs étudiants.

* **Ajout de nouveaux étudiants :**
    * Les administrateurs peuvent créer de nouveaux comptes étudiants en renseignant des informations complètes : prénom, nom, e-mail, date de naissance, classe (sélectionnable parmi les classes configurées dans les paramètres de l'école), moyenne générale, filières d'intérêt et centres d'intérêt.
    * Un **code d'inscription unique** est généré automatiquement pour chaque nouvel étudiant, servant de mot de passe temporaire initial.
    * Un e-mail de réinitialisation de mot de passe est automatiquement envoyé à l'étudiant, lui permettant de définir son propre mot de passe dès la première connexion.
    * Lors de la création, un **bulletin vide par défaut** est automatiquement associé à l'étudiant, initialisant ainsi son historique académique.
    * Chaque étudiant créé est lié à l'ID de l'administrateur qui l'a créé (`school` ID), permettant un filtrage précis des étudiants par établissement.
* **Liste et filtrage des étudiants :**
    * Les administrateurs peuvent consulter la liste de tous les étudiants associés à leur établissement.
    * Un filtre par classe est disponible, utilisant la liste des classes définie dans les paramètres de l'administrateur, ce qui permet de visualiser les étudiants d'une classe spécifique.
    * Deux modes d'affichage sont disponibles : une vue "carte" pour un aperçu rapide et une vue "liste" pour une consultation tabulaire des informations.
* **Détails des étudiants :**
    * Un panneau détaillé permet de visualiser toutes les informations du profil d'un étudiant sélectionné, y compris le nom de l'école (récupéré des paramètres de l'administrateur).
    * **Navigation par "page" :** L'affichage des détails et des formulaires d'édition se fait désormais comme des "pages" internes, avec un fil d'Ariane (`Breadcrumb`) pour une navigation claire.
    * **Confirmation des modifications non sauvegardées :** Avant de quitter une page d'édition ou de détails avec des modifications non sauvegardées, une confirmation est demandée à l'utilisateur.
* **Modification des détails des étudiants :**
    * Les administrateurs peuvent éditer les informations de profil d'un étudiant directement depuis la liste ou le panneau de détails.
    * Les modifications incluent le nom, l'email, la classe, la moyenne générale, les filières et centres d'intérêt.
* **Désactivation/Suppression des étudiants :**
    * Les administrateurs peuvent "supprimer" un étudiant, ce qui a pour effet de **désactiver son compte** (`isActive: false`). Cette approche est préférée à la suppression définitive pour conserver un historique des données et éviter la perte accidentelle d'informations liées.
* **Gestion des bulletins des étudiants :**
    * Depuis le panneau de détails d'un étudiant, l'administrateur peut voir la liste de ses bulletins.
    * **Ajout de bulletins :** L'administrateur peut ajouter de nouveaux bulletins, avec sélection de la classe spécifique du bulletin (l'actuelle étant pré-sélectionnée) et saisie détaillée des notes par matière (nom, enseignant, note, coefficient, moyenne de classe, meilleure note, appréciation), ainsi que des commentaires généraux et sur les absences.
    * **Moyenne Générale Automatique :** La moyenne générale du bulletin est calculée dynamiquement en temps réel à partir des notes et coefficients saisis.
    * **Nombre total d'élèves :** Le nombre total d'élèves dans la classe du bulletin est automatiquement calculé.
    * **Professeur Principal :** Pour les administrateurs, le champ "Professeur Principal" permet désormais de sélectionner un enseignant dans la liste configurée dans les paramètres de l'établissement, avec une option pour ajouter un nouvel enseignant si nécessaire.
    * **Modification et Suppression :** Les administrateurs peuvent modifier et supprimer des bulletins existants.
    * **Visualisation du bulletin :** Le bulletin est affiché dans un **format de template imprimable** (`BulletinViewer`), reproduisant le design d'un bulletin scolaire, avec le nom de l'école dynamique et l'adresse.
    * **Téléchargement PDF :** Le bulletin peut être téléchargé en format PDF directement depuis le `BulletinViewer`.

---

### 4. Gestion des élèves (pour les enseignants) (Nouveau)

Les enseignants disposent d'un module dédié pour interagir avec les dossiers de leurs élèves.

* **Vue de la liste des élèves :** Les enseignants peuvent visualiser la liste des élèves affectés à leurs classes, avec des options de filtrage par classe et des modes d'affichage (vue carte/vue liste) similaires à ceux des administrateurs.
* **Remplir les bulletins scolaires (Ajouter des notes de matière) :** Les enseignants ont la capacité de remplir les bulletins scolaires des élèves, spécifiquement dans la section d'ajout de notes par matière.
* **Remplissage automatique du nom de l'enseignant :** Lorsqu'un enseignant ajoute une matière à un bulletin scolaire, son nom est automatiquement renseigné comme "enseignant" pour cette matière.
* **Visualisation du bulletin rempli :** Les enseignants peuvent consulter un bulletin rempli, mais seule la section "ajouter des notes de matière" est interactive pour eux.
* **Pas de recommandations :** La fonctionnalité de recommandation n'est pas accessible aux enseignants.

---

### 5. Profil étudiant (pour les étudiants)

Les étudiants ont accès à leur propre profil pour consulter et mettre à jour leurs informations.

* **Consultation du profil :** Les étudiants peuvent voir leurs informations personnelles (nom, prénom, date de naissance, e-mail, classe actuelle, **moyenne générale du bulletin, moyenne générale globale**, niveau, code d'inscription, filières et centres d'intérêt) ainsi que le **nom de l'école** à laquelle ils sont rattachés.
* **Mise à jour du profil :** Les étudiants peuvent modifier leurs informations personnelles telles que leur date de naissance, leurs filières d'intérêt et leurs centres d'intérêt. Cela leur permet de maintenir leur profil à jour.
* **Mise à jour automatique du niveau :** Lorsqu'un étudiant met à jour sa classe, son "niveau" est automatiquement recalculé et mis à jour dans son profil.

---

### 6. Mes Bulletins (pour les étudiants)

Les étudiants peuvent consulter l'historique détaillé de leurs bulletins scolaires.

* **Liste de Bulletins :** Accès à une liste de tous leurs bulletins, chacun étant associé à une **classe spécifique** (non plus seulement leur classe actuelle).
* **Filtrage et Tri :** Possibilité de filtrer les bulletins par classe et de les trier par date (plus récent/ancien) ou par moyenne (la plus élevée/basse).
* **Modes d'affichage :** Vue en "carte" pour un aperçu rapide et vue en "liste" (tableau) pour un affichage détaillé des informations.
* **Visualisation du bulletin :** Chaque bulletin peut être visualisé en détail dans le même **format de template imprimable** que pour les administrateurs (`BulletinViewer`).
* **Téléchargement PDF :** Le bulletin peut être téléchargé en format PDF directement depuis le `BulletinViewer`.

---

### 7. Recommandations d'Orientation (pour les étudiants)

C'est la fonctionnalité centrale de l'application "SmartParcours", offrant des conseils personnalisés basés sur l'intelligence artificielle.

* **Accès à la Dernière Recommandation :** L'étudiant voit d'emblée sa recommandation la plus récente.
* **Historique des Recommandations :** Accès à un historique cliquable de toutes les recommandations générées, permettant de revoir les analyses précédentes.
* **Génération de Recommandations par IA :**
    * **Processus de Demande :** En un clic, une requête est envoyée à une IA avancée (via l'API Groq).
    * **Compilation des Données :** Le prompt envoyé à l'IA inclut des informations détaillées de l'étudiant :
        * Toutes les notes par matière et appréciations de **tous les bulletins disponibles (avec la classe de chaque bulletin)**.
        * Centres d'intérêt et filières d'intérêt exprimés.
        * Âge de l'étudiant.
        * Moyenne générale globale et niveau scolaire.
    * **Format de Réponse Strict :** L'IA est instruite de renvoyer une réponse au **format JSON structuré** et prédéfini de l'application, incluant :
        * **Titre et Contenu :** Résumé de l'analyse.
        * **Points Forts (`strengths`) :** Minimum 4 points.
        * **Axes d'Amélioration (`improvementAreas`) :** Minimum 3 points.
        * **Profil Académique (`academicProfile`) :** Un profil catégoriel (ex: "Scientifique", "Littéraire", etc.) avec un code associé pour l'affichage d'icônes.
        * **Parcours Suggérés (`suggestedPaths`) :** Organisés en groupes (Filières recommandées, Domaines suggérés, Métiers potentiels).
            * Chaque suggestion inclut un **nom**, un **pourcentage de compatibilité** (entier entre 0 et 100), et une **justification**.
            * Les suggestions sont **impérativement triées par ordre décroissant de compatibilité**.
            * Des nombres minimum de suggestions sont exigés par groupe (ex: 3+ filières, 2+ domaines, 6+ métiers).
            * Les filières suggérées sont précises et adaptées au contexte (Madagascar/international).
            * Les métiers suggérés varient en ambition selon la moyenne de l'étudiant.
    * **Persistance :** La réponse JSON est sauvegardée dans Firestore.
* **Limite de Génération :** Chaque étudiant est limité à **10 générations de recommandations par semaine** pour gérer le flux de l'API. Un compteur et un indicateur de quota restant sont affichés.
* **Visualisation des Compatibilités :**
    * Les parcours suggérés peuvent être affichés en mode **liste** ou en mode **graphique (Bar Chart)**, avec un bouton de bascule.
    * Les graphiques de compatibilité sont stylisés avec des couleurs graduées et des barres horizontales pour une comparaison claire des pourcentages.

---

### 8. Technologies sous-jacentes

L'application est construite avec des technologies modernes et robustes :

* **Frontend :** Vue.js 3 (avec Composition API et `<script setup>`) pour une interface utilisateur dynamique et réactive.
* **Backend & Base de données :** Google Firebase (Firestore pour la base de données NoSQL, Authentication pour la gestion des utilisateurs, et Timestamp pour les horodatages serveur).
* **API d'IA :** Intégration directe avec l'API **Groq (via Llama-3.3-70B-Versatile)** pour la génération des recommandations personnalisées.
* **UI/UX :** Tailwind CSS pour un style rapide et cohérent, et Heroicons pour une intégration facile d'icônes vectorielles.
* **Visualisation de Données :** Chart.js et Vue-Chartjs pour la création de graphiques interactifs.