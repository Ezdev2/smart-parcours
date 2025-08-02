export class DemoOrientationService {
  static GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
  static GROQ_MODEL = "llama-3.3-70b-versatile";

  static ACADEMIC_PROFILES = [
    "Scientifique",
    "Littéraire", 
    "Artistique",
    "Technique",
    "Économique et Social",
    "Sportif",
    "Linguistique",
    "Informatique",
    "Logique",
    "Créatif",
  ];

  // Questions pour le questionnaire de démonstration
  static DEMO_QUESTIONS = {
    academic: [
      {
        id: 'math_level',
        question: 'Comment évaluez-vous votre niveau en mathématiques ?',
        type: 'scale',
        scale: { min: 1, max: 10, labels: ['Très faible', 'Excellent'] },
        badge: 'academic'
      },
      {
        id: 'science_level', 
        question: 'Comment évaluez-vous votre niveau en sciences ?',
        type: 'scale',
        scale: { min: 1, max: 10, labels: ['Très faible', 'Excellent'] },
        badge: 'academic'
      },
      {
        id: 'literature_level',
        question: 'Comment évaluez-vous votre niveau en littérature/français ?',
        type: 'scale', 
        scale: { min: 1, max: 10, labels: ['Très faible', 'Excellent'] },
        badge: 'academic'
      },
      {
        id: 'history_level',
        question: 'Comment évaluez-vous votre niveau en histoire/géographie ?',
        type: 'scale',
        scale: { min: 1, max: 10, labels: ['Très faible', 'Excellent'] },
        badge: 'academic'
      },
      {
        id: 'languages_level',
        question: 'Comment évaluez-vous votre niveau en langues étrangères ?',
        type: 'scale',
        scale: { min: 1, max: 10, labels: ['Très faible', 'Excellent'] },
        badge: 'academic'
      },
      {
        id: 'favorite_subject',
        question: 'Quelle est votre matière préférée ?',
        type: 'select',
        options: [
          'Mathématiques', 'Physique', 'Chimie', 'Biologie', 'Français', 
          'Histoire', 'Géographie', 'Anglais', 'Philosophie', 'Arts', 
          'Sport', 'Informatique', 'Économie'
        ],
        badge: 'academic'
      },
      {
        id: 'study_preference',
        question: 'Quel type d\'apprentissage préférez-vous ?',
        type: 'select',
        options: [
          'Théorique et conceptuel', 'Pratique et expérimental', 
          'Créatif et artistique', 'Technique et manuel'
        ],
        badge: 'academic'
      },
      {
        id: 'academic_strength',
        question: 'Dans quel domaine vous sentez-vous le plus à l\'aise ?',
        type: 'select',
        options: [
          'Sciences exactes', 'Sciences humaines', 'Langues et communication', 
          'Arts et créativité', 'Sport et activité physique', 'Technologie'
        ],
        badge: 'academic'
      }
    ],
    
    personal: [
      {
        id: 'career_motivation',
        question: 'Qu\'est-ce qui vous motive le plus dans un futur métier ?',
        type: 'select',
        options: [
          'Aider les autres', 'Innover et créer', 'Résoudre des problèmes complexes',
          'Gagner beaucoup d\'argent', 'Avoir du prestige social', 'Voyager',
          'Travailler en équipe', 'Être indépendant'
        ],
        badge: 'aspiration'
      },
      {
        id: 'work_environment',
        question: 'Dans quel environnement aimeriez-vous travailler ?',
        type: 'select',
        options: [
          'Bureau moderne', 'Laboratoire', 'Hôpital/clinique', 'École/université',
          'Entreprise technologique', 'ONG/association', 'Gouvernement', 
          'À l\'étranger', 'Freelance/télétravail'
        ],
        badge: 'aspiration'
      },
      {
        id: 'life_priorities',
        question: 'Quelle est votre priorité principale dans la vie ?',
        type: 'select',
        options: [
          'Réussir professionnellement', 'Avoir une famille équilibrée',
          'Contribuer à la société', 'Développement personnel',
          'Sécurité financière', 'Reconnaissance sociale'
        ],
        badge: 'aspiration'
      },
      {
        id: 'risk_tolerance',
        question: 'Comment vous situez-vous face aux risques ?',
        type: 'scale',
        scale: { min: 1, max: 10, labels: ['Très prudent', 'Très audacieux'] },
        badge: 'aspiration'
      },
      {
        id: 'leadership',
        question: 'Aimez-vous diriger et prendre des responsabilités ?',
        type: 'scale',
        scale: { min: 1, max: 10, labels: ['Pas du tout', 'Beaucoup'] },
        badge: 'aspiration'
      },
      {
        id: 'social_impact',
        question: 'L\'impact social de votre travail est-il important pour vous ?',
        type: 'scale',
        scale: { min: 1, max: 10, labels: ['Pas important', 'Très important'] },
        badge: 'aspiration'
      },
      {
        id: 'creativity_importance',
        question: 'À quel point la créativité est-elle importante dans votre travail idéal ?',
        type: 'scale',
        scale: { min: 1, max: 10, labels: ['Pas importante', 'Essentielle'] },
        badge: 'aspiration'
      }
    ],
    
    logic: [
      {
        id: 'problem_solving',
        question: 'Face à un problème complexe, quelle est votre première réaction ?',
        type: 'select',
        options: [
          'Je le décompose en étapes simples', 'Je cherche des exemples similaires',
          'Je demande conseil à d\'autres', 'Je fais appel à mon intuition',
          'J\'utilise des outils/méthodes', 'Je prends du recul pour réfléchir'
        ],
        badge: 'logique'
      },
      {
        id: 'analytical_thinking',
        question: 'Comment évaluez-vous votre capacité d\'analyse ?',
        type: 'scale',
        scale: { min: 1, max: 10, labels: ['Faible', 'Excellente'] },
        badge: 'logique'
      },
      {
        id: 'pattern_recognition',
        question: 'Êtes-vous bon(ne) pour identifier des modèles et tendances ?',
        type: 'scale',
        scale: { min: 1, max: 10, labels: ['Pas du tout', 'Très bon(ne)'] },
        badge: 'logique'
      },
      {
        id: 'logical_reasoning',
        question: 'Dans une discussion, privilégiez-vous la logique ou l\'émotion ?',
        type: 'scale',
        scale: { min: 1, max: 10, labels: ['Toujours l\'émotion', 'Toujours la logique'] },
        badge: 'logique'
      },
      {
        id: 'detail_orientation',
        question: 'À quel point êtes-vous attentif(ve) aux détails ?',
        type: 'scale',
        scale: { min: 1, max: 10, labels: ['Vision globale', 'Très détaillé(e)'] },
        badge: 'logique'
      },
      {
        id: 'abstract_thinking',
        question: 'Êtes-vous à l\'aise avec les concepts abstraits ?',
        type: 'scale',
        scale: { min: 1, max: 10, labels: ['Préfère le concret', 'Très à l\'aise'] },
        badge: 'logique'
      },
      {
        id: 'decision_making',
        question: 'Comment prenez-vous vos décisions importantes ?',
        type: 'select',
        options: [
          'Après analyse approfondie', 'En suivant mon intuition',
          'En consultant les autres', 'Rapidement selon la situation',
          'En pesant pros et contres', 'En me basant sur l\'expérience'
        ],
        badge: 'logique'
      },
      {
        id: 'concentration',
        question: 'Comment évaluez-vous votre capacité de concentration ?',
        type: 'scale',
        scale: { min: 1, max: 10, labels: ['Facilement distrait(e)', 'Très concentré(e)'] },
        badge: 'logique'
      },
      {
        id: 'memory_type',
        question: 'Quel type de mémoire fonctionne le mieux pour vous ?',
        type: 'select',
        options: [
          'Mémoire visuelle (images, schémas)', 'Mémoire auditive (sons, explications)',
          'Mémoire kinesthésique (gestes, pratique)', 'Mémoire logique (associations, liens)'
        ],
        badge: 'logique'
      },
      {
        id: 'learning_speed',
        question: 'À quelle vitesse apprenez-vous de nouveaux concepts ?',
        type: 'scale',
        scale: { min: 1, max: 10, labels: ['Lentement mais sûrement', 'Très rapidement'] },
        badge: 'logique'
      }
    ]
  };

  /**
   * Construit le prompt pour l'IA basé sur les réponses du questionnaire
   */
  static buildDemoPrompt(userData, responses) {
    const { firstName, lastName, age, level, classLevel } = userData;

    // Analyse des réponses par catégorie
    const academicResponses = responses.filter(r => 
      this.DEMO_QUESTIONS.academic.find(q => q.id === r.questionId)
    );
    const personalResponses = responses.filter(r => 
      this.DEMO_QUESTIONS.personal.find(q => q.id === r.questionId)
    );
    const logicResponses = responses.filter(r => 
      this.DEMO_QUESTIONS.logic.find(q => q.id === r.questionId)
    );

    let prompt = `# Academic Orientation Analysis - DEMO Mode

You are an experienced academic counselor analyzing a Malagasy student's profile for educational orientation. Based on questionnaire responses, provide structured recommendations.

## STUDENT INFORMATION
**Student Name:** ${firstName} ${lastName}
**Age:** ${age} years
**Academic Level:** ${level}
**Current Class:** ${classLevel}

## QUESTIONNAIRE RESPONSES ANALYSIS

### Academic Profile (${academicResponses.length} responses):
`;

    academicResponses.forEach(response => {
      const question = this.DEMO_QUESTIONS.academic.find(q => q.id === response.questionId);
      prompt += `- ${question.question}: ${response.answer}\n`;
    });

    prompt += `\n### Personal Aspirations (${personalResponses.length} responses):
`;

    personalResponses.forEach(response => {
      const question = this.DEMO_QUESTIONS.personal.find(q => q.id === response.questionId);
      prompt += `- ${question.question}: ${response.answer}\n`;
    });

    prompt += `\n### Logic & Reasoning (${logicResponses.length} responses):
`;

    logicResponses.forEach(response => {
      const question = this.DEMO_QUESTIONS.logic.find(q => q.id === response.questionId);
      prompt += `- ${question.question}: ${response.answer}\n`;
    });

    prompt += `
---

## RESPONSE REQUIREMENTS - DEMO MODE

Your response MUST be a valid JSON object.
Respond ONLY with raw JSON.
Do NOT include any explanatory text, comments, tags, or code blocks.
Start directly with { and end with }.

### Required JSON Structure for DEMO:

{
  "title": "Analyse de Profil",
  "content": "Analyse personnalisée basée sur le questionnaire de ${firstName} ${lastName}. Cette démonstration montre les capacités d'analyse de SmartParcours.",
  "type": "demo_orientation",
  "academicProfile": {
    "title": "Profile Name (choose ONE that best fits: ${this.ACADEMIC_PROFILES.join(', ')})",
    "code": "profile_code_in_lowercase_no_spaces_no_accents",
    "description": "Description détaillée du profil académique en 2-3 phrases"
  },
  "strengths": ["Point fort 1", "Point fort 2", "Point fort 3", "Point fort 4"],
  "improvementAreas": ["Axe d'amélioration 1", "Axe d'amélioration 2", "Axe d'amélioration 3"],
  "suggestedPaths": [
    {
      "groupType": "filiere_recommandee",
      "groupTitle": "Filières Recommandées",
      "suggestions": [
        {
          "name": "Nom de la filière en français",
          "compatibility": 85,
          "rationale": "Justification détaillée en français"
        }
      ]
    },
    {
      "groupType": "domaine_suggere",
      "groupTitle": "Domaines Suggérés",
      "isBlurred": true,
      "suggestions": [
        {
          "name": "Contenu flouté - Inscrivez votre établissement",
          "compatibility": "XX",
          "rationale": "Contenu disponible après inscription"
        }
      ]
    },
    {
      "groupType": "metier_potentiel", 
      "groupTitle": "Métiers Potentiels",
      "isBlurred": true,
      "suggestions": [
        {
          "name": "Contenu flouté - Inscrivez votre établissement", 
          "compatibility": "XX",
          "rationale": "Contenu disponible après inscription"
        }
      ]
    }
  ]
}

### Specific Requirements:

1. **Academic Profile:** Must be one of the predefined profiles matching the student's responses
2. **Filières Recommandées:** Provide 4-6 realistic university programs with high compatibility scores (75-95)  
3. **Domaines/Métiers:** Show as blurred content to encourage registration
4. **Content Language:** All content in French except JSON keys
5. **Compatibility Scores:** Integers 0-100, sorted descending

**CRITICAL:** Return ONLY the JSON object. Base recommendations on questionnaire responses analysis.`;

    return prompt;
  }

  /**
   * Génère des recommandations démo via l'API GROQ
   */
  static async generateDemoRecommendations(userData, responses) {
    try {
      const prompt = this.buildDemoPrompt(userData, responses);
      const apiKey = import.meta.env.VITE_GROQ_API_KEY;

      if (!apiKey) {
        console.warn("No GROQ API key found. Using mock demo recommendations.");
        return this.getMockDemoRecommendations(userData);
      }

      const response = await fetch(this.GROQ_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: this.GROQ_MODEL,
          messages: [
            {
              role: "system",
              content: "You are an academic counselor providing demo orientation analysis. Respond ONLY with valid JSON, no additional text. All content in French except JSON keys."
            },
            {
              role: "user", 
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 3000,
          top_p: 0.9,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices?.[0]?.message?.content;

      if (!aiResponse) {
        throw new Error("No content in AI response.");
      }

      // Clean and parse JSON response
      let cleanedResponse = aiResponse.trim();
      if (cleanedResponse.startsWith("```json")) {
        cleanedResponse = cleanedResponse.replace(/^```json\s*/, "").replace(/\s*```$/, "");
      } else if (cleanedResponse.startsWith("```")) {
        cleanedResponse = cleanedResponse.replace(/^```\s*/, "").replace(/\s*```$/, "");
      }

      let parsedResponse;
      try {
        parsedResponse = JSON.parse(cleanedResponse);
      } catch (jsonError) {
        console.error("Failed to parse AI response:", jsonError);
        const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedResponse = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("No valid JSON found in AI response.");
        }
      }

      return parsedResponse;

    } catch (error) {
      console.error("Error generating demo recommendations:", error);
      return this.getMockDemoRecommendations(userData);
    }
  }

  /**
   * Données mock pour la démo
   */
  static getMockDemoRecommendations(userData) {
    return {
      title: "Analyse de Profil - Démonstration SmartParcours",
      content: `Analyse personnalisée basée sur le questionnaire de ${userData.firstName} ${userData.lastName}. Cette démonstration montre les capacités d'analyse de SmartParcours.`,
      type: "demo_orientation",
      academicProfile: {
        title: "Scientifique",
        code: "scientifique", 
        description: "Profil orienté vers les sciences exactes avec de bonnes capacités d'analyse logique et de résolution de problèmes."
      },
      strengths: [
        "Excellentes capacités analytiques",
        "Goût prononcé pour la résolution de problèmes",
        "Bonne logique mathématique",
        "Curiosité scientifique développée"
      ],
      improvementAreas: [
        "Développer les compétences en communication",
        "Renforcer la culture générale",
        "Améliorer la gestion du stress"
      ],
      suggestedPaths: [
        {
          groupType: "filiere_recommandee",
          groupTitle: "Filières Recommandées", 
          suggestions: [
            {
              name: "Licence en Informatique",
              compatibility: 92,
              rationale: "Excellente adéquation avec votre profil logique et votre intérêt pour la technologie."
            },
            {
              name: "Classes Préparatoires Scientifiques (MPSI)",
              compatibility: 88,
              rationale: "Votre niveau en mathématiques et sciences vous permet d'envisager les grandes écoles."
            },
            {
              name: "Licence en Mathématiques",
              compatibility: 85,
              rationale: "Profil mathématique solide adapté aux études supérieures scientifiques."
            },
            {
              name: "Licence en Physique-Chimie",
              compatibility: 80,
              rationale: "Bon équilibre entre théorie et pratique correspondant à vos aptitudes."
            }
          ]
        },
        {
          groupType: "domaine_suggere",
          groupTitle: "Domaines Suggérés",
          isBlurred: true,
          suggestions: [
            {
              name: "Contenu flouté - Inscrivez votre établissement",
              compatibility: "XX", 
              rationale: "Contenu disponible après inscription"
            },
            {
              name: "Contenu flouté - Inscrivez votre établissement",
              compatibility: "XX",
              rationale: "Contenu disponible après inscription" 
            }
          ]
        },
        {
          groupType: "metier_potentiel",
          groupTitle: "Métiers Potentiels",
          isBlurred: true,
          suggestions: [
            {
              name: "Contenu flouté - Inscrivez votre établissement",
              compatibility: "XX",
              rationale: "Contenu disponible après inscription"
            },
            {
              name: "Contenu flouté - Inscrivez votre établissement", 
              compatibility: "XX",
              rationale: "Contenu disponible après inscription"
            }
          ]
        }
      ]
    };
  }
}