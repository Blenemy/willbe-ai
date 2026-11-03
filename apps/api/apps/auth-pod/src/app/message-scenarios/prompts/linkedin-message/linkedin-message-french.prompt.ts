import { IBuildPromptData } from './linkedin-message-english.prompt';

export function buildLinkedinMessageFrenchPrompt(data: IBuildPromptData): string {
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
    VOUS DEVEZ générer UNIQUEMENT le texte du message LinkedIn.
    INTERDIT d'inclure:
    - Notes explicatives ou commentaires: (ex: "Ce message est personnalisé par...", "J'ai inclus des références à...", "Note: Le message fait référence à...")
    - Analyses ou justifications: (ex: "Le message souligne les points clés...", "Il se concentre sur...", "L'approche se concentre sur...")
    - Métadonnées ou annotations: (ex: "Type de message: LinkedIn", "Personnalisation: élevée", "Cible: décideur")
    - Texte après la formule de politesse: (ex: listes des caractéristiques incluses, explications des personnalisations faites, analyse de l'approche utilisée)
    - Tout contenu qui n'est pas le message lui-même: (ex: "Voici le message généré:", "Voici le message que j'ai créé:", "Voici le message:")
    - Phrases d'introduction: (ex: "Je suggère le message suivant:", "J'ai généré ce message:", "Le message serait comme suit:")

    Le message DOIT se terminer à la dernière ligne du texte, sans aucun contenu supplémentaire.

    PARAMÈTRES D'ENTRÉE :
    À propos de votre entreprise :
    Nom de l'entreprise : ${company.name}
    Secteur : ${company.sector}
    Description de l'entreprise : ${company.shortDescription}

    Votre offre :
    Nom du produit/service : ${messageEntryLeadData.productService.name}
    Description : ${messageEntryLeadData.productService.shortDescription}

    Informations sur l'entreprise cible :
    Nom de l'entreprise : ${targetCompanyFullInfo.data.name}
    Description de l'entreprise : ${targetCompanyFullInfo.data.description}
    Secteurs : ${targetCompanyFullInfo.data.industry[0]}
    Publications récentes LinkedIn de l'entreprise cible : ${''} (OBLIGATOIRE d'en faire mention si disponible)

    Informations sur le client potentiel :
    Prénom : ${messageEntryLeadData.lead.leadData.name}
    Poste : ${messageEntryLeadData.lead.leadData.current_positions[0].role}
    Description du poste : ${''}
    Résumé professionnel : ${messageEntryLeadData.lead.leadData.summary}
    Publications récentes LinkedIn du client potentiel : ${''} (OBLIGATOIRE d'en faire mention si disponibles)

    STRUCTURE ET FORMAT DU MESSAGE :
    Longueur totale maximale : ${messageEntryLeadData.messageStructure.wordsLimit} mots
    VOUS DEVEZ suivre cette structure : ${messageTemplateString}
    Cette structure définit :
    - Sections obligatoires
    - Limites de mots par section
    - Ordre des informations

    MESSAGE DE RÉFÉRENCE :
    Utilisez ce message comme inspiration pour le ton et le style : ${messageTemplate.sampleMessage}
    Note : Même si vous utilisez le message de référence mentionné ci-dessus, votre message doit :
    - Suivre la structure définie dans ${messageTemplateString}
    - Être personnalisé de manière unique pour votre client potentiel
    - Faire référence à un contenu différent basé sur les informations de votre client potentiel

    EXIGENCES D'ENGAGEMENT SUR LINKEDIN :
    Si des publications LinkedIn sont disponibles :
    IL EST OBLIGATOIRE de faire référence à du contenu spécifique de leurs publications les plus récentes :
    - Publications récentes LinkedIn du client potentiel et publications récentes LinkedIn de l'entreprise cible
    - Les publications récentes LinkedIn du client potentiel sont prioritaires
    - Utiliser leur activité sur LinkedIn pour démontrer la compréhension de leurs priorités actuelles
    - Connecter leur contenu publié avec la proposition de valeur
    - Montrer comment votre solution est liée aux sujets qu'ils discutent activement

    RÈGLES IMPORTANTES DE FORMAT :
    - Ton professionnel mais proche
    - Éviter le langage commercial évident

    RESTRICTIONS DE CONTENU :
    - Ne pas faire référence à la météo
    - Ne pas mentionner les saisons ni les références saisonnières
    - Éviter les phrases comme :
      * "J'espère que vous passez une belle journée ensoleillée"
      * "Avec l'arrivée du printemps..."
      * "En ces jours de chaleur..."
      * "Durant cette saison..."

    Format des Noms d'Entreprise :
    - Première lettre de chaque mot en majuscule
    - Convertir les noms en majuscules au format titre
    Exemples :
    - "RIVER ISLAND" doit s'écrire "River Island"
    - "GUESS" doit s'écrire "Guess"
    - "BANCO SANTANDER" doit s'écrire "Banco Santander"
    Cela s'applique à TOUTES les mentions de ${company.name} dans le message

    EXIGENCES DE PERSONNALISATION :
    Doit faire référence à au moins un détail spécifique de :
    - Leurs publications LinkedIn (si disponibles)
    - Description de l'entreprise
    - Rôle et responsabilités
    - Contexte du secteur
    - Montrer une recherche claire et une compréhension de leur activité
    - Connecter leurs défis avec votre solution sans être promotionnel

    Votre réponse doit contenir UNIQUEMENT le texte du message LinkedIn, en suivant la structure fournie tout en utilisant le message exemple comme référence pour le ton et le style. Créez un message hautement personnalisé qui démontre que vous avez examiné en profondeur leur profil et comprenez leur contexte.

    IMPORTANT : Ce prompt doit générer des réponses EXCLUSIVEMENT en français de France. Utiliser le vouvoiement et employer le vocabulaire et les expressions propres à la France.

    EXEMPLES D'UTILISATION CORRECTE DU FRANÇAIS DE FRANCE :
    - Utiliser le vouvoiement : "Êtes-vous intéressé... ?", "Votre entreprise..."
    - Terminologie française : "ordinateur", "portable", "téléphone"
    - Expressions françaises : "d'accord", "super", "très bien"
    - Horaires au format 24h : "11h" ou "11h00" (pas "11 AM")
  `;
}