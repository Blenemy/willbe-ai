import { IBuildPromptData } from './follow-up-email-english.prompt';

export function buildFollowUpEmailFrenchPrompt(data: IBuildPromptData): string {
  const { messageTemplate, company, messageEntryLeadData, targetCompanyFullInfo} = data;

  let messageTemplateString = `Salutation : ${messageTemplate.greeting}\n\n`;
  
  messageTemplateString += `Introduction (nombre maximum de mots de la section introduction : ${messageTemplate.introduction.wordsLimit}): ${messageTemplate.introduction.text}`;
  messageTemplateString += 'L\'introduction doit être personnalisée mais non axée sur la vente.\n\n';

  messageTemplate.paragraphs.forEach((paragraph, index) => {
    messageTemplateString += `Paragraphe ${index + 1} (nombre maximum de mots du paragraphe ${index + 1} : ${paragraph.wordsLimit}): ${paragraph.text}\n\n`;
  });

  messageTemplateString += `Formule de politesse (nombre maximum de mots de la section formule de politesse : ${messageTemplate.goodbye.wordsLimit}): ${messageTemplate.goodbye.text}\n\n`;

  return `
    ${messageTemplate.objective}

    RESTRICTION CRITIQUE DE FORMAT:
    VOUS DEVEZ générer UNIQUEMENT le texte de l'email de suivi.
    INTERDIT d'inclure:
    - Notes explicatives ou commentaires: (ex: "Ce suivi est personnalisé par...", "J'ai inclus des références à...", "Note: Le suivi fait référence à...")
    - Analyses ou justifications: (ex: "Le suivi souligne les points clés...", "Il se concentre sur...", "L'approche se concentre sur...")
    - Métadonnées ou annotations: (ex: "Type: email de suivi", "Personnalisation: élevée", "Cible: décideur")
    - Texte après la formule de politesse: (ex: listes des caractéristiques incluses, explications des personnalisations faites, analyse de l'approche utilisée)
    - Tout contenu qui n'est pas le suivi lui-même: (ex: "Voici le suivi généré:", "Voici le suivi que j'ai créé:", "Voici le suivi:")
    - Phrases d'introduction: (ex: "Je suggère le suivi suivant:", "J'ai généré ce suivi:", "Le suivi serait comme suit:")

    L'email de suivi DOIT se terminer à la dernière ligne du texte, sans aucun contenu supplémentaire.

    L'hyperpersonnalisation est OBLIGATOIRE et doit se baser sur :
    - Le profil professionnel du destinataire
    - Son poste actuel et ses responsabilités
    - L'activité LinkedIn fournie (personnelle et de l'entreprise)
    - La description et le secteur de son entreprise
    - Le contenu des derniers messages envoyés (pour éviter la répétition)
    - Les points de connexion entre ses besoins et votre proposition de valeur

    PRIORISATION DU CONTENU :
    Pour assurer une différenciation avec les derniers messages envoyés :
    - Identifier les aspects du profil NON mentionnés dans les derniers messages
    - Établir des connexions différentes entre les publications/activités et votre proposition
    - Éviter de répéter les références au contenu déjà mentionné dans les derniers messages

    PARAMÈTRES D'ENTRÉE :
    À propos de votre entreprise :

    Nom de l'entreprise : ${company.name}
    Secteur : ${company.sector}
    Description de l'entreprise : ${company.shortDescription}

    Votre offre :

    Nom du produit/service : ${messageEntryLeadData.productService.name}
    Description : ${messageEntryLeadData.productService.shortDescription}

    Information sur l'entreprise cible :

    Nom de l'entreprise : ${targetCompanyFullInfo.data.name}
    Description de l'entreprise : ${targetCompanyFullInfo.data.description}
    Secteurs : ${targetCompanyFullInfo.data.industry[0]}
    Activité LinkedIn de l'entreprise cible : ${''}
    Derniers messages envoyés : ${''}

    Information sur le client potentiel :

    Nom : ${messageEntryLeadData.lead.leadData.name}
    Poste : ${messageEntryLeadData.lead.leadData.current_positions[0].role}
    Description du poste : ${''}
    Résumé professionnel : ${messageEntryLeadData.lead.leadData.summary}
    Publications LinkedIn du client potentiel : ${''}

    STRUCTURE ET FORMAT DE L'EMAIL :

    Longueur maximale totale : ${messageEntryLeadData.messageStructure.wordsLimit} mots
    VOUS DEVEZ suivre exactement cette structure : ${messageTemplateString}
    Cette structure définit :

    Sections obligatoires
    Limites de mots par section
    Ordre de l'information

    EMAIL DE RÉFÉRENCE :
    Utilisez cet email comme inspiration pour le ton et le style : ${messageTemplate.sampleMessage}
    Note : Ceci n'est qu'un exemple de référence. Votre email doit :

    Suivre cette STRUCTURE ET CE FORMAT : ${messageTemplateString}
    Être hyperpersonnalisé de façon unique pour votre client potentiel en utilisant TOUTES les informations fournies
    Faire référence à un contenu différent basé sur les informations spécifiques de votre client potentiel
    Établir des connexions claires entre l'information du client et votre proposition de valeur

    EXIGENCES D'ENGAGEMENT SUR LINKEDIN :
    S'il y a des publications pertinentes :

    Faire référence à :
    - Publications de l'entreprise
    - Publications personnelles du client potentiel
    - Connecter l'activité avec votre proposition de valeur

    RÈGLES IMPORTANTES DE FORMAT :

    RESTRICTIONS DE CONTENU :
    - Ne pas faire référence à la météo
    - Ne pas mentionner les saisons ni les références saisonnières
    - Éviter les phrases comme :
      * "J'espère que vous profitez d'une belle journée ensoleillée"
      * "Avec l'arrivée du printemps..."
      * "En ces jours de chaleur..."
      * "Durant cette saison..."

    Pas d'objet d'email
    Pas de signature
    Utiliser le format <b>texte</b> pour les points clés (JAMAIS d'astérisques ** ni aucun autre format)
    Éviter le langage commercial évident

    Format des Noms d'Entreprise :
    - Première lettre de chaque mot en majuscule
    - Convertir les noms en majuscules en format titre

    Exemples :
    "RIVER ISLAND" doit être écrit "River Island"
    "GUESS" doit être écrit "Guess"
    "BANCO SANTANDER" doit être écrit "Banco Santander"

    Ceci s'applique à TOUTES les mentions de ${targetCompanyFullInfo.data.name} dans l'email

    EXIGENCES DES BALISES EN GRAS - OBLIGATOIRE :
    VOUS DEVEZ utiliser les balises <b> et </b> (JAMAIS d'astérisques **) pour mettre en évidence UNIQUEMENT les phrases les plus impactantes et pertinentes dans chaque paragraphe. L'objectif est de souligner uniquement les points clés, pas tout le contenu. Chaque paragraphe doit contenir AU MAXIMUM UNE phrase mise en évidence qui représente le point le plus important.

    DIRECTIVES DE MISE EN ÉVIDENCE PAR PARAGRAPHE :

    Contextualisation :
    - Mettre en évidence UNIQUEMENT la référence la plus pertinente au contact précédent
    CORRECT : "Je vous ai écrit la semaine dernière concernant <b>comment nous pourrions vous aider à optimiser votre processus de logistique internationale</b>."
    INCORRECT : "<b>Je vous écris à nouveau car je n'ai pas reçu de réponse à mon email précédent sur la logistique internationale</b>."

    Valeur Ajoutée :
    - Mettre en évidence UNIQUEMENT la nouvelle information pertinente
    CORRECT : "Cette semaine, <b>nous avons publié une analyse détaillée sur la façon dont River Island a réduit ses coûts logistiques de 35%</b>."
    INCORRECT : "<b>Comme je le mentionnais dans mon dernier email, nous avons aidé plusieurs entreprises à réduire leurs coûts logistiques</b>."

    Bénéfice Principal :
    - Mettre en évidence UNIQUEMENT le bénéfice clé actualisé
    CORRECT : "En observant vos derniers projets, <b>nous pourrions vous aider à atteindre des résultats similaires en moitié moins de temps</b>."
    INCORRECT : "<b>Comme je le disais précédemment, notre solution peut vous aider à réduire les temps et les coûts</b>."

    Appel à l'Action :
    - Mettre en évidence UNIQUEMENT la proposition concrète de réunion
    CORRECT : "<b>Seriez-vous disponible pour un appel vidéo de 30 minutes ce jeudi à 10h ?</b>"
    INCORRECT : "<b>J'aimerais avoir l'opportunité de vous expliquer plus de détails. Seriez-vous disponible pour un appel vidéo ?</b>"

    IMPORTANT : Ce prompt doit générer des réponses EXCLUSIVEMENT en français de France. Utiliser le vouvoiement et employer le vocabulaire et les expressions propres à la France.

    EXEMPLES D'UTILISATION CORRECTE DU FRANÇAIS DE FRANCE :
    - Utiliser le vouvoiement : "Êtes-vous intéressés... ?", "Votre entreprise..."
    - Terminologie française : "ordinateur", "portable" (pas "laptop")
    - Expressions françaises : "d'accord", "super", "très bien"
    - Horaires au format 24h : "11h" ou "11h00" (pas "11 AM")
  `;
}