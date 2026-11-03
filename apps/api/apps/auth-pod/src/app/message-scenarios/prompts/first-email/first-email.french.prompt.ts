import { IBuildPromptData } from './first-email-english.prompt';

export function buildFirstEmailFrenchPrompt(data: IBuildPromptData): string {
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
    VOUS DEVEZ générer UNIQUEMENT le texte de l'email.
    INTERDIT d'inclure:
    - Notes explicatives ou commentaires: (ex: "Cet email est personnalisé par...", "J'ai inclus des références à...", "Note: L'email fait référence à...")
    - Analyses ou justifications: (ex: "L'email souligne les points clés...", "Il se concentre sur...", "L'approche se concentre sur...")
    - Métadonnées ou annotations: (ex: "Type d'email: initial", "Personnalisation: élevée", "Cible: décideur")
    - Texte après la formule de politesse: (ex: listes des caractéristiques incluses, explications des personnalisations faites, analyse de l'approche utilisée)
    - Tout contenu qui n'est pas l'email lui-même: (ex: "Voici l'email généré:", "Voici l'email que j'ai créé:", "Voici l'email:")
    - Phrases d'introduction: (ex: "Je suggère l'email suivant:", "J'ai généré cet email:", "L'email serait comme suit:")

    L'email DOIT se terminer à la dernière ligne du texte, sans aucun contenu supplémentaire.

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
    Publications récentes LinkedIn de l'entreprise cible : ${''}

    Informations sur le prospect :

    Prénom : ${messageEntryLeadData.lead.leadData.name}
    Poste : ${messageEntryLeadData.lead.leadData.current_positions[0].role}
    Description du poste : ${''}
    Résumé professionnel : ${messageEntryLeadData.lead.leadData.summary}
    Publications récentes LinkedIn du prospect : ${''}

    STRUCTURE ET FORMAT DE L'EMAIL :

    Longueur totale maximale : ${messageEntryLeadData.messageStructure.wordsLimit}
    Vous DEVEZ suivre exactement cette structure : ${messageTemplateString}

    Cette structure définit :

    Les sections obligatoires,
    Les limites de mots par section,
    L'ordre des informations

    EMAIL DE RÉFÉRENCE :
    Utilisez cet email comme inspiration pour le ton et le style : ${messageTemplate.sampleMessage}

    Note : Ceci n'est qu'un exemple de référence. Votre email doit :

    - Suivre cette STRUCTURE ET CE FORMAT : ${messageTemplateString}
    - Être personnalisé de manière unique pour votre prospect
    - Faire référence à un contenu différent basé sur les informations de votre prospect

    EXIGENCES D'ENGAGEMENT SUR LINKEDIN :
    S'il y a des publications LinkedIn disponibles :

    IL EST OBLIGATOIRE de faire référence à un contenu spécifique de leurs publications les plus récentes précédemment mentionnées dans l'introduction :

    Publications récentes LinkedIn du prospect et publications récentes LinkedIn de l'entreprise cible. Les publications récentes LinkedIn du prospect sont prioritaires.

    Utiliser l'activité LinkedIn pour démontrer la compréhension de leurs priorités actuelles
    Connecter leur contenu publié avec la proposition de valeur
    Montrer comment votre solution est liée aux sujets qu'ils discutent activement

    RÈGLES IMPORTANTES DE FORMATAGE :

    RESTRICTIONS DE CONTENU :
    - Ne pas faire référence à la météo
    - Ne pas mentionner les saisons ni les références saisonnières
    - Éviter les phrases comme :
      * "J'espère que vous passez une belle journée ensoleillée"
      * "Avec l'arrivée du printemps..."
      * "En ces jours de chaleur..."
      * "Durant cette saison..."

    Pas d'objet d'email
    Pas de signature
    Utiliser le format <b>texte</b> pour les points clés (NE JAMAIS utiliser les astérisques ** ni aucun autre format)
    Éviter le langage commercial évident

    Format des Noms d'Entreprise :

    Première lettre de chaque mot en majuscule
    Convertir les noms en majuscules au format titre

    Exemples :
    "RIVER ISLAND" doit être écrit "River Island"
    "GUESS" doit être écrit "Guess"
    "BANCO SANTANDER" doit être écrit "Banco Santander"

    Ceci s'applique à TOUTES les mentions de ${targetCompanyFullInfo.data.name} dans l'email

    EXIGENCES DE BALISES EN GRAS - OBLIGATOIRE :
    Vous DEVEZ utiliser les balises <b> et </b> (JAMAIS d'astérisques **) pour mettre en évidence UNIQUEMENT les phrases les plus impactantes et pertinentes dans chaque paragraphe. L'objectif est de mettre en valeur uniquement les points clés, pas tout le contenu. Chaque paragraphe doit contenir AU MAXIMUM UNE phrase en gras qui représente le point le plus important.

    DIRECTIVES DE MISE EN ÉVIDENCE PAR PARAGRAPHE :

    Paragraphe d'Ouverture/Introduction :

    Mettre en évidence UNIQUEMENT l'observation la plus pertinente sur le prospect
    CORRECT : "J'ai suivi votre travail et <b>votre récente mise en œuvre de solutions durables a permis de réduire l'impact environnemental de 40%</b>"
    INCORRECT : "<b>J'ai suivi votre travail et votre récente mise en œuvre de solutions durables a permis de réduire l'impact environnemental de 40%</b>"

    Paragraphe de Proposition de Valeur :

    Mettre en évidence UNIQUEMENT le bénéfice principal ou le différenciateur clé
    CORRECT : "Notre plateforme offre de multiples fonctionnalités, et <b>nous avons réussi à réduire les coûts opérationnels de 30% pour des entreprises similaires</b>"
    INCORRECT : "<b>Notre plateforme offre de multiples fonctionnalités, et nous avons réussi à réduire les coûts opérationnels de 30% pour des entreprises similaires</b>"

    Paragraphe de Preuve Sociale :

    Mettre en évidence UNIQUEMENT la réalisation ou le résultat le plus impactant
    CORRECT : "Nous collaborons avec divers clients du secteur et <b>nous avons aidé River Island à augmenter son efficacité de 45%</b>"
    INCORRECT : "<b>Nous collaborons avec divers clients du secteur et nous avons aidé River Island à augmenter son efficacité de 45%</b>"

    Paragraphe d'Appel à l'Action :

    Mettre en évidence UNIQUEMENT la proposition concrète de rendez-vous
    CORRECT : "<b>Un café virtuel de 30 minutes jeudi prochain à 11h vous conviendrait-il ?</b>"
    INCORRECT : "<b>J'aimerais beaucoup avoir l'opportunité de nous rencontrer. Un café virtuel de 30 minutes jeudi prochain à 11h vous conviendrait-il ?</b>"

    RÈGLES GÉNÉRALES DE MISE EN ÉVIDENCE :

    Maximum UNE phrase en gras par paragraphe
    Mettre en évidence UNIQUEMENT le point le plus important ou impactant
    Éviter de mettre en évidence les informations contextuelles ou les connecteurs
    Les phrases en gras doivent pouvoir être lues indépendamment et garder un sens complet
    Le texte en gras ne doit pas dépasser 25% du contenu total de l'email

    EXEMPLES D'ÉQUILIBRE CORRECT :

    BON (Mise en évidence sélective) :
    "Bonjour Jean,
    J'ai suivi votre parcours et <b>votre récente expansion internationale a généré des résultats exceptionnels</b>.
    Depuis notre cabinet de conseil spécialisé, <b>nous avons aidé des entreprises similaires à réduire leurs coûts d'expansion de 40%</b>.
    Nous travaillons avec de nombreux clients du secteur et <b>nous avons récemment aidé Company X à compléter son expansion 50% plus rapidement</b>.
    <b>Seriez-vous disponible pour une réunion jeudi à 11h afin de partager notre expérience ?</b>
    Cordialement,"

    MAUVAIS (Trop de mise en évidence) :
    "<b>Bonjour Jean,
    J'ai suivi votre parcours et votre récente expansion internationale a généré des résultats exceptionnels.
    Depuis notre cabinet de conseil spécialisé, nous avons aidé des entreprises similaires à réduire leurs coûts d'expansion de 40%.
    Nous travaillons avec de nombreux clients du secteur et nous avons récemment aidé Company X à compléter son expansion 50% plus rapidement.
    Seriez-vous disponible pour une réunion jeudi à 11h afin de partager notre expérience ?</b>
    Cordialement,"

    EXIGENCES DE PERSONNALISATION :

    Doit faire référence à au moins un détail spécifique de :

    Leurs publications LinkedIn (si disponibles)
    Description de l'entreprise
    Rôle et responsabilités
    Contexte du secteur

    Montrer une recherche claire et une compréhension de leur activité
    Connecter leurs défis avec votre solution sans être promotionnel

    Votre réponse doit contenir UNIQUEMENT le texte de l'email, en suivant la structure fournie tout en utilisant l'email d'exemple comme référence pour le ton et le style. Créez un message hautement personnalisé qui démontre que vous avez examiné en profondeur leur profil et comprenez leur contexte.

    IMPORTANT : Ce prompt doit générer des réponses EXCLUSIVEMENT en français de France. Utiliser le vouvoiement et employer le vocabulaire et les expressions propres à la France.

    EXEMPLES D'UTILISATION CORRECTE DU FRANÇAIS DE FRANCE :

    Utiliser le vouvoiement : "Êtes-vous intéressé... ?", "Votre entreprise..."
    Terminologie française : "ordinateur", "portable", "rendez-vous"
    Expressions françaises : "d'accord", "parfait", "très bien"
    Horaires au format 24h : "11h" ou "11h00" (pas "11 AM")
  `;
}