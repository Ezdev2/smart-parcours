
Cahier de Présentation des Fonctionnalités Actuelles
Application de Gestion Scolaire

Date: 24 juillet 2025

---

## Vue d'ensemble des fonctionnalités opérationnelles

Cette section détaille les fonctionnalités clés de l'application de gestion scolaire qui sont actuellement développées et fonctionnelles.

---

### 1. Système d'authentification et de gestion des rôles

Le cœur de l'application repose sur un système d'authentification robuste via Firebase Authentication, permettant une gestion sécurisée des accès.

* **Connexion sécurisée :** Les utilisateurs peuvent se connecter à l'application en utilisant leur adresse e-mail et leur mot de passe. Le système de connexion est géré par Firebase Authentication, garantissant la sécurité des identifiants.
* **Création de compte administrateur (sur rendez-vous) :** Pour le moment, la création de comptes administrateur est une opération contrôlée. Seul le propriétaire de l'application (ou une personne désignée ayant un accès direct à la console Firebase ou à des outils d'administration spécifiques) peut créer de nouveaux comptes administrateur. Cela assure un contrôle strict sur les accès privilégiés à l'application.
* **Gestion des rôles :** L'application différencie les utilisateurs par des rôles (`admin`, `student`). Ces rôles déterminent les fonctionnalités accessibles et les actions autorisées pour chaque utilisateur.

---

### 2. Gestion des paramètres de l'établissement (pour les administrateurs)

Les administrateurs disposent d'un module complet pour configurer les informations et les préférences de leur établissement.

* **Récupération ou création automatique des paramètres :** Lorsqu'un administrateur se connecte pour la première fois et n'a pas encore de paramètres configurés, l'application crée automatiquement un ensemble de paramètres par défaut associés à son ID. Si des paramètres existent déjà, ils sont simplement récupérés.
* **Informations de l'établissement :** L'administrateur peut définir le nom de l'établissement et l'année académique en cours.
* **Personnalisation de l'interface :** Il est possible de choisir une couleur thématique principale et de télécharger l'URL d'un logo pour personnaliser l'apparence de l'application.
* **Configuration des classes :** L'administrateur peut ajouter, supprimer et gérer la liste des classes de son établissement. Il peut sélectionner des classes existantes ou en créer de nouvelles directement depuis l'interface.
* **Configuration des matières :** Similairement aux classes, l'administrateur peut définir les différentes matières enseignées, avec un nom, un code et un coefficient.
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
    * Un panneau détaillé permet de visualiser toutes les informations du profil d'un étudiant sélectionné.
    * Le nom de l'école (récupéré depuis les paramètres de l'administrateur) est affiché pour chaque étudiant.
* **Modification des détails des étudiants :**
    * Les administrateurs peuvent éditer les informations de profil d'un étudiant directement depuis la liste ou le panneau de détails.
    * Les modifications incluent le nom, l'email, la classe, la moyenne générale, les filières et centres d'intérêt.
* **Désactivation/Suppression des étudiants :**
    * Les administrateurs peuvent "supprimer" un étudiant, ce qui a pour effet de **désactiver son compte** (`isActive: false`). Cette approche est préférée à la suppression définitive pour conserver un historique des données et éviter la perte accidentelle d'informations liées.
* **Gestion des bulletins des étudiants :**
    * Depuis le panneau de détails d'un étudiant, l'administrateur peut voir la liste des bulletins associés à cet étudiant.
    * Il peut ajouter de nouveaux bulletins, modifier des bulletins existants et supprimer des bulletins. (La prévisualisation/génération PDF est à implémenter pour le futur).

---

### 4. Profil étudiant (pour les étudiants)

Les étudiants ont accès à leur propre profil pour consulter et mettre à jour leurs informations.

* **Consultation du profil :** Les étudiants peuvent voir leurs informations personnelles (nom, prénom, date de naissance, email, classe, moyenne générale, niveau, code d'inscription, filières et centres d'intérêt) ainsi que l'école à laquelle ils sont rattachés.
* **Mise à jour du profil :** Les étudiants peuvent modifier leurs informations personnelles telles que leur date de naissance, leurs filières d'intérêt et leurs centres d'intérêt. Cela leur permet de maintenir leur profil à jour.
* **Mise à jour automatique du niveau :** Lorsqu'un étudiant met à jour sa classe, son "niveau" est automatiquement recalculé et mis à jour dans son profil.

---

### 5. Technologies sous-jacentes

L'application est construite avec des technologies modernes et robustes :

* **Frontend :** Vue.js 3 (avec Composition API et `<script setup>`) pour une interface utilisateur dynamique et réactive.
* **Backend & Base de données :** Google Firebase (Firestore pour la base de données NoSQL, Authentication pour la gestion des utilisateurs, et Timestamp pour les horodatages serveur).
* **UI/UX :** Tailwind CSS pour un style rapide et cohérent.
* **Icônes :** Heroicons pour une intégration facile d'icônes vectorielles.

