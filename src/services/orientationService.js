export class OrientationService {
  static OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'
  static DEEPSEEK_MODEL = 'deepseek/deepseek-chat'
  
  static buildPromptFromProfile(user, bulletins) {
    const profile = user.profile
    const latestBulletin = bulletins[0]
    
    let prompt = `Analyser le profil d'orientation pour l'étudiant suivant:\n\n`
    prompt += `Informations personnelles:\n`
    prompt += `- Nom: ${profile.firstName} ${profile.lastName}\n`
    prompt += `- Niveau: ${profile.level}\n`
    prompt += `- Classe: ${profile.class}\n`
    prompt += `- Moyenne générale: ${profile.averageGrade}/20\n\n`
    
    if (profile.filieres && profile.filieres.length > 0) {
      prompt += `Filières d'intérêt: ${profile.filieres.join(', ')}\n\n`
    }
    
    if (profile.interests && profile.interests.length > 0) {
      prompt += `Centres d'intérêt: ${profile.interests.join(', ')}\n\n`
    }
    
    if (latestBulletin) {
      prompt += `Derniers résultats scolaires:\n`
      latestBulletin.subjects.forEach(subject => {
        prompt += `- ${subject.subject}: ${subject.grade}/20\n`
      })
    }
    
    prompt += `\nVeuillez fournir:\n`
    prompt += `1. Une analyse des points forts et axes d'amélioration\n`
    prompt += `2. Trois recommandations de filières adaptées\n`
    prompt += `3. Des conseils pour optimiser l'orientation\n`
    prompt += `4. Des suggestions d'activités ou formations complémentaires\n`
    prompt += `\nRépondez en français et structurez votre réponse de manière claire et professionnelle.`
    
    return prompt
  }
  
  static async generateRecommendations(prompt) {
    try {
      const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY || import.meta.env.VITE_DEEPSEEK_API_KEY
      
      if (!apiKey) {
        console.warn('No API key found, using mock data')
        return this.getMockRecommendations()
      }

      const response = await fetch(this.OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'SmartParcours Educational AI'
        },
        body: JSON.stringify({
          model: this.DEEPSEEK_MODEL,
          messages: [
            {
              role: 'system',
              content: 'Vous êtes un conseiller d\'orientation expérimenté spécialisé dans l\'analyse de profils étudiants. Votre rôle est de fournir des recommandations personnalisées basées sur les résultats scolaires, les intérêts et le profil de l\'étudiant.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1500
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('API Error:', errorData)
        throw new Error(`API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`)
      }
      
      const data = await response.json()
      const aiResponse = data.choices?.[0]?.message?.content
      
      if (!aiResponse) {
        throw new Error('No response from AI')
      }

      return this.parseAIResponse(aiResponse)
      
    } catch (error) {
      console.error('Error generating recommendations:', error)
      return this.getMockRecommendations()
    }
  }
  
  static parseAIResponse(response) {
    return {
      analysis: response.substring(0, 300) + '...', 
      recommendations: [
        "Recommandation basée sur l'analyse IA",
        "Deuxième recommandation personnalisée",
        "Troisième option d'orientation"
      ],
      suggestedFields: [
        "Domaine suggéré par l'IA",
        "Secteur d'activité recommandé",
        "Filière adaptée au profil"
      ],
      strengths: [
        "Point fort identifié par l'IA",
        "Compétence remarquée",
        "Aptitude particulière"
      ],
      improvements: [
        "Axe d'amélioration suggéré",
        "Compétence à développer",
        "Domaine à renforcer"
      ],
      fullResponse: response
    }
  }

  static getMockRecommendations() {
    return {
      analysis: "L'étudiant montre de très bonnes aptitudes en sciences et mathématiques avec une moyenne générale de 15.2/20. Les résultats en physique et mathématiques sont particulièrement remarquables.",
      recommendations: [
        "Classe préparatoire scientifique (CPGE) - Filière MPSI/PCSI",
        "École d'ingénieur avec prépa intégrée",
        "Licence Sciences et Technologies mention Physique"
      ],
      suggestedFields: [
        "Ingénierie",
        "Recherche scientifique",
        "Technologies de l'information"
      ],
      strengths: [
        "Excellence en mathématiques et physique",
        "Capacité d'analyse et de résolution de problèmes",
        "Intérêt marqué pour la recherche"
      ],
      improvements: [
        "Développer les compétences en communication",
        "Renforcer les langues étrangères",
        "Élargir la culture générale"
      ]
    }
  }
}