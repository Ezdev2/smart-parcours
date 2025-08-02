import { QuestionnaireService } from './questionnaireService';

export class OrientationService {
  static GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
  static GROQ_MODEL = "llama-3.3-70b-versatile";
  static MAX_WEEKLY_RECOMMENDATIONS = 10;

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

  /**
   * Construit le prompt optimisé en anglais pour l'IA avec support questionnaire
   */
  static buildPromptFromProfile(user, bulletins, age, questionnaireResponses = null) {
    const profile = user.profile;

    let prompt = `# Academic Orientation Analysis Prompt

You are an experienced academic counselor and profile analysis expert. You will analyze a Malagasy high school student's profile and provide detailed, structured recommendations for their post-baccalaureate orientation. The analysis must be objective, supportive, and relevant.

## STUDENT INFORMATION
**Student Name:** ${profile.firstName} ${profile.lastName}
**Age:** ${age} years
**Current Academic Level:** ${profile.level}
**Current Class:** ${profile.classDisplayName || profile.class}
**Current Overall Average:** ${profile.averageGrade || "not provided"}/20

`;

    if (profile.filieres && profile.filieres.length > 0) {
      prompt += `**Expressed Fields of Interest:** ${profile.filieres.join(
        ", "
      )}\n`;
    }
    if (profile.interests && profile.interests.length > 0) {
      prompt += `**Personal Interests:** ${profile.interests.join(", ")}\n\n`;
    }

    if (bulletins && bulletins.length > 0) {
      prompt += `## DETAILED ACADEMIC RESULTS (ALL AVAILABLE TRANSCRIPTS)\n\n`;
      bulletins.forEach((bulletin, bIndex) => {
        prompt += `### Transcript - ${bulletin.semester} (${bulletin.year})
**Class:** ${bulletin.classDisplayName || bulletin.classId}
**Average:** ${bulletin.generalAverage || "N/A"}/20
**General Comment:** "${bulletin.generalComment || "None"}"

**Subjects:**
`;
        (bulletin.subjects || []).forEach((subject) => {
          prompt += `- ${subject.name} (Coeff: ${
            subject.coefficient || "N/A"
          }): ${subject.grade}/20 - "${subject.comment || "No comment"}"\n`;
        });
        prompt += `\n`;
      });
    } else {
      prompt += `## ACADEMIC RESULTS\nNo detailed academic transcripts available.\n\n`;
    }

    // Add questionnaire responses if provided
    if (questionnaireResponses && questionnaireResponses.length > 0) {
      prompt += QuestionnaireService.buildQuestionnaireSection(questionnaireResponses);
      prompt += `\n**IMPORTANT:** The questionnaire responses above provide crucial insights into the student's preferences, aspirations, and learning style. Please give significant weight to these responses (40% weight) in your analysis alongside academic performance (50%) and expressed interests (10%).\n\n`;
    }

    const hasQuestionnaire = questionnaireResponses && questionnaireResponses.length > 0;

    prompt += `---

## RESPONSE REQUIREMENTS

Your response MUST be a valid JSON object.
Respond ONLY with raw JSON.
Do NOT include any explanatory text, comments, tags, or code blocks (like \`\`\`json).
Start directly with { and end with }.

### Evaluation Criteria (Weighting):
${hasQuestionnaire ? 
  `- **Academic Performance (50%):** Grades, trends, subject strengths
- **Questionnaire Responses (40%):** Personal preferences, aspirations, learning style, career goals
- **Expressed Field Interests (10%):** Stated preferences and motivations` :
  `- **Academic Performance (50%):** Grades, trends, subject strengths
- **Personal Interests (35%):** Alignment with career paths and aptitudes
- **Expressed Field Interests (15%):** Stated preferences and motivations`
}

### Required JSON Structure:

{
  "title": "Recommendation title (e.g., Personalized Post-Bac Recommendations)",
  "content": "Concise and supportive analysis summary with detailed academic profile insights, concrete and precise starting with the summary of the student's information (name, class, overall average, age)${hasQuestionnaire ? ', and highlighting key insights from the questionnaire responses' : ''}. Ex : Ezra Fanomezantsoa show...",
  "type": "orientation",
  "priority": "high",
  "status": "pending", 
  "generatedBy": "system",
  "strengths": ["Strength 1", "Strength 2", "Strength 3", "Strength 4"],
  "improvementAreas": ["Improvement area 1", "Improvement area 2", "Improvement area 3"],
  "academicProfile": {
    "title": "Profile Name (choose ONE that best fits: ${OrientationService.ACADEMIC_PROFILES.join(
      ", "
    )})",
    "code": "profile_code_in_lowercase_no_spaces_no_accents"
  },
  "suggestedPaths": [
    {
      "groupType": "filiere_recommandee",
      "groupTitle": "Filières Recommandées",
      "suggestions": [
        {
          "name": "Specific Program Name in French",
          "compatibility": 85,
          "rationale": "Detailed justification in French based on academic performance and interests."
        }
      ]
    },
    {
      "groupType": "domaine_suggere", 
      "groupTitle": "Domaines Suggérés",
      "suggestions": [
        {
          "name": "Field Name in French",
          "compatibility": 80,
          "rationale": "Justification in French for field alignment."
        }
      ]
    },
    {
      "groupType": "metier_potentiel",
      "groupTitle": "Métiers Potentiels", 
      "suggestions": [
        {
          "name": "Career Name in French",
          "compatibility": 90,
          "rationale": "Career justification in French based on profile analysis."
        }
      ]
    }
  ]
}

### Specific Requirements:

1. **Academic Programs (filiere_recommandee):** 
   - Suggest 4-6 specific university programs available in Madagascar or internationally
   - For high-performing students (15+ average), specify if better pursued abroad
   - Include precise program names like "PACES (Première Année Commune aux Études de Santé)", "Licence en Sciences de l'Environnement", "Licence Professionnelle en Tourisme et Hôtellerie", "Droit", etc.
   - Content must be in French

2. **Fields (domaine_suggere):** 
   - Suggest 2-3 broad academic/professional domains
   - Content must be in French

3. **Careers (metier_potentiel):** 
   - Suggest 8-10 careers minimum
   - For high-achieving students (15+ average), include ambitious career paths
   - For lower averages, suggest careers matching intellectual capacity
   - Content must be in French

4. **Compatibility Scores:** 
   - Must be integers between 0-100
   - Must be sorted in descending order within each group

5. **Profile Code:** 
   - Use lowercase, no spaces or accents (e.g., "scientifique", "artistique", "linguistique")

6. **Language:** 
   - All content (names, rationales, titles) should be in French to match the Malagasy educational context
   - JSON keys remain in English as specified

${hasQuestionnaire ? 
  `7. **Questionnaire Integration:** 
   - Use questionnaire responses to refine recommendations and better match student preferences
   - Highlight in rationales how specific answers influenced the suggestions
   - Ensure academic profile selection considers both academic results and questionnaire responses` : 
  ''
}

**CRITICAL:** Return ONLY the JSON object. No additional text before or after. Ensure all compatibility scores are integers 0-100 and suggestions are sorted by compatibility in descending order${hasQuestionnaire ? '. Pay special attention to questionnaire responses for more personalized recommendations.' : ''}`;

    return prompt;
  }

  /**
   * Génère des recommandations via l'API GROQ avec le prompt optimisé
   */
  static async generateRecommendations(prompt) {
    try {
      const apiKey = import.meta.env.VITE_GROQ_API_KEY;

      if (!apiKey) {
        console.warn("No GROQ API key found. Using mock recommendations.");
        return this.getMockRecommendations();
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
              content:
                "You are an experienced academic counselor specialized in analyzing student profiles for Malagasy students. Your role is to provide personalized recommendations based on academic results, interests, and student profile. You respond ONLY with a valid JSON object, without preface or additional text. All content should be in French while maintaining English JSON keys.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 4000,
          top_p: 0.9,
          stream: false,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API Error:", errorData);
        throw new Error(
          `API Error: ${response.status} - ${
            errorData.error?.message || "Unknown error"
          }`
        );
      }

      const data = await response.json();
      const aiResponse = data.choices?.[0]?.message?.content;

      if (!aiResponse) {
        throw new Error("No content in AI response.");
      }

      // Clean the response to ensure it's pure JSON
      let cleanedResponse = aiResponse.trim();

      // Remove any potential markdown code blocks
      if (cleanedResponse.startsWith("```json")) {
        cleanedResponse = cleanedResponse
          .replace(/^```json\s*/, "")
          .replace(/\s*```$/, "");
      } else if (cleanedResponse.startsWith("```")) {
        cleanedResponse = cleanedResponse
          .replace(/^```\s*/, "")
          .replace(/\s*```$/, "");
      }

      let parsedResponse;
      try {
        parsedResponse = JSON.parse(cleanedResponse);
      } catch (jsonError) {
        console.error("Failed to parse AI response as JSON:", jsonError);
        console.error("Raw AI response:", aiResponse);
        console.error("Cleaned response:", cleanedResponse);

        // Try to extract JSON from the response
        const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            parsedResponse = JSON.parse(jsonMatch[0]);
          } catch (secondJsonError) {
            throw new Error(
              "AI response was not valid JSON. Please try again."
            );
          }
        } else {
          throw new Error("No JSON object found in AI response.");
        }
      }

      this.validateRecommendationStructure(parsedResponse);
      return parsedResponse;
    } catch (error) {
      console.error("Error generating recommendations:", error);
      return this.getMockRecommendations();
    }
  }

  /**
   * Valide la structure de la réponse de l'IA
   */
  static validateRecommendationStructure(response) {
    console.log("Validating AI response:", response);

    const requiredTopLevelFields = [
      "title",
      "content",
      "type",
      "priority",
      "status",
      "generatedBy",
      "strengths",
      "improvementAreas",
      "suggestedPaths",
      "academicProfile",
    ];
    const requiredSuggestedPathGroupFields = [
      "groupType",
      "groupTitle",
      "suggestions",
    ];
    const requiredSuggestedPathSuggestionFields = [
      "name",
      "compatibility",
      "rationale",
    ];

    // Validate top-level fields
    for (const field of requiredTopLevelFields) {
      if (!(field in response)) {
        throw new Error(`AI response missing top-level field: ${field}`);
      }
    }

    // Validate academicProfile
    if (
      typeof response.academicProfile !== "object" ||
      response.academicProfile === null ||
      !("title" in response.academicProfile) ||
      !("code" in response.academicProfile)
    ) {
      throw new Error(
        `AI response academicProfile is invalid or missing title/code.`
      );
    }

    // Generate expected code from title
    const expectedCodeFromTitle = response.academicProfile.title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove accents
      .replace(/[^a-z0-9]/g, ""); // Remove spaces and special chars

    if (response.academicProfile.code !== expectedCodeFromTitle) {
      console.warn(
        `AI suggested academicProfile code "${response.academicProfile.code}" does not match the expected code derived from its title "${expectedCodeFromTitle}". Correcting code to match title.`
      );
      response.academicProfile.code = expectedCodeFromTitle;
    }

    if (!this.ACADEMIC_PROFILES.includes(response.academicProfile.title)) {
      console.warn(
        `AI suggested academicProfile title "${response.academicProfile.title}" is not in the predefined list.`
      );
    }

    // Validate arrays
    if (!Array.isArray(response.strengths) || response.strengths.length < 4) {
      throw new Error(
        `AI response strengths array invalid or less than 4 items.`
      );
    }
    if (
      !Array.isArray(response.improvementAreas) ||
      response.improvementAreas.length < 3
    ) {
      throw new Error(
        `AI response improvementAreas array invalid or less than 3 items.`
      );
    }

    if (!Array.isArray(response.suggestedPaths)) {
      throw new Error(`AI response suggestedPaths is not an array.`);
    }

    // Count suggestions by type
    let filiereCount = 0;
    let domaineCount = 0;
    let metierCount = 0;

    response.suggestedPaths.forEach((group) => {
      // Validate group structure
      for (const field of requiredSuggestedPathGroupFields) {
        if (!(field in group)) {
          throw new Error(`Suggested path group missing field: ${field}`);
        }
      }
      if (!Array.isArray(group.suggestions)) {
        throw new Error(`Suggested path group suggestions is not an array.`);
      }

      // Validate suggestions
      for (let i = 0; i < group.suggestions.length; i++) {
        const suggestion = group.suggestions[i];
        for (const field of requiredSuggestedPathSuggestionFields) {
          if (!(field in suggestion)) {
            throw new Error(
              `Suggested path suggestion missing field: ${field} in group ${group.groupTitle}, item ${i}.`
            );
          }
        }

        // Validate and fix compatibility scores
        if (
          typeof suggestion.compatibility !== "number" ||
          suggestion.compatibility < 0 ||
          suggestion.compatibility > 100 ||
          !Number.isInteger(suggestion.compatibility)
        ) {
          const parsedComp = parseInt(suggestion.compatibility);
          if (!isNaN(parsedComp) && parsedComp >= 0 && parsedComp <= 100) {
            console.warn(
              `AI suggested compatibility "${suggestion.compatibility}" for ${suggestion.name} is not an integer number between 0-100. Converting to ${parsedComp}.`
            );
            suggestion.compatibility = parsedComp;
          } else {
            throw new Error(
              `Suggested path suggestion compatibility for ${suggestion.name} is not a valid integer number between 0-100.`
            );
          }
        }
      }

      // Sort suggestions by compatibility (descending)
      group.suggestions.sort((a, b) => b.compatibility - a.compatibility);

      // Count suggestions by type
      if (group.groupType === "filiere_recommandee") {
        filiereCount += group.suggestions.length;
      } else if (group.groupType === "domaine_suggere") {
        domaineCount += group.suggestions.length;
      } else if (group.groupType === "metier_potentiel") {
        metierCount += group.suggestions.length;
      }
    });

    // Validate minimum counts
    if (filiereCount < 3)
      throw new Error(`AI response missing at least 3 'filiere_recommandee'.`);
    if (domaineCount < 2)
      throw new Error(`AI response missing at least 2 'domaine_suggere'.`);
    if (metierCount < 6)
      throw new Error(`AI response missing at least 6 'metier_potentiel'.`);

    console.log("AI response structure validated successfully.");
  }

  /**
   * Retourne des données de recommandation mock pour les tests ou les erreurs API
   */
  static getMockRecommendations() {
    return {
      title: "Recommandations Personnalisées Post-Bac (Simulation)",
      content:
        "Ceci est une analyse simulée du profil de l'étudiant, utilisée car l'API n'est pas disponible ou la clé API est manquante. L'étudiant présente un profil équilibré avec de bonnes aptitudes en sciences et en langues.",
      type: "orientation",
      priority: "high",
      status: "pending",
      generatedBy: "mock_system",
      strengths: [
        "Excellence en mathématiques et sciences",
        "Très bon niveau en langues étrangères",
        "Capacité d'analyse et de résolution de problèmes",
        "Intérêt marqué pour la recherche et l'innovation",
        "Autonomie dans l'apprentissage",
      ],
      improvementAreas: [
        "Développer les compétences en communication orale",
        "Renforcer la culture générale en sciences humaines",
        "Améliorer la gestion du temps et l'organisation",
      ],
      academicProfile: {
        title: "Scientifique",
        code: "scientifique",
      },
      suggestedPaths: [
        {
          groupType: "filiere_recommandee",
          groupTitle: "Filières Recommandées",
          suggestions: [
            {
              name: "PACES - Première Année Commune aux Études de Santé",
              compatibility: 95,
              rationale:
                "Excellent niveau en sciences et mathématiques, profil adapté aux études médicales exigeantes.",
            },
            {
              name: "Licence en Informatique et Sciences du Numérique",
              compatibility: 90,
              rationale:
                "Très bonnes aptitudes logiques et mathématiques, secteur en forte croissance à Madagascar.",
            },
            {
              name: "Classes Préparatoires aux Grandes Écoles (MPSI)",
              compatibility: 85,
              rationale:
                "Profil scientifique solide permettant de viser les meilleures écoles d'ingénieurs.",
            },
            {
              name: "Licence en Sciences de l'Ingénieur",
              compatibility: 80,
              rationale:
                "Polyvalence technique et scientifique adaptée aux défis industriels.",
            },
          ],
        },
        {
          groupType: "domaine_suggere",
          groupTitle: "Domaines Suggérés",
          suggestions: [
            {
              name: "Sciences et Technologies",
              compatibility: 92,
              rationale:
                "Domaine en parfaite adéquation avec les excellents résultats scientifiques.",
            },
            {
              name: "Santé et Médecine",
              compatibility: 88,
              rationale:
                "Profil rigoureux et scientifique adapté aux exigences médicales.",
            },
            {
              name: "Ingénierie et Innovation",
              compatibility: 85,
              rationale:
                "Capacités d'analyse et goût pour la résolution de problèmes complexes.",
            },
          ],
        },
        {
          groupType: "metier_potentiel",
          groupTitle: "Métiers Potentiels",
          suggestions: [
            {
              name: "Médecin Spécialiste",
              compatibility: 95,
              rationale:
                "Profil académique excellent et aptitudes scientifiques remarquables.",
            },
            {
              name: "Ingénieur en Informatique",
              compatibility: 92,
              rationale:
                "Secteur dynamique avec de nombreuses opportunités locales et internationales.",
            },
            {
              name: "Chercheur en Sciences",
              compatibility: 90,
              rationale:
                "Goût pour l'analyse approfondie et l'innovation scientifique.",
            },
            {
              name: "Ingénieur Biomédical",
              compatibility: 87,
              rationale:
                "Combinaison parfaite entre sciences exactes et applications médicales.",
            },
            {
              name: "Data Scientist",
              compatibility: 85,
              rationale: "Analyse de données et statistiques, métier d'avenir.",
            },
            {
              name: "Pharmacien",
              compatibility: 82,
              rationale:
                "Profil scientifique solide avec dimension pratique et sociale.",
            },
            {
              name: "Ingénieur en Énergies Renouvelables",
              compatibility: 80,
              rationale:
                "Secteur porteur à Madagascar avec enjeux environnementaux.",
            },
            {
              name: "Professeur de Sciences",
              compatibility: 75,
              rationale:
                "Transmission des connaissances et impact sur la formation des futures générations.",
            },
          ],
        },
      ],
    };
  }
}