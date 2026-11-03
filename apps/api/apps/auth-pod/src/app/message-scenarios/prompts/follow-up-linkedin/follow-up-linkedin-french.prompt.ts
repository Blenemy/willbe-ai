import { IBuildPromptData } from './follow-up-linkedin-english.prompt';

export function buildFollowUpLinkedinFrenchPrompt(data: IBuildPromptData): string {
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
    VOUS DEVEZ générer UNIQUEMENT le texte du message de suivi LinkedIn.
    INTERDIT d'inclure:
    - Notes explicatives ou commentaires: (ex: "Ce suivi est personnalisé par...", "J'ai inclus des références à...", "Note: Le suivi fait référence à...")
    - Analyses ou justifications: (ex: "Le suivi souligne les points clés...", "Il se concentre sur...", "L'approche se concentre sur...")
    - Métadonnées ou annotations: (ex: "Type: message de suivi", "Personnalisation: élevée", "Cible: décideur")
    - Texte après la formule de politesse: (ex: listes des caractéristiques incluses, explications des personnalisations faites, analyse de l'approche utilisée)
    - Tout contenu qui n'est pas le suivi lui-même: (ex: "Voici le suivi généré:", "Voici le suivi que j'ai créé:", "Voici le suivi:")
    - Phrases d'introduction: (ex: "Je suggère le suivi suivant:", "J'ai généré ce suivi:", "Le suivi serait comme suit:")

    Le message de suivi DOIT se terminer à la dernière ligne du texte, sans aucun contenu supplémentaire.

    L'hyperpersonnalisation est OBLIGATOIRE et doit se baser sur :
    - Le profil professionnel du destinataire
    - Son poste actuel et ses responsabilités
    - L'activité LinkedIn fournie (personnelle et entreprise)
    - La description et le secteur de son entreprise
    - Le contenu des derniers messages envoyés (pour éviter la répétition)
    - Les points de connexion entre ses besoins et votre proposition de valeur

    PRIORISATION DU CONTENU :
    Pour assurer la différenciation avec les derniers messages :
    - Identifier les aspects du profil NON mentionnés dans les derniers contacts
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

    Informations sur l'entreprise cible :

    Nom de l'entreprise : ${targetCompanyFullInfo.data.name}
    Description de l'entreprise : ${targetCompanyFullInfo.data.description}
    Secteurs : ${targetCompanyFullInfo.data.industry[0]}
    Activité LinkedIn de l'entreprise cible : ${''}
    Derniers messages envoyés : ${''}

    Informations sur le client potentiel :

    Nom : ${messageEntryLeadData.lead.leadData.name}
    Poste : ${messageEntryLeadData.lead.leadData.current_positions[0].role}
    Description du poste : ${''}
    Résumé professionnel : ${messageEntryLeadData.lead.leadData.summary}
    Publications LinkedIn du client potentiel : ${''}

    STRUCTURE ET FORMAT DU MESSAGE :

    Longueur maximale totale : ${messageEntryLeadData.messageStructure.wordsLimit} mots
    VOUS DEVEZ suivre exactement cette structure : ${messageTemplateString}
    Cette structure définit :

    Sections obligatoires
    Limites de mots par section
    Ordre de l'information

    MESSAGE DE RÉFÉRENCE :
    Utilisez ce message comme inspiration pour le ton et le style : ${messageTemplate.sampleMessage}
    Note : Ceci n'est qu'un exemple de référence. Votre message doit :

    Suivre la structure définie dans ${messageTemplateString}
    Être hyperpersonnalisé de manière unique pour votre client potentiel en utilisant TOUTES les informations fournies
    Faire référence à un contenu différent basé sur les informations spécifiques de votre client potentiel
    Établir des liens clairs entre les informations du client et votre proposition de valeur

    EXIGENCES D'ENGAGEMENT SUR LINKEDIN :
    S'il y a des publications pertinentes :

    Faire référence à :
    - Publications de l'entreprise
    - Publications personnelles du client potentiel
    - Relier l'activité à votre proposition de valeur

    RESTRICTIONS DE CONTENU :
    - Ne pas faire référence à la météo ou aux conditions atmosphériques
    - Ne pas mentionner les saisons ni les références saisonnières
    - Éviter les phrases comme :
      * "J'espère que vous passez une belle journée ensoleillée"
      * "Avec l'arrivée du printemps..."
      * "En ces jours de chaleur..."
      * "Durant cette saison..."

    Format des Noms d'Entreprise :
    - Première lettre de chaque mot en majuscule
    - Convertir les noms en majuscules en format titre

    Exemples :
    "RIVER ISLAND" doit s'écrire "River Island"
    "GUESS" doit s'écrire "Guess"
    "BANCO SANTANDER" doit s'écrire "Banco Santander"

    Cela s'applique à TOUTES les mentions de ${targetCompanyFullInfo.data.name} dans le message

    IMPORTANT : Ce prompt doit générer des réponses EXCLUSIVEMENT en français de France. Utiliser le vouvoiement et employer le vocabulaire et les expressions propres à la France.

    EXEMPLES D'UTILISATION CORRECTE DU FRANÇAIS DE FRANCE :
    - Utiliser le vouvoiement : "Êtes-vous intéressé... ?", "Votre entreprise..."
    - Terminologie française : "ordinateur" (pas "computer"), "portable" (pas "cellulaire")
    - Expressions françaises : "effectivement", "tout à fait", "d'accord"
    - Horaires au format 24h : "11h" ou "11h00" (pas "11 AM")
  `;
}