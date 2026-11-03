import { MessageLanguage } from '@willbe-server/db-core';

export const friendlyMessageTemplates = [
  {
    language: MessageLanguage.EN,
    type: 'greeting',
    value: 'Hello [Name],',
  },
  {
    language: MessageLanguage.EN,
    type: 'introduction',
    value: 'Say something to break the ice in a professional and witty way, avoiding typical sales openings. Add a smiley emoji (🙂) to keep it friendly. The introduction should be personalized but not sales-focused.',
  },
  {
    language: MessageLanguage.EN,
    type: 'paragraph_1',
    value: 'Talk about the person and their company in a personalized way. Reference specific observations about their business operations or recent achievements. Show understanding of common industry challenges in their sector. Use an empathetic but professional tone.',
  },
  {
    language: MessageLanguage.EN,
    type: 'paragraph_2',
    value: 'Present your solution by addressing the specific pain points identified. Focus on value proposition and benefits without being overly promotional. Emphasize how your solution aligns with their needs.',
  },
  {
    language: MessageLanguage.EN,
    type: 'paragraph_3',
    value: 'Suggest a specific time for a short virtual meeting (30 minutes) to discuss potential collaboration. Make it casual by referring to it as a "virtual coffee."',
  },
  {
    language: MessageLanguage.EN,
    type: 'goodbye',
    value: 'Looking forward to your confirmation, [name]',
  },
  {
    language: MessageLanguage.EN,
    type: 'sample_message',
    value: `Hello Maria,
    
Couldn't help but notice your latest LinkedIn post while enjoying my morning coffee 🙂

I was impressed by your recent team expansion – scaling that quickly while maintaining quality is no small feat! 

Having spoken with other industry leaders, I know this growth phase often comes with its share of operational challenges.

Our platform streamlines your team's workflow by integrating essential tools into one unified system. This means less time juggling between applications and more time focusing on what matters: building meaningful client relationships and driving revenue growth.

Would you be open to a 30-minute virtual coffee next Tuesday at 10am? I'd love to learn more about your growth journey and share some insights that might be valuable for your team.

Looking forward to your confirmation, Maria.`,
  },
  {
    language: MessageLanguage.ES,
    type: 'greeting',
    value: 'Hola [Name],',
  },
  {
    language: MessageLanguage.ES,
    type: 'introduction',
    value: 'Di algo para romper el hielo de manera profesional e ingeniosa, evitando las típicas aperturas comerciales. Añade un emoji sonriente (🙂) para mantener un tono cercano. La introducción debe ser personalizada pero no enfocada a ventas.',
  },
  {
    language: MessageLanguage.ES,
    type: 'paragraph_1',
    value: 'Habla sobre la persona y su empresa de manera personalizada. Haz referencia a observaciones específicas sobre sus operaciones comerciales o logros recientes. Demuestra comprensión de los desafíos comunes del sector. Utiliza un tono empático pero profesional.',
  },
  {
    language: MessageLanguage.ES,
    type: 'paragraph_2',
    value: 'Presenta tu solución abordando los puntos débiles identificados. Céntrate en la propuesta de valor y los beneficios sin ser excesivamente promocional. Enfatiza cómo tu solución se alinea con sus necesidades.',
  },
  {
    language: MessageLanguage.ES,
    type: 'paragraph_3',
    value: 'Sugiere una hora específica para una breve reunión virtual (30 minutos) para discutir una posible colaboración. Hazlo casual refiriéndote a ello como un "café virtual".',
  },
  {
    language: MessageLanguage.ES,
    type: 'goodbye',
    value: 'Esperando tu confirmación, [name]',
  },
  {
    language: MessageLanguage.ES,
    type: 'sample_message',
    value: `Hello Maria,
    
Hola María,

Me cuelo en tu top 5 emails a estas horas de la mañana 🙂.

Espero que estés pudiendo descansar algo después de la contratación de 10 perfiles comerciales en menos de un mes, ¡enhorabuena, qué locura!

Habiendo hablado con otros líderes del sector, sé que esta fase de crecimiento suele venir acompañada de sus propios desafíos operativos.

Nuestra plataforma optimiza el flujo de trabajo de tu equipo integrando herramientas esenciales en un sistema unificado. Esto significa menos tiempo saltando entre aplicaciones y más tiempo centrándose en lo importante: construir relaciones significativas con clientes y impulsar el crecimiento de ingresos.

¿Te vendría bien un café virtual de 30 minutos el martes a las 10h? Me encantaría conocer más sobre tu trayectoria de crecimiento y compartir algunas ideas que podrían ser valiosas para tu equipo.

Esperando tu confirmación, María.`,
  },
  {
    language: MessageLanguage.FR,
    type: 'greeting',
    value: 'Bonjour [Name],',
  },
  {
    language: MessageLanguage.FR,
    type: 'introduction',
    value: `Dites quelque chose pour briser la glace de manière professionnelle et spirituelle, en évitant les ouvertures commerciales typiques. Ajoutez un emoji souriant (🙂) pour garder un ton sympathique. L'introduction doit être personnalisée mais pas axée sur la vente.`,
  },
  {
    language: MessageLanguage.FR,
    type: 'paragraph_1',
    value: 'Parlez de la personne et de son entreprise de manière personnalisée. Faites référence à des observations spécifiques sur leurs opérations commerciales ou leurs réalisations récentes. Montrez votre compréhension des défis communs du secteur. Utilisez un ton empathique mais professionnel.',
  },
  {
    language: MessageLanguage.FR,
    type: 'paragraph_2',
    value: `Présentez votre solution en abordant les points sensibles identifiés. Concentrez-vous sur la proposition de valeur et les avantages sans être trop promotionnel. Soulignez comment votre solution s'aligne sur leurs besoins.`,
  },
  {
    language: MessageLanguage.FR,
    type: 'paragraph_3',
    value: `Suggérez une heure précise pour une courte réunion virtuelle (30 minutes) pour discuter d'une collaboration potentielle. Gardez ça décontracté en y faisant référence comme un "café virtuel".`,
  },
  {
    language: MessageLanguage.FR,
    type: 'goodbye',
    value: `Dans l'attente de votre confirmation, [name]`,
  },
  {
    language: MessageLanguage.FR,
    type: 'sample_message',
    value: `Bonjour Marie,

Je n'ai pas pu m'empêcher de remarquer votre dernière publication LinkedIn en prenant mon café du matin 🙂

J'ai été impressionné par votre récente expansion d'équipe – développer si rapidement tout en maintenant la qualité n'est pas une mince affaire ! 

Ayant échangé avec d'autres leaders du secteur, je sais que cette phase de croissance s'accompagne souvent de défis opérationnels.

Notre plateforme optimise le flux de travail de votre équipe en intégrant des outils essentiels dans un système unifié. Cela signifie moins de temps à jongler entre les applications et plus de temps à se concentrer sur l'essentiel : construire des relations significatives avec les clients et stimuler la croissance des revenus.

Seriez-vous disponible pour un café virtuel de 30 minutes mardi à 10h ? J'aimerais en savoir plus sur votre parcours de croissance et partager quelques idées qui pourraient être précieuses pour votre équipe.

Dans l'attente de votre confirmation, Marie.`,
  },
  {
    language: MessageLanguage.PT,
    type: 'greeting',
    value: 'Olá [Name],',
  },
  {
    language: MessageLanguage.PT,
    type: 'introduction',
    value: `Diga algo para quebrar o gelo de forma profissional e espirituosa, evitando aberturas típicas de vendas. Adicione um emoji sorridente (🙂) para manter um tom amigável. A introdução deve ser personalizada mas não focada em vendas.`,
  },
  {
    language: MessageLanguage.PT,
    type: 'paragraph_1',
    value: 'Fale sobre a pessoa e a sua empresa de forma personalizada. Faça referência a observações específicas sobre as suas operações comerciais ou conquistas recentes. Demonstre compreensão dos desafios comuns do setor. Use um tom empático mas profissional.',
  },
  {
    language: MessageLanguage.PT,
    type: 'paragraph_2',
    value: `Apresente a sua solução abordando os pontos críticos identificados. Concentre-se na proposta de valor e nos benefícios sem ser excessivamente promocional. Enfatize como a sua solução se alinha com as necessidades deles.`,
  },
  {
    language: MessageLanguage.PT,
    type: 'paragraph_3',
    value: `Sugira uma hora específica para uma breve reunião virtual (30 minutos) para discutir uma possível colaboração. Mantenha casual referindo-se a ela como um "café virtual".`,
  },
  {
    language: MessageLanguage.PT,
    type: 'goodbye',
    value: `Aguardo a sua confirmação, [name]`,
  },
  {
    language: MessageLanguage.PT,
    type: 'sample_message',
    value: `Olá Maria,

Não pude deixar de reparar na sua última publicação no LinkedIn enquanto tomava o meu café da manhã 🙂

Fiquei impressionado com a sua recente expansão da equipa – crescer tão rapidamente mantendo a qualidade não é tarefa fácil! 

Tendo conversado com outros líderes do setor, sei que esta fase de crescimento costuma vir acompanhada de desafios operacionais.

A nossa plataforma otimiza o fluxo de trabalho da sua equipa integrando ferramentas essenciais num sistema unificado. Isto significa menos tempo a alternar entre aplicações e mais tempo a focar no que é importante: construir relações significativas com clientes e impulsionar o crescimento da receita.

Teria disponibilidade para um café virtual de 30 minutos na terça-feira às 10h? Gostaria de conhecer mais sobre o seu percurso de crescimento e partilhar algumas ideias que poderiam ser valiosas para a sua equipa.

Aguardo a sua confirmação, Maria.`,
  },
  {
    language: MessageLanguage.DE,
    type: 'greeting',
    value: 'Hallo [Name],',
  },
  {
    language: MessageLanguage.DE,
    type: 'introduction',
    value: `Sagen Sie etwas, um das Eis auf professionelle und geistreiche Weise zu brechen, vermeiden Sie dabei typische Verkaufseröffnungen. Fügen Sie ein Smiley-Emoji (🙂) hinzu, um einen freundlichen Ton zu wahren. Die Einführung sollte personalisiert, aber nicht verkaufsorientiert sein.`,
  },
  {
    language: MessageLanguage.DE,
    type: 'paragraph_1',
    value: 'Sprechen Sie auf persönliche Weise über die Person und ihr Unternehmen. Verweisen Sie auf spezifische Beobachtungen zu ihren Geschäftsabläufen oder jüngsten Erfolgen. Zeigen Sie Verständnis für die üblichen Herausforderungen der Branche. Verwenden Sie einen empathischen, aber professionellen Ton.',
  },
  {
    language: MessageLanguage.DE,
    type: 'paragraph_2',
    value: `Präsentieren Sie Ihre Lösung, indem Sie auf die identifizierten Schmerzpunkte eingehen. Konzentrieren Sie sich auf das Wertversprechen und die Vorteile, ohne zu werblich zu sein. Betonen Sie, wie Ihre Lösung zu ihren Bedürfnissen passt.`,
  },
  {
    language: MessageLanguage.DE,
    type: 'paragraph_3',
    value: `Schlagen Sie eine bestimmte Zeit für ein kurzes virtuelles Meeting (30 Minuten) vor, um über eine mögliche Zusammenarbeit zu sprechen. Halten Sie es casual, indem Sie es als "virtuellen Kaffee" bezeichnen.`,
  },
  {
    language: MessageLanguage.DE,
    type: 'goodbye',
    value: `Ich freue mich auf Ihre Rückmeldung, [name]`,
  },
  {
    language: MessageLanguage.DE,
    type: 'sample_message',
    value: `Hallo Maria,

Ich konnte nicht umhin, Ihren letzten LinkedIn-Beitrag bei meinem morgendlichen Kaffee zu bemerken 🙂

Ich bin beeindruckt von Ihrer kürzlichen Teamerweiterung – so schnell zu skalieren und dabei die Qualität zu halten, ist keine Kleinigkeit! 

Aus Gesprächen mit anderen Branchenführern weiß ich, dass diese Wachstumsphase oft mit operativen Herausforderungen einhergeht.

Unsere Plattform optimiert den Workflow Ihres Teams durch die Integration essentieller Tools in ein einheitliches System. Das bedeutet weniger Zeit mit dem Wechseln zwischen Anwendungen und mehr Zeit für das Wesentliche: bedeutungsvolle Kundenbeziehungen aufbauen und Umsatzwachstum vorantreiben.

Hätten Sie Zeit für einen virtuellen Kaffee am Dienstag um 10 Uhr? Ich würde gerne mehr über Ihre Wachstumsreise erfahren und einige Ideen teilen, die für Ihr Team wertvoll sein könnten.

Ich freue mich auf Ihre Rückmeldung, Maria.`,
  },
  {
    language: MessageLanguage.IT,
    type: 'greeting',
    value: 'Buongiorno [Name],',
  },
  {
    language: MessageLanguage.IT,
    type: 'introduction',
    value: `Dì qualcosa per rompere il ghiaccio in modo professionale e arguto, evitando le tipiche aperture di vendita. Aggiungi un'emoji sorridente (🙂) per mantenere un tono amichevole. L'introduzione deve essere personalizzata ma non incentrata sulla vendita.`,
  },
  {
    language: MessageLanguage.IT,
    type: 'paragraph_1',
    value: 'Parla della persona e della sua azienda in modo personalizzato. Fai riferimento a osservazioni specifiche sulle loro operazioni commerciali o sui risultati recenti. Mostra comprensione delle sfide comuni del settore. Usa un tono empatico ma professionale.',
  },
  {
    language: MessageLanguage.IT,
    type: 'paragraph_2',
    value: `Presenta la tua soluzione affrontando i punti critici identificati. Concentrati sulla proposta di valore e sui benefici senza essere eccessivamente promozionale. Enfatizza come la tua soluzione si allinea alle loro esigenze.`,
  },
  {
    language: MessageLanguage.IT,
    type: 'paragraph_3',
    value: `Suggerisci un orario specifico per un breve incontro virtuale (30 minuti) per discutere di una potenziale collaborazione. Mantienilo informale riferendoti ad esso come un "caffè virtuale".`,
  },
  {
    language: MessageLanguage.IT,
    type: 'goodbye',
    value: `In attesa della tua conferma, [name]`,
  },
  {
    language: MessageLanguage.IT,
    type: 'sample_message',
    value: `Buongiorno Maria,

Non ho potuto fare a meno di notare il tuo ultimo post su LinkedIn mentre prendevo il mio caffè mattutino 🙂

Sono rimasto colpito dalla tua recente espansione del team – scalare così rapidamente mantenendo la qualità non è cosa da poco!

Avendo parlato con altri leader del settore, so che questa fase di crescita spesso comporta delle sfide operative.

La nostra piattaforma ottimizza il flusso di lavoro del tuo team integrando strumenti essenziali in un sistema unificato. Questo significa meno tempo a passare tra le applicazioni e più tempo da dedicare a ciò che conta davvero: costruire relazioni significative con i clienti e guidare la crescita dei ricavi.

Saresti disponibile per un caffè virtuale di 30 minuti martedì alle 10? Mi piacerebbe saperne di più sul tuo percorso di crescita e condividere alcune idee che potrebbero essere preziose per il tuo team.

In attesa della tua conferma, Maria.`,
  },
];
