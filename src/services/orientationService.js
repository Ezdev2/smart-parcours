export class OrientationService {
  // static OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'
  // static DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
  static GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

  // static DEEPSEEK_MODEL = 'deepseek-chat';
  // static MISTRAL_MODEL = 'mixtral-8x7b-32768';
  static GROQ_MODEL = 'llama-3.3-70b-versatile';
  static MAX_WEEKLY_RECOMMENDATIONS = 10;

  static ACADEMIC_PROFILES = [
    "Scientifique", "Littéraire", "Artistique", "Technique",
    "Économique et Social", "Sportif", "Linguistique",
    "Informatique", "Logique", "Créatif"
  ];

  /**
   * Construit le prompt pour l'IA en incluant toutes les informations détaillées.
   * (Aucun changement dans cette fonction, car elle construit le prompt, pas la requête API)
   */
  static buildPromptFromProfile(user, bulletins, age) {
    const profile = user.profile;
    let prompt = `En tant que conseiller d'orientation expérimenté et expert en analyse de profil, vous allez analyser le profil d'un lycéen malgache et lui fournir des recommandations détaillées et structurées pour son orientation post-baccalauréat.`;
    prompt += `L'analyse doit être objective, bienveillante et pertinente.`;
    prompt += `\n\n--- INFORMATIONS DE L'ÉTUDIANT ---\n`;
    prompt += `Nom de l'étudiant: ${profile.firstName} ${profile.lastName}\n`;
    prompt += `Âge: ${age} ans\n`;
    prompt += `Niveau scolaire actuel: ${profile.level}\n`;
    prompt += `Classe actuelle: ${profile.classDisplayName || profile.class}\n`;
    prompt += `Moyenne générale actuelle: ${profile.averageGrade || 'non renseignée'}/20\n\n`;

    if (profile.filieres && profile.filieres.length > 0) {
      prompt += `Filières d'intérêt exprimées: ${profile.filieres.join(', ')}\n`;
    }
    if (profile.interests && profile.interests.length > 0) {
      prompt += `Centres d'intérêt personnels: ${profile.interests.join(', ')}\n\n`;
    }

    if (bulletins && bulletins.length > 0) {
      prompt += `--- RÉSULTATS SCOLAIRES DÉTAILLÉS (TOUS BULLETINS DISPONIBLES) ---\n`;
      bulletins.forEach((bulletin, bIndex) => {
        prompt += `Bulletin ${bulletin.semester} (${bulletin.year}), Classe: ${bulletin.classDisplayName || bulletin.classId}, Moyenne: ${bulletin.generalAverage || 'N/A'}/20, Commentaire Général: "${bulletin.generalComment || 'Aucun'}"\n`;
        prompt += `Matières:\n`;
        (bulletin.subjects || []).forEach(subject => {
          prompt += `- ${subject.name} (Coeff: ${subject.coefficient || 'N/A'}): Note ${subject.grade}/20, Appréciation: "${subject.comment || 'Aucune'}"\n`;
        });
        prompt += `\n`;
      });
    } else {
      prompt += `Aucun bulletin scolaire détaillé disponible.\n\n`;
    }

    prompt += `--- CONSIGNES POUR LA RÉPONSE DE L'IA ---\n`;
    prompt += `Votre réponse DOIT être un OBJET JSON valide.\n`;
    prompt += `Réponds uniquement avec un JSON brut.\n`;
    prompt += `Ne mets AUCUN texte explicatif, commentaire, balise, ou bloc de code (comme \`\`\`json).\n`;
    prompt += `Commence directement par { et termine par }.\n`;
    prompt += `Le format attendu est exactement comme suit (structure exemple, pas à reproduire littéralement) :\n`;
    prompt += `{\n`;
    prompt += `  "title": "Titre de la recommandation (ex: Recommandations Personnalisées Post-Bac)",\n`;
    prompt += `  "content": "Résumé concis et bienveillant de l'analyse du profil, avec plus de details sur son profil académique, concret et précis",\n`;
    prompt += `  "type": "orientation", // Type de recommandation: 'orientation' (pour l'instant)\n`;
    prompt += `  "priority": "high", // 'low', 'medium', 'high' en fonction de l'urgence de l'orientation\n`;
    prompt += `  "status": "pending", // Toujours 'pending' à la génération initiale\n`;
    prompt += `  "generatedBy": "system", // Toujours 'system'\n`;
    prompt += `  "strengths": ["Point fort 1", "Point fort 2", "Point fort 3", "Point fort 4"], // Liste de 4 points forts minimum\n`;
    prompt += `  "improvementAreas": ["Axe amélioration 1", "Axe amélioration 2", "Axe amélioration 3"], // Liste de 3 axes d'amélioration minimum\n`;
    prompt += `  "academicProfile": { "title": "Artistique (un profile pour chaque etudiant mais pas Scientifique et Artistique, prends celui qui colle le mieux au profil et personnalité)", "code": "profil_code" }, // Choisir un profil parmi: ${OrientationService.ACADEMIC_PROFILES.map(p => `"${p}"`).join(', ')}. Le code doit être en minuscules, sans espaces ni accents (ex: "scientifique" -> "scientific").\n`;
    prompt += `  "suggestedPaths": [\n`;
    prompt += `    {\n`;
    prompt += `      "groupType": "filiere_recommandee",\n`;
    prompt += `      "groupTitle": "Filières Recommandées",\n`;
    prompt += `      "suggestions": [\n`;
    prompt += `        { "name": "Nom Filière 1", "compatibility": X, "rationale": "Justification pour Filière 1." }, // X est un pourcentage de compatibilité (0-100), le filière universitaire proposé doit être précis et en accord avec la liste des filières universitaires disponible à Madagascar et à l'internationnal (il faut preciser si la filière est mieux si faites à l'extérieur surtout pour les étudiants ayant les meilleurs moyennes générale) qui sont plutôt orientés métier (tels que Année préparatoire en Médecine (PACES), Licence en Science de l'environnement, Licence professionnel en Tourisme et Hotêlerie, Droit, etc., ce ne sont que des exemples pas à prendre litteralement) \n`;
    prompt += `        { "name": "Nom Filière 2", "compatibility": Y, "rationale": "Justification pour Filière 2." },\n`;
    prompt += `        { "name": "Nom Filière 3", "compatibility": Z, "rationale": "Justification pour Filière 3." } // 3 filières minimum, proposer 5 filières si possible, les notes sont les facteurs le plus importants à considerer pour la propositions de filière, mais les intérêt personnels sont à étudier par rapport à ses notes (Considérations de note 50%, considérations des centres d'intérêts personnels 35%, considération des filères d'interêts 15%). Les suggestions DOIVENT ÊTRE TRIÉES par compatibilité décroissante.\n`;
    prompt += `      ]\n`;
    prompt += `    },\n`;
    prompt += `    {\n`;
    prompt += `      "groupType": "domaine_suggere",\n`;
    prompt += `      "groupTitle": "Domaines Suggérés",\n`;
    prompt += `      "suggestions": [\n`;
    prompt += `        { "name": "Nom Domaine 1", "compatibility": A, "rationale": "Justification pour Domaine 1." }, // 2 domaines minimum, proposer 3 domaines si possible. Les suggestions DOIVENT ÊTRE TRIÉES par compatibilité décroissante.\n`;
    prompt += `        { "name": "Nom Domaine 2", "compatibility": B, "rationale": "Justification pour Domaine 2." }\n`;
    prompt += `      ]\n`;
    prompt += `    },\n`;
    prompt += `    {\n`;
    prompt += `      "groupType": "metier_potentiel",\n`;
    prompt += `      "groupTitle": "Métiers Potentiels",\n`;
    prompt += `      "suggestions": [\n`;
    prompt += `        { "name": "Nom Métier 1", "compatibility": C, "rationale": "Justification pour Métier 1." }, // 6 métiers minimum proposer 10 métiers plus ambitionnants pour les étudiants à moyenne générale plus haut et des métiers qui correspond à la capacité intellectuelle de l'étudiant si ce dernier a une moyenne basse. Les suggestions DOIVENT ÊTRE TRIÉES par compatibilité décroissante.\n`;
    prompt += `        { "name": "Nom Métier 2", "compatibility": D, "rationale": "Justification pour Métier 2." },\n`;
    prompt += `        { "name": "Nom Métier 3", "compatibility": E, "rationale": "Justification pour Métier 3." },\n`;
    prompt += `        { "name": "Nom Métier 4", "compatibility": F, "rationale": "Justification pour Métier 4." },\n`;
    prompt += `        { "name": "Nom Métier 5", "compatibility": G, "rationale": "Justification pour Métier 5." },\n`;
    prompt += `        { "name": "Nom Métier 6", "compatibility": H, "rationale": "Justification pour Métier 6." }\n`;
    prompt += `      ]\n`;
    prompt += `    }\n`;
    prompt += `  ]\n`;
    prompt += `}\n`;
    prompt += `Ne mettez AUCUN texte avant ou après le JSON. Seul l'objet JSON est attendu.`
    prompt += `Assurez-vous que les pourcentages de compatibilité sont des nombres ENTIERS entre 0 et 100.\n`;
    prompt += `Assurez-vous que les titres des champs dans le JSON sont en anglais (strengths, improvementAreas, suggestedPaths, groupType, groupTitle, suggestions, name, compatibility, rationale, type, title, content, priority, status, generatedBy, academicProfile, code).\n`;

    return prompt;
  }

  /**
   * Génère des recommandations via l'API DeepSeek directement.
   * @param {string} prompt - Le prompt à envoyer à l'IA.
   * @returns {Object} La réponse de l'IA parsée en objet JSON.
   */
  static async generateRecommendations(prompt) {
    try {
      const apiKey = import.meta.env.VITE_GROQ_API_KEY;

      if (!apiKey) {
        console.warn('No DeepSeek API key found. Using mock recommendations.');
        return this.getMockRecommendations();
      }

      const response = await fetch(this.GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: this.GROQ_MODEL,
          messages: [
            // {
            //   role: 'system',
            //   content: 'Vous êtes un conseiller d\'orientation expérimenté spécialisé dans l\'analyse de profils étudiants. Votre rôle est de fournir des recommandations personnalisées basées sur les résultats scolaires, les intérêts et le profil de l\'étudiant. Vous répondez UNIQUEMENT avec un OBJET JSON valide, sans préface ni texte additionnel.'
            // },
            {
              role: 'user',
              content: prompt
            }
          ],
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error:', errorData);
        throw new Error(`API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const aiResponse = data.choices?.[0]?.message?.content;

      if (!aiResponse) {
        throw new Error('No content in AI response.');
      }

      let parsedResponse;
      try {
        parsedResponse = JSON.parse(aiResponse);
      } catch (jsonError) {
        console.error('Failed to parse AI response as JSON:', jsonError);
        console.error('Raw AI response:', aiResponse);
        throw new Error('AI response was not valid JSON. Please try again.');
      }

      this.validateRecommendationStructure(parsedResponse);

      return parsedResponse;

    } catch (error) {
      console.error('Error generating recommendations:', error);
      return this.getMockRecommendations();
    }
  }

  /**
   * Valide la structure de la réponse de l'IA.
   * (Reste inchangé, car la structure de validation est indépendante de l'API utilisée)
   */
  static validateRecommendationStructure(response) {
    console.log("Validating AI response:", response);

    const requiredTopLevelFields = ['title', 'content', 'type', 'priority', 'status', 'generatedBy', 'strengths', 'improvementAreas', 'suggestedPaths', 'academicProfile'];
    const requiredSuggestedPathGroupFields = ['groupType', 'groupTitle', 'suggestions'];
    const requiredSuggestedPathSuggestionFields = ['name', 'compatibility', 'rationale'];

    for (const field of requiredTopLevelFields) {
      if (!(field in response)) {
        throw new Error(`AI response missing top-level field: ${field}`);
      }
    }

    if (typeof response.academicProfile !== 'object' || response.academicProfile === null ||
        !('title' in response.academicProfile) || !('code' in response.academicProfile)) {
        throw new Error(`AI response academicProfile is invalid or missing title/code.`);
    }
    const expectedCodeFromTitle = response.academicProfile.title.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (response.academicProfile.code !== expectedCodeFromTitle) {
        console.warn(`AI suggested academicProfile code "${response.academicProfile.code}" does not match the expected code derived from its title "${expectedCodeFromTitle}". Forcing code to match title.`);
        response.academicProfile.code = expectedCodeFromTitle;
    }
    if (!this.ACADEMIC_PROFILES.includes(response.academicProfile.title)) {
        console.warn(`AI suggested academicProfile title "${response.academicProfile.title}" is not in the predefined list. Ensure your prompt includes the list of allowed titles.`);
    }

    if (!Array.isArray(response.strengths) || response.strengths.length < 4) {
      throw new Error(`AI response strengths array invalid or less than 4 items.`);
    }
    if (!Array.isArray(response.improvementAreas) || response.improvementAreas.length < 3) {
      throw new Error(`AI response improvementAreas array invalid or less than 3 items.`);
    }

    if (!Array.isArray(response.suggestedPaths)) {
      throw new Error(`AI response suggestedPaths is not an array.`);
    }

    let filiereCount = 0;
    let domaineCount = 0;
    let metierCount = 0;

    response.suggestedPaths.forEach(group => {
      for (const field of requiredSuggestedPathGroupFields) {
        if (!(field in group)) {
          throw new Error(`Suggested path group missing field: ${field}`);
        }
      }
      if (!Array.isArray(group.suggestions)) {
        throw new Error(`Suggested path group suggestions is not an array.`);
      }

      for (let i = 0; i < group.suggestions.length; i++) {
        const suggestion = group.suggestions[i];
        for (const field of requiredSuggestedPathSuggestionFields) {
          if (!(field in suggestion)) {
            throw new Error(`Suggested path suggestion missing field: ${field} in group ${group.groupTitle}, item ${i}.`);
          }
        }
        if (typeof suggestion.compatibility !== 'number' || suggestion.compatibility < 0 || suggestion.compatibility > 100 || !Number.isInteger(suggestion.compatibility)) {
          const parsedComp = parseInt(suggestion.compatibility);
          if (!isNaN(parsedComp) && parsedComp >= 0 && parsedComp <= 100) {
              console.warn(`AI suggested compatibility "${suggestion.compatibility}" for ${suggestion.name} is not an integer number between 0-100. Converting to ${parsedComp}.`);
              suggestion.compatibility = parsedComp;
          } else {
              throw new Error(`Suggested path suggestion compatibility for ${suggestion.name} is not a valid integer number between 0-100.`);
          }
        }
        if (i < group.suggestions.length - 1 && suggestion.compatibility < group.suggestions[i+1].compatibility) {
          console.warn(`Suggestions in group '${group.groupTitle}' are not sorted by compatibility in descending order. Sorting now.`);
          group.suggestions.sort((a,b) => b.compatibility - a.compatibility);
        }
      }

      if (group.groupType === 'filiere_recommandee') {
        filiereCount += group.suggestions.length;
      } else if (group.groupType === 'domaine_suggere') {
        domaineCount += group.suggestions.length;
      } else if (group.groupType === 'metier_potentiel') {
        metierCount += group.suggestions.length;
      }
    });

    if (filiereCount < 3) throw new Error(`AI response missing at least 3 'filiere_recommandee'.`);
    if (domaineCount < 2) throw new Error(`AI response missing at least 2 'domaine_suggere'.`);
    if (metierCount < 6) throw new Error(`AI response missing at least 6 'metier_potentiel'.`);

    console.log("AI response structure validated successfully.");
  }


  /**
   * Retourne des données de recommandation mock pour les tests ou les erreurs API.
   * (Reste inchangé, car le mock doit toujours correspondre à la structure finale)
   */
  static getMockRecommendations() {
    return {
      title: "Recommandations Mock (Simulation IA)",
      content: "Ceci est une analyse simulée du profil de l'étudiant, utilisée car l'API n'est pas disponible ou la clé API est manquante. Les aptitudes en sciences et mathématiques sont très bonnes.",
      type: "orientation",
      priority: "high",
      status: "pending",
      generatedBy: "mock_system",
      strengths: [
        "Excellence en mathématiques (mock)",
        "Capacité d'analyse et de résolution de problèmes (mock)",
        "Intérêt marqué pour la recherche et l'innovation (mock)",
        "Rigueur scientifique (mock)",
        "Autonomie dans l'apprentissage (mock)"
      ],
      improvementAreas: [
        "Développer les compétences en communication orale (mock)",
        "Renforcer les langues étrangères (mock)",
        "Élargir la culture générale (mock)"
      ],
      academicProfile: {
        title: "Scientifique",
        code: "scientific"
      },
      suggestedPaths: [
        {
          groupType: "filiere_recommandee",
          groupTitle: "Filières Recommandées (Mock)",
          suggestions: [
            { name: "Licence Informatique (Data Science)", compatibility: 95, rationale: "Très bons résultats en maths et intérêt IA." },
            { name: "Cycle préparatoire MP2I", compatibility: 85, rationale: "Profil scientifique solide." },
            { name: "Licence Sciences de l'ingénieur", compatibility: 78, rationale: "Polyvalence technique." }
          ]
        },
        {
          groupType: "domaine_suggere",
          groupTitle: "Domaines Suggérés (Mock)",
          suggestions: [
            { name: "Ingénierie Logicielle", compatibility: 90, rationale: "Goût pour le code et la résolution de problèmes." },
            { name: "Recherche en Physique", compatibility: 75, rationale: "Curiosité scientifique et aptitudes théoriques." }
          ]
        },
        {
          groupType: "metier_potentiel",
          groupTitle: "Métiers Potentiels (Mock)",
          suggestions: [
            { name: "Développeur Full-Stack", compatibility: 92, rationale: "Demande du marché et créativité." },
            { name: "Data Scientist", compatibility: 88, rationale: "Analyse de données et statistiques." },
            { name: "Ingénieur R&D", compatibility: 80, rationale: "Innovation et résolution de problèmes complexes." },
            { name: "Consultant IT", compatibility: 70, rationale: "Technique et relationnel." },
            { name: "Architecte Logiciel", compatibility: 85, rationale: "Conception de systèmes." },
            { name: "Analyste Cybersécurité", compatibility: 78, rationale: "Protection des systèmes." }
          ]
        }
      ]
    };
  }
}