import { IBuildPromptData } from './follow-up-email-english.prompt';

export function buildFollowUpEmailPortuguesePrompt(data: IBuildPromptData): string {
  const { messageTemplate, company, messageEntryLeadData, targetCompanyFullInfo} = data;

  let messageTemplateString = `Saudação: ${messageTemplate.greeting}\n\n`;
  
  messageTemplateString += `Introdução (número máximo de palavras da secção de introdução: ${messageTemplate.introduction.wordsLimit}): ${messageTemplate.introduction.text}`;
  messageTemplateString += 'A introdução deve ser personalizada mas não focada em vendas.\n\n';

  messageTemplate.paragraphs.forEach((paragraph, index) => {
    messageTemplateString += `Parágrafo ${index + 1} (número máximo de palavras do Parágrafo ${index + 1}: ${paragraph.wordsLimit}): ${paragraph.text}\n\n`;
  });

  messageTemplateString += `Despedida (número máximo de palavras da secção de despedida: ${messageTemplate.goodbye.wordsLimit}): ${messageTemplate.goodbye.text}\n\n`;

  return `
    ${messageTemplate.objective}

    RESTRIÇÃO CRÍTICA DE FORMATO:
    DEVE gerar APENAS o texto do email de follow-up.
    PROIBIDO incluir:
    - Notas explicativas ou comentários: (ex: "Este follow-up foi personalizado através de...", "Incluí referências a...", "Nota: O follow-up refere-se a...")
    - Análises ou justificações: (ex: "O follow-up destaca os pontos-chave...", "Concentra-se em...", "A abordagem concentra-se em...")
    - Metadados ou anotações: (ex: "Tipo: email de follow-up", "Personalização: elevada", "Destinatário: decisor")
    - Texto após a despedida: (ex: listas de características incluídas, explicações das personalizações feitas, análise da abordagem utilizada)
    - Qualquer conteúdo que não seja o próprio follow-up: (ex: "Aqui está o follow-up gerado:", "Este é o follow-up que criei:", "Aqui está o follow-up:")
    - Frases introdutórias: (ex: "Sugiro o seguinte follow-up:", "Gerei este follow-up:", "O follow-up seria assim:")

    O email de follow-up DEVE terminar na última linha do texto, sem qualquer conteúdo adicional.

    A hiperpersonalização é OBRIGATÓRIA e deve basear-se em:
    - O perfil profissional do destinatário
    - O seu cargo atual e responsabilidades
    - A atividade no LinkedIn fornecida (tanto pessoal como da empresa)
    - A descrição e setor da sua empresa
    - O conteúdo das últimas mensagens enviadas (para evitar repetição)
    - Os pontos de conexão entre as suas necessidades e a sua proposta de valor

    PRIORIZAÇÃO DE CONTEÚDO:
    Para assegurar diferenciação com as últimas mensagens enviadas:
    - Identificar aspetos do perfil NÃO mencionados nas últimas mensagens
    - Estabelecer conexões diferentes entre as publicações/atividades e a sua proposta
    - Evitar repetir referências a conteúdo já mencionado nas últimas mensagens

    PARÂMETROS DE ENTRADA:
    Sobre a sua empresa:

    Nome da empresa: ${company.name}
    Setor: ${company.sector}
    Descrição da empresa: ${company.shortDescription}

    A sua oferta:

    Nome do produto/serviço: ${messageEntryLeadData.productService.name}
    Descrição: ${messageEntryLeadData.productService.description}

    Informação da empresa-alvo:

    Nome da empresa: ${targetCompanyFullInfo.data.name}
    Descrição da empresa: ${targetCompanyFullInfo.data.description}
    Setores: ${targetCompanyFullInfo.data.industries[0]}
    Atividade no LinkedIn da empresa-alvo: ${''}
    Últimas mensagens enviadas: ${''}

    Informação do potencial cliente:

    Nome: ${messageEntryLeadData.lead.leadData.name}
    Cargo: ${messageEntryLeadData.lead.leadData.current_positions[0].role}
    Descrição do cargo: ${''}
    Resumo profissional: ${messageEntryLeadData.lead.leadData.summary}
    Publicações no LinkedIn do potencial cliente: ${''}

    ESTRUTURA E FORMATO DO EMAIL:

    Comprimento máximo total: ${messageEntryLeadData.messageStructure.wordsLimit} palavras
    DEVE seguir exatamente esta estrutura: ${messageTemplateString}
    Esta estrutura define:

    Secções obrigatórias
    Limites de palavras por secção
    Ordem da informação

    EMAIL DE REFERÊNCIA:
    Utilize este email como inspiração para o tom e estilo: ${''}
    Nota: Este é apenas um exemplo de referência. O seu email deve:

    Seguir esta ESTRUTURA E FORMATO: ${messageTemplateString}
    Estar hiperpersonalizado de forma única para o seu potencial cliente utilizando TODA a informação fornecida
    Fazer referência a conteúdo diferente baseado na informação específica do seu potencial cliente
    Estabelecer conexões claras entre a informação do cliente e a sua proposta de valor

    REQUISITOS DE ENGAGEMENT NO LINKEDIN:
    Se houver publicações relevantes:

    Fazer referência a:
    - Publicações da empresa
    - Publicações pessoais do potencial cliente
    - Conectar a atividade com a sua proposta de valor

    REGRAS IMPORTANTES DE FORMATO:

    RESTRIÇÕES DE CONTEÚDO:
    - Não fazer referências ao clima ou tempo atmosférico
    - Não mencionar as estações do ano nem referências sazonais
    - Evitar frases como:
      * "Espero que estejas a ter um dia solarengo"
      * "Com a chegada da primavera..."
      * "Nestes dias de calor..."
      * "Durante esta temporada..."

    Sem assunto do email
    Sem assinatura
    Usar formato <b>texto</b> para pontos-chave (NUNCA usar asteriscos ** nem qualquer outro formato)
    Evitar linguagem comercial óbvia

    Formato de Nomes de Empresa:
    - Primeira letra de cada palavra em maiúscula
    - Converter nomes em maiúsculas para formato título

    Exemplos:
    "RIVER ISLAND" deve ser escrito como "River Island"
    "GUESS" deve ser escrito como "Guess"
    "BANCO SANTANDER" deve ser escrito como "Banco Santander"

    Isto aplica-se a TODAS as menções de ${targetCompanyFullInfo.data.name} no email

    REQUISITOS DE ETIQUETAS A NEGRITO - OBRIGATÓRIO:
    DEVE usar etiquetas <b> e </b> (NUNCA asteriscos **) para realçar APENAS as frases mais impactantes e relevantes em cada parágrafo. O objetivo é destacar unicamente os pontos-chave, não todo o conteúdo. Cada parágrafo deve conter NO MÁXIMO UMA frase realçada que represente o ponto mais importante.

    DIRETRIZES DE REALCE POR PARÁGRAFO:

    Contextualização:
    - Realçar APENAS a referência mais relevante ao contacto anterior
    CORRETO: "Escrevi-te na semana passada sobre <b>como poderíamos ajudar-vos a otimizar o vosso processo de logística internacional</b>."
    INCORRETO: "<b>Escrevo-te novamente porque não recebi resposta ao meu email anterior sobre logística internacional</b>."

    Valor Acrescentado:
    - Realçar APENAS a nova informação relevante
    CORRETO: "Esta semana <b>publicámos uma análise detalhada sobre como a River Island reduziu os seus custos logísticos em 35%</b>."
    INCORRETO: "<b>Como mencionava no meu último email, ajudámos várias empresas a reduzir os seus custos logísticos</b>."

    Benefício Principal:
    - Realçar APENAS o benefício-chave atualizado
    CORRETO: "Observando os vossos últimos projetos, <b>poderíamos ajudar-vos a alcançar resultados semelhantes em metade do tempo</b>."
    INCORRETO: "<b>Como comentava antes, a nossa solução pode ajudar-vos a reduzir tempos e custos</b>."

    Chamada para Ação:
    - Realçar APENAS a proposta concreta de reunião
    CORRETO: "<b>Seria conveniente uma videochamada de 30 minutos esta quinta-feira às 10h?</b>"
    INCORRETO: "<b>Gostaria de ter a oportunidade de explicar mais detalhes. Seria conveniente uma videochamada?</b>"

    IMPORTANTE: Este prompt deve gerar respostas EXCLUSIVAMENTE em português de Portugal (não do Brasil). Utilizar "vós" em vez de "você", e empregar vocabulário e expressões próprias de Portugal.

    EXEMPLOS DE USO CORRETO DO PORTUGUÊS DE PORTUGAL:
    - Usar "vós" e suas conjugações: "Estais interessados...?", "A vossa empresa..."
    - Terminologia portuguesa: "computador" (não "notebook"), "telemóvel" (não "celular")
    - Expressões portuguesas: "pois", "fixe", "pronto"
    - Horários em formato 24h: "11h" ou "11:00h" (não "11 AM")
  `;
}