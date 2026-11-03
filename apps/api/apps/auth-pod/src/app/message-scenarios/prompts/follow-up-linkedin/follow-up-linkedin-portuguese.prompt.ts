import { IBuildPromptData } from './follow-up-linkedin-english.prompt';

export function buildFollowUpLinkedinPortuguesePrompt(data: IBuildPromptData): string {
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
    DEVE gerar APENAS o texto da mensagem de follow-up LinkedIn.
    PROIBIDO incluir:
    - Notas explicativas ou comentários: (ex: "Este follow-up foi personalizado através de...", "Incluí referências a...", "Nota: O follow-up refere-se a...")
    - Análises ou justificações: (ex: "O follow-up destaca os pontos-chave...", "Concentra-se em...", "A abordagem concentra-se em...")
    - Metadados ou anotações: (ex: "Tipo: mensagem de follow-up", "Personalização: elevada", "Destinatário: decisor")
    - Texto após a despedida: (ex: listas de características incluídas, explicações das personalizações feitas, análise da abordagem utilizada)
    - Qualquer conteúdo que não seja o próprio follow-up: (ex: "Aqui está o follow-up gerado:", "Este é o follow-up que criei:", "Aqui está o follow-up:")
    - Frases introdutórias: (ex: "Sugiro o seguinte follow-up:", "Gerei este follow-up:", "O follow-up seria assim:")

    A mensagem de follow-up DEVE terminar na última linha do texto, sem qualquer conteúdo adicional.

    A hiperpersonalização é OBRIGATÓRIA e deve basear-se em:
    - O perfil profissional do destinatário
    - O seu cargo atual e responsabilidades
    - A atividade no LinkedIn fornecida (tanto pessoal como da empresa)
    - A descrição e setor da sua empresa
    - O conteúdo das últimas mensagens enviadas (para evitar repetição)
    - Os pontos de ligação entre as suas necessidades e a sua proposta de valor

    PRIORIZAÇÃO DE CONTEÚDO:
    Para garantir diferenciação com as últimas mensagens:
    - Identificar aspetos do perfil NÃO mencionados nos últimos contactos
    - Estabelecer ligações diferentes entre as publicações/atividades e a sua proposta
    - Evitar repetir referências a conteúdo já mencionado nas últimas mensagens

    PARÂMETROS DE ENTRADA:
    Sobre a sua empresa:

    Nome da empresa: ${company.name}
    Setor: ${company.sector}
    Descrição da empresa: ${company.description}

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

    ESTRUTURA E FORMATO DA MENSAGEM:

    Comprimento máximo total: ${messageEntryLeadData.messageStructure.wordsLimit} palavras
    DEVE seguir exatamente esta estrutura: ${messageTemplateString}
    Esta estrutura define:

    Secções obrigatórias
    Limites de palavras por secção
    Ordem da informação

    MENSAGEM DE REFERÊNCIA:
    Utilize esta mensagem como inspiração para o tom e estilo: ${''}
    Nota: Este é apenas um exemplo de referência. A sua mensagem deve:

    Seguir a estrutura definida em ${messageTemplateString}
    Estar hiperpersonalizada de forma única para o seu potencial cliente utilizando TODA a informação fornecida
    Fazer referência a conteúdo diferente baseado na informação específica do seu potencial cliente
    Estabelecer ligações claras entre a informação do cliente e a sua proposta de valor

    REQUISITOS DE ENGAGEMENT NO LINKEDIN:
    Se houver publicações relevantes:

    Fazer referência a:
    - Publicações da empresa
    - Publicações pessoais do potencial cliente
    - Ligar a atividade à sua proposta de valor

    RESTRIÇÕES DE CONTEÚDO:
    - Não fazer referências ao clima ou tempo atmosférico
    - Não mencionar as estações do ano nem referências sazonais
    - Evitar frases como:
      * "Espero que estejas a ter um dia solarengo"
      * "Com a chegada da primavera..."
      * "Nestes dias de calor..."
      * "Durante esta temporada..."

    Formato de Nomes de Empresa:
    - Primeira letra de cada palavra em maiúscula
    - Converter nomes em maiúsculas para formato título

    Exemplos:
    "RIVER ISLAND" deve escrever-se como "River Island"
    "GUESS" deve escrever-se como "Guess"
    "BANCO SANTANDER" deve escrever-se como "Banco Santander"

    Isto aplica-se a TODAS as menções de ${targetCompanyFullInfo.data.name} na mensagem

    IMPORTANTE: Este prompt deve gerar respostas EXCLUSIVAMENTE em português de Portugal (não do Brasil). Utilizar "tu" em vez de "você", e empregar vocabulário e expressões próprias de Portugal.

    EXEMPLOS DE USO CORRETO DO PORTUGUÊS DE PORTUGAL:
    - Usar "tu" e as suas conjugações: "Estás interessado...?", "A tua empresa..."
    - Terminologia portuguesa: "computador" (não "laptop"), "telemóvel" (não "celular")
    - Expressões portuguesas: "pois", "fixe", "ora bem"
    - Horários em formato 24h: "11h" ou "11:00h" (não "11 AM")
  `;
}