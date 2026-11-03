import { IBuildPromptData } from './first-email-english.prompt';

export function buildFirstEmailPortuguesePrompt(data: IBuildPromptData): string {
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
    DEVE gerar APENAS o texto do email.
    PROIBIDO incluir:
    - Notas explicativas ou comentários: (ex: "Este email foi personalizado através de...", "Incluí referências a...", "Nota: O email refere-se a...")
    - Análises ou justificações: (ex: "O email destaca os pontos-chave...", "Concentra-se em...", "A abordagem concentra-se em...")
    - Metadados ou anotações: (ex: "Tipo de email: inicial", "Personalização: elevada", "Destinatário: decisor")
    - Texto após a despedida: (ex: listas de características incluídas, explicações das personalizações feitas, análise da abordagem utilizada)
    - Qualquer conteúdo que não seja o próprio email: (ex: "Aqui está o email gerado:", "Este é o email que criei:", "Aqui está o email:")
    - Frases introdutórias: (ex: "Sugiro o seguinte email:", "Gerei este email:", "O email seria assim:")

    O email DEVE terminar na última linha do texto, sem qualquer conteúdo adicional.

    PARÂMETROS DE ENTRADA:

    Sobre a tua empresa:

    Nome da empresa: ${company.name}
    Setor: ${company.sector}
    Descrição da empresa: ${company.shortDescription}

    A tua oferta:

    Nome do produto/serviço: ${messageEntryLeadData.productService.name}
    Descrição: ${messageEntryLeadData.productService.shortDescription}

    Informação da empresa-alvo:

    Nome da empresa: ${targetCompanyFullInfo.data.name}
    Descrição da empresa: ${targetCompanyFullInfo.data.description}
    Setores: ${targetCompanyFullInfo.data.industry[0]}
    Publicações recentes no LinkedIn da empresa-alvo: ${''} (OBRIGATÓRIO mencioná-las se disponíveis)

    Informação do potencial cliente:

    Nome: ${messageEntryLeadData.lead.leadData.name}
    Cargo: ${messageEntryLeadData.lead.leadData.current_positions[0].role}
    Descrição do cargo: ${''}
    Resumo profissional: ${messageEntryLeadData.lead.leadData.summary}
    Publicações recentes no LinkedIn do potencial cliente: ${''} (OBRIGATÓRIO mencioná-las se disponíveis

    ESTRUTURA E FORMATO DO EMAIL:

    Comprimento máximo total: ${messageEntryLeadData.messageStructure.wordsLimit}
    DEVES seguir exatamente esta estrutura: ${messageTemplateString}

    Esta estrutura define:

    Secções obrigatórias,
    Limites de palavras por secção,
    Ordem da informação

    EMAIL DE REFERÊNCIA:
    Utiliza este email como inspiração para o tom e estilo: ${messageTemplate.sampleMessage}

    Nota: Este é apenas um exemplo de referência. O teu email deve:

    - Seguir esta ESTRUTURA E FORMATO: ${messageTemplateString}
    - Estar personalizado de forma única para o teu potencial cliente
    - Fazer referência a conteúdo diferente baseado na informação do teu potencial cliente

    REQUISITOS DE ENGAGEMENT NO LINKEDIN:
    Se houver publicações do LinkedIn disponíveis:

    É OBRIGATÓRIO fazer referência a conteúdo específico das suas publicações mais recentes previamente mencionadas na introdução:

    Publicações recentes no LinkedIn do potencial cliente e publicações recentes no LinkedIn da empresa-alvo. As publicações recentes no LinkedIn do potencial cliente têm prioridade.

    Utilizar a atividade no LinkedIn para demonstrar compreensão das suas prioridades atuais
    Conectar o seu conteúdo publicado com a proposta de valor
    Mostrar como a tua solução se relaciona com os temas que estão a discutir ativamente

    REGRAS IMPORTANTES DE FORMATAÇÃO:

    RESTRIÇÕES DE CONTEÚDO:
    - Não fazer referências ao clima ou tempo atmosférico
    - Não mencionar as estações do ano nem referências sazonais
    - Evitar frases como:
      * "Espero que estejas a ter um bom dia de sol"
      * "Com a chegada da primavera..."
      * "Nestes dias de calor..."
      * "Durante esta temporada..."

    Sem assunto do email
    Sem assinatura
    Usar formato <b>texto</b> para pontos-chave (NUNCA usar asteriscos ** nem qualquer outro formato)
    Evitar linguagem comercial óbvia

    Formato de Nomes de Empresa:

    Primeira letra de cada palavra em maiúscula
    Converter nomes em maiúsculas para formato título

    Exemplos:
    "RIVER ISLAND" deve escrever-se como "River Island"
    "GUESS" deve escrever-se como "Guess"
    "BANCO SANTANDER" deve escrever-se como "Banco Santander"

    Isto aplica-se a TODAS as menções de ${targetCompanyFullInfo.data.name} no email

    REQUISITOS DE ETIQUETAS A NEGRITO - OBRIGATÓRIO:
    DEVES usar etiquetas <b> e </b> (NUNCA asteriscos **) para realçar APENAS as frases mais impactantes e relevantes em cada parágrafo. O objetivo é destacar unicamente os pontos-chave, não todo o conteúdo. Cada parágrafo deve conter NO MÁXIMO UMA frase realçada que represente o ponto mais importante.

    DIRETRIZES DE REALCE POR PARÁGRAFO:

    Parágrafo de Abertura/Introdução:

    Realçar APENAS a observação mais relevante sobre o potencial cliente
    CORRETO: "Tenho seguido o vosso trabalho e <b>a vossa recente implementação de soluções sustentáveis conseguiu reduzir o impacto ambiental em 40%</b>"
    INCORRETO: "<b>Tenho seguido o vosso trabalho e a vossa recente implementação de soluções sustentáveis conseguiu reduzir o impacto ambiental em 40%</b>"

    Parágrafo de Proposta de Valor:

    Realçar APENAS o benefício principal ou diferenciador-chave
    CORRETO: "A nossa plataforma oferece múltiplas funcionalidades, e <b>conseguimos reduzir os custos operacionais em 30% para empresas semelhantes</b>"
    INCORRETO: "<b>A nossa plataforma oferece múltiplas funcionalidades, e conseguimos reduzir os custos operacionais em 30% para empresas semelhantes</b>"

    Parágrafo de Prova Social:

    Realçar APENAS a conquista ou resultado mais impactante
    CORRETO: "Colaboramos com diversos clientes do setor e <b>ajudámos a River Island a aumentar a sua eficiência em 45%</b>"
    INCORRETO: "<b>Colaboramos com diversos clientes do setor e ajudámos a River Island a aumentar a sua eficiência em 45%</b>"

    Parágrafo de Chamada para Ação:

    Realçar APENAS a proposta concreta de reunião
    CORRETO: "<b>Seria possível um café virtual de 30 minutos na próxima quinta-feira às 11h?</b>"
    INCORRETO: "<b>Adoraria ter a oportunidade de nos reunirmos. Seria possível um café virtual de 30 minutos na próxima quinta-feira às 11h?</b>"

    REGRAS GERAIS DE REALCE:

    Máximo UMA frase a negrito por parágrafo
    Realçar APENAS o ponto mais importante ou impactante
    Evitar realçar informação contextual ou conectores
    As frases a negrito devem poder ler-se de forma independente e manter sentido completo
    O texto realçado não deve ultrapassar 25% do conteúdo total do email

    EXEMPLOS DE EQUILÍBRIO CORRETO:

    BOM (Realce seletivo):
    "Bom dia João,
    Tenho seguido o vosso percurso e <b>a vossa recente expansão internacional gerou resultados excecionais</b>.
    A partir da nossa consultoria especializada, <b>ajudámos empresas semelhantes a reduzir os seus custos de expansão em 40%</b>.
    Trabalhamos com múltiplos clientes do setor e <b>recentemente ajudámos a Company X a completar a sua expansão 50% mais rapidamente</b>.
    <b>Seria possível uma reunião na quinta-feira às 11h para partilhar a nossa experiência?</b>
    Cumprimentos,"

    MAU (Demasiado realce):
    "<b>Bom dia João,
    Tenho seguido o vosso percurso e a vossa recente expansão internacional gerou resultados excecionais.
    A partir da nossa consultoria especializada, ajudámos empresas semelhantes a reduzir os seus custos de expansão em 40%.
    Trabalhamos com múltiplos clientes do setor e recentemente ajudámos a Company X a completar a sua expansão 50% mais rapidamente.
    Seria possível uma reunião na quinta-feira às 11h para partilhar a nossa experiência?</b>
    Cumprimentos,"

    REQUISITOS DE PERSONALIZAÇÃO:

    Deve fazer referência a pelo menos um detalhe específico de:

    As suas publicações no LinkedIn (se disponíveis)
    Descrição da empresa
    Função e responsabilidades
    Contexto do setor

    Mostrar clara investigação e compreensão do seu negócio
    Conectar os seus desafios com a vossa solução sem ser promocional

    A tua resposta deve conter APENAS o texto do email, seguindo a estrutura fornecida enquanto utilizas o email de exemplo como referência para o tom e estilo. Cria uma mensagem altamente personalizada que demonstre que reviste exaustivamente o seu perfil e compreendes o seu contexto.

    IMPORTANTE: Este prompt deve gerar respostas EXCLUSIVAMENTE em português de Portugal (não do Brasil). Utilizar "vós" em vez de "você", e empregar vocabulário e expressões próprias de Portugal.

    EXEMPLOS DE USO CORRETO DO PORTUGUÊS DE PORTUGAL:

    Usar o tratamento formal: "vós" e suas conjugações
    Terminologia portuguesa: "telemóvel" (não "celular"), "comboio" (não "trem")
    Expressões portuguesas: "pois", "pronto", "ora bem"
    Horários em formato 24h: "11h" ou "11:00h" (não "11 AM")
    Ortografia portuguesa: "ação" (não "ação"), "atual" (não "atual")
  `;
}