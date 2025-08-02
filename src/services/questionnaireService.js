export class QuestionnaireService {
  // Questions pour affiner les recommandations (30 questions au total)
  static QUESTIONNAIRE_QUESTIONS = {
    academic: [
      {
        id: 'languages_level',
        question: 'Comment évaluez-vous votre niveau en langues étrangères ?',
        type: 'scale',
        scale: { min: 1, max: 10, labels: ['Très faible', 'Excellent'] },
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
      },
      {
        id: 'study_duration_preference',
        question: 'Quel type d\'études préférez-vous ?',
        type: 'select',
        options: [
          'Études longues (5+ ans) pour une spécialisation poussée',
          'Études courtes (2-3 ans) orientées professionnelles',
          'Formation mixte (théorie + stage en entreprise)',
          'Pas de préférence particulière'
        ],
        badge: 'academic'
      },
      {
        id: 'research_vs_practical',
        question: 'Vous vous voyez plutôt dans :',
        type: 'scale',
        scale: { min: 1, max: 10, labels: ['Métier très pratique', 'Recherche théorique'] },
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
      },
      {
        id: 'work_life_balance',
        question: 'L\'équilibre vie professionnelle/vie privée est-il important pour vous ?',
        type: 'scale',
        scale: { min: 1, max: 10, labels: ['Pas important', 'Essentiel'] },
        badge: 'aspiration'
      },
      {
        id: 'international_career',
        question: 'Souhaitez-vous travailler à l\'international ?',
        type: 'scale',
        scale: { min: 1, max: 10, labels: ['Rester à Madagascar', 'Partir à l\'étranger'] },
        badge: 'aspiration'
      },
      {
        id: 'entrepreneurship',
        question: 'Vous voyez-vous créer votre propre entreprise ?',
        type: 'scale',
        scale: { min: 1, max: 10, labels: ['Jamais', 'Certainement'] },
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
   * Retourne toutes les questions dans l'ordre (academic, personal, logic)
   */
  static getAllQuestions() {
    return [
      ...this.QUESTIONNAIRE_QUESTIONS.academic,
      ...this.QUESTIONNAIRE_QUESTIONS.personal,
      ...this.QUESTIONNAIRE_QUESTIONS.logic
    ];
  }

  /**
   * Construit la section questionnaire pour le prompt
   */
  static buildQuestionnaireSection(responses) {
    const academicResponses = responses.filter(r => 
      this.QUESTIONNAIRE_QUESTIONS.academic.find(q => q.id === r.questionId)
    );
    const personalResponses = responses.filter(r => 
      this.QUESTIONNAIRE_QUESTIONS.personal.find(q => q.id === r.questionId)
    );
    const logicResponses = responses.filter(r => 
      this.QUESTIONNAIRE_QUESTIONS.logic.find(q => q.id === r.questionId)
    );

    let section = `\n## DETAILED QUESTIONNAIRE RESPONSES (${responses.length} responses)\n\n`;

    section += `### Academic Preferences (${academicResponses.length} responses):\n`;
    academicResponses.forEach(response => {
      const question = this.QUESTIONNAIRE_QUESTIONS.academic.find(q => q.id === response.questionId);
      section += `- ${question.question}: ${response.answer}\n`;
    });

    section += `\n### Personal Aspirations (${personalResponses.length} responses):\n`;
    personalResponses.forEach(response => {
      const question = this.QUESTIONNAIRE_QUESTIONS.personal.find(q => q.id === response.questionId);
      section += `- ${question.question}: ${response.answer}\n`;
    });

    section += `\n### Logic & Reasoning (${logicResponses.length} responses):\n`;
    logicResponses.forEach(response => {
      const question = this.QUESTIONNAIRE_QUESTIONS.logic.find(q => q.id === response.questionId);
      section += `- ${question.question}: ${response.answer}\n`;
    });

    return section;
  }
}