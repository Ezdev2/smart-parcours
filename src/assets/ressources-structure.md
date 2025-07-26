// Structure complète de la base de données Firestore

/*
COLLECTIONS PRINCIPALES :

1. users/ (collection)
   - {userId}/ (document - ID Firebase Auth)
     - email: string
     - role: 'student' | 'admin' | 'teacher'
     - profile: object
       - firstName: string
       - lastName: string
       - dateOfBirth: string | timestamp
       - class: string (pour students)
       - level: string (pour students)
       - filieres: array<string> (pour students)
       - interests: array<string> (pour students)
       - averageGrade: number (pour students)
       - registrationCode: string (pour students)
       - position: string (pour admin/teacher)
     - createdAt: timestamp
     - updatedAt: timestamp
     - isActive: boolean
     - lastLoginAt: timestamp

2. bulletins/ (collection)
   - {bulletinId}/ (document - auto-generated)
     - studentId: string (référence vers users/{userId})
     - classId: string
     - year: string
     - semester: string
     - subjects: array<object>
       - name: string
       - grade: number
       - coefficient: number
       - teacher: string
       - comment: string
     - generalAverage: number
     - classRank: number
     - totalStudents: number
     - generalComment: string
     - uploadedAt: timestamp
     - updatedAt: timestamp
     - uploadedBy: string (référence vers users/{adminId})

3. recommendations/ (collection)
   - {recommendationId}/ (document - auto-generated)
     - studentId: string (référence vers users/{userId})
     - type: 'orientation' | 'academic' | 'career' // Type général de la recommandation
     - title: string // Titre de la recommandation (ex: "Recommandations d'orientation post-bac")
     - content: string // Résumé général ou introduction de la recommandation

     - strengths: array<string> // Liste des points forts de l'étudiant (ex: ["Excellentes aptitudes en mathématiques", "Curiosité scientifique", "Rigueur et autonomie"])
     - improvementAreas: array<string> // Liste des axes d'amélioration (ex: ["Participation orale en classe", "Gestion du temps", "Approfondissement en littérature"])

     - suggestedPaths: array<object>
       - groupType: 'filiere_recommandee' | 'domaine_suggere' | 'metier_potentiel' // L'identifiant interne du groupe
       - groupTitle: string // Le titre affichable pour ce groupe (ex: "Filières Recommandées")
       - suggestions: array<object> // La liste des suggestions individuelles pour ce groupe
         - name: string // Nom de la suggestion (ex: "Licence Informatique")
         - compatibility // pourcentage de compatibilité de suggestion
         - rationale: string // Justification de la suggestion
      
      - academicProfile: object // Profil académique de l'étudiant
       - title: string // Ex: "Scientifique", "Littéraire", "Artistique", etc.
       - code: string // Ex: "scientific", "literary", "artistic", etc. (pour nom d'icône ou classe CSS)

     // Champs de métadonnées
     - priority: 'low' | 'medium' | 'high'
     - status: 'pending' | 'reviewed' | 'implemented'
     - generatedAt: timestamp
     - generatedBy: string (système ou admin)
     - reviewedAt: timestamp
     - reviewedBy: string (ID de l'admin qui a révisé)

4. classes/ (collection)
   - {classId}/ (document - ex: "premiere-s-2024")
     - name: string ("Première S")
     - level: string ("Première")
     - academicYear: string ("2024-2025")
     - schedule: object
     - createdAt: timestamp

5. subjects/ (collection)
   - {subjectId}/ (document)
     - name: string
     - code: string
     - coefficient: number

6. notifications/ (collection)
   - {notificationId}/ (document)
     - userId: string (destinataire)
     - type: 'bulletin' | 'recommendation' | 'system'
     - title: string
     - message: string
     - isRead: boolean
     - createdAt: timestamp
     - relatedDocId: string (optionnel)

7. settings/ (collection)
   - {settingId}/ (document)
     - name: string
     - userId: users/{adminId}
     - academicYear: string
     - themeColor: string
     - logoUrl: string
     - classes: array<object>
     - subjects: array<object> 
     - createdAt: timestamp
     - updatedAt: timestamp
*/

// Exemple de données pour chaque collection :

const exampleUserStudent = {
  email: "marie.dubois@lycee.fr",
  role: "student",
  profile: {
    firstName: "Marie",
    lastName: "Dubois",
    dateOfBirth: "2007-03-15",
    class: "premiere-s-2024",
    level: "Première",
    filieres: ["Sciences", "Mathématiques"],
    interests: ["Musique", "Informatique", "Dessin"],
    averageGrade: 15.2,
    registrationCode: "STU001"
  },
  createdAt: new Date(),
  updatedAt: new Date(),
  isActive: true,
  lastLoginAt: new Date()
}

const exampleUserAdmin = {
  email: "admin@lycee.fr",
  role: "admin",
  profile: {
    firstName: "Jean",
    lastName: "Martin",
    position: "Directeur"
  },
  createdAt: new Date(),
  updatedAt: new Date(),
  isActive: true,
  lastLoginAt: new Date()
}

const exampleBulletin = {
  studentId: "student-user-id",
  year: "2024-2025",
  semester: "Semestre 1",
  subjects: [
    {
      name: "Mathématiques",
      grade: 16.5,
      coefficient: 4,
      teacher: "M. Dupont",
      comment: "Excellent travail, continue ainsi"
    },
    {
      name: "Physique-Chimie",
      grade: 14.0,
      coefficient: 3,
      teacher: "Mme Bernard",
      comment: "Peut mieux faire en chimie"
    }
  ],
  generalAverage: 15.2,
  classRank: 3,
  totalStudents: 28,
  generalComment: "Bon trimestre, élève sérieux",
  uploadedAt: new Date(),
  updatedAt: new Date(),
  uploadedBy: "admin-user-id"
}

const exampleRecommendation = {
  "studentId": "qOGpqN9V0VNApmuQKeq5YumTcSH3",
  "type": "orientation",
  "title": "Recommandations d'orientation post-bac : Analyse approfondie",
  "content": "L'analyse du parcours académique et des intérêts de l'étudiant révèle un potentiel exceptionnel dans les domaines scientifiques et technologiques. Ses performances constantes et sa curiosité le prédisposent à des carrières exigeantes et innovantes.",
  
  "strengths": [
    "Maîtrise avancée des concepts mathématiques et physiques",
    "Capacité d'analyse et de résolution de problèmes complexes",
    "Autonomie et proactivité dans l'apprentissage"
  ],
  "improvementAreas": [
    "Développer les compétences en communication orale",
    "Gestion du temps"
  ],

  "academicProfile": {
    "title": "Scientifique",
    "code": "scientific"
  },
  
  "suggestedPaths": [
    {
      "groupType": "filiere_recommandee",
      "groupTitle": "Filières Recommandées",
      "suggestions": [
        { "name": "Licence Informatique (Parcours Data Science)", "compatibility": 95, "rationale": "Excellents résultats en mathématiques, logique et intérêt prononcé pour l'analyse de données." },
        { "name": "Cycle préparatoire aux Grandes Écoles (MP2I ou MPI)", "compatibility": 80, "rationale": "Solide base scientifique, ambition académique, ouvre la voie aux carrières d'ingénieur." },
        { "name": "Licence Mathématiques-Physique", "compatibility": 70, "rationale": "Intérêt pour la théorie et la recherche." } // Added a 3rd for minimum count
      ]
    },
    {
      "groupType": "domaine_suggere",
      "groupTitle": "Domaines Suggérés",
      "suggestions": [
        { "name": "Ingénierie Aéronautique", "compatibility": 100, "rationale": "Combinaison de la physique, des mathématiques et un intérêt pour les systèmes complexes et l'innovation." },
        { "name": "Recherche en Intelligence Artificielle", "compatibility": 90, "rationale": "Goût pour les défis intellectuels, la modélisation et l'impact technologique." }
      ]
    },
    {
      "groupType": "metier_potentiel",
      "groupTitle": "Métiers Potentiels",
      "suggestions": [
        { "name": "Développeur Full-Stack", "compatibility": 92, "rationale": "Demande du marché et créativité." },
        { "name": "Data Scientist", "compatibility": 88, "rationale": "Analyse de données et statistiques." },
        { "name": "Ingénieur R&D", "compatibility": 80, "rationale": "Innovation et résolution de problèmes complexes." },
        { "name": "Consultant IT", "compatibility": 70, "rationale": "Technique et relationnel." },
        { "name": "Architecte Logiciel", "compatibility": 85, "rationale": "Conception de systèmes." },
        { "name": "Analyste Cybersécurité", "compatibility": 78, "rationale": "Protection des systèmes." }
      ]
    }
  ],
  
  "priority": "high",
  "status": "reviewed",
  "generatedAt": "2025-07-23T17:13:24Z",
  "generatedBy": "system",
  "reviewedAt": "2025-07-25T13:08:03Z",
  "reviewedBy": "adminId123"
}

const exampleClass = {
  name: "Première S",
  level: "Première",
  academicYear: "2024-2025"
}

const exampleSubject = {
  code : "MATH"
  name: "Mathématiques",
  coefficient: 4,
}

const exampleNotification = {
  userId: "student-user-id",
  type: "bulletin",
  title: "Nouveau bulletin disponible",
  message: "Votre bulletin du semestre 1 est disponible. Cliquez ici pour le consulter.",
  isRead: false,
  createdAt: new Date(),
  relatedDocId: "bulletin-id"
}

const exampleSettings = {
  name: "Lycée Jean Jaurès",
  admin: "adminId"
  academicYear: "2024-2025",
  classes: ["premiere-s-2024", "terminale-l-2024", "seconde-a-2024"],
  subjects: ["MATH", "PC"],
  themeColor: "#003366",
  logoUrl: "https://logoipsum.com/artwork/377"
}