import { IBuildPromptData } from './linkedin-connection-english.prompt';

export function buildLinkedinConnectionPortuguesePrompt(data: IBuildPromptData): string {
  const { messageTemplate, company, messageEntryLeadData, targetCompanyFullInfo} = data;

  return `
    ${messageTemplate.objective}

    RESTRIÇÃO CRÍTICA DE FORMATO:
    DEVE gerar APENAS o texto da mensagem de conexão.
    PROIBIDO incluir:
    - Notas explicativas ou comentários: (ex: "Esta mensagem foi personalizada através de...", "Incluí referências a...", "Nota: A mensagem refere-se a...")
    - Análises ou justificações: (ex: "A mensagem destaca os pontos-chave...", "Concentra-se em...", "A abordagem concentra-se em...")
    - Metadados ou anotações: (ex: "Tipo: mensagem de conexão", "Personalização: elevada", "Destinatário: decisor")
    - Texto após a despedida: (ex: listas de características incluídas, explicações das personalizações feitas, análise da abordagem utilizada)
    - Qualquer conteúdo que não seja a própria mensagem: (ex: "Aqui está a mensagem gerada:", "Esta é a mensagem que criei:", "Aqui está a mensagem:")
    - Frases introdutórias: (ex: "Sugiro a seguinte mensagem:", "Gerei esta mensagem:", "A mensagem seria assim:")

    A mensagem DEVE terminar na última linha do texto, sem qualquer conteúdo adicional. Lembre-se que esta mensagem tem um limite de 200 caracteres.

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
    Publicações recentes no LinkedIn do potencial cliente: ${''} (OBRIGATÓRIO mencioná-las se disponíveis)

    ESTRUTURA E FORMATO DA MENSAGEM:
    Comprimento máximo ESTRITO: 200 caracteres (incluindo espaços e pontuação)
    IMPORTANTE: A mensagem será rejeitada se exceder 200 caracteres
    Nota: Esta restrição tem precedência sobre ${messageEntryLeadData.messageStructure.wordsLimit} palavras

    MENSAGEM DE REFERÊNCIA:
    Utiliza esta mensagem como inspiração para o tom e estilo: ${messageTemplate.sampleMessage}
    Nota: Este é um exemplo de referência. A tua mensagem deve:
    - Estar personalizada de forma única para o teu potencial cliente
    - Fazer referência a conteúdo diferente baseado na informação do teu potencial cliente
    - Respeitar rigorosamente o limite de 200 caracteres

    REQUISITOS DE ENGAGEMENT NO LINKEDIN:
    Se houver publicações do LinkedIn disponíveis:
    É OBRIGATÓRIO fazer referência a conteúdo específico das suas publicações mais recentes:
    - Publicações recentes no LinkedIn do potencial cliente e publicações recentes no LinkedIn da empresa-alvo
    - As publicações recentes no LinkedIn do potencial cliente têm prioridade
    - Utilizar a sua atividade no LinkedIn para demonstrar compreensão das suas prioridades atuais
    - Conectar o seu conteúdo publicado com a proposta de valor
    - Mostrar como a tua solução se relaciona com os temas que estão a discutir ativamente

    REGRAS IMPORTANTES DE FORMATO:
    - Tom profissional mas próximo
    - Evitar linguagem comercial óbvia
    - Ser conciso e direto devido ao limite de 200 caracteres

    RESTRIÇÕES DE CONTEÚDO:
    - Não fazer referências ao clima ou tempo atmosférico
    - Não mencionar as estações do ano nem referências sazonais
    - Evitar frases como:
      * "Espero que estejas a ter um bom dia de sol"
      * "Com a chegada da primavera..."
      * "Nestes dias de calor..."
      * "Durante esta época..."

    Formato de Nomes de Empresa:
    - Primeira letra de cada palavra em maiúscula
    - Converter nomes em maiúsculas para formato título
    Exemplos:
    - "RIVER ISLAND" deve escrever-se como "River Island"
    - "GUESS" deve escrever-se como "Guess"
    - "BANCO SANTANDER" deve escrever-se como "Banco Santander"
    Isto aplica-se a TODAS as menções de ${targetCompanyFullInfo.data.name} na mensagem

    REQUISITOS DE PERSONALIZAÇÃO:
    Deve fazer referência a pelo menos um detalhe específico de:
    - As suas publicações no LinkedIn (se disponíveis)
    - Descrição da empresa
    - Função e responsabilidades
    - Contexto do setor
    - Mostrar clara investigação e compreensão do seu negócio
    - Conectar os seus desafios com a tua solução sem ser promocional

    A tua resposta deve conter APENAS o texto da mensagem de conexão, utilizando a mensagem exemplo como referência para o tom e estilo. Cria uma mensagem altamente personalizada que demonstre que analisaste exaustivamente o seu perfil e compreendes o seu contexto.

    IMPORTANTE: Este prompt deve gerar respostas EXCLUSIVAMENTE em português de Portugal. Utilizar "tu" em vez de "você", e empregar vocabulário e expressões próprias de Portugal.

    EXEMPLOS DE USO CORRETO DO PORTUGUÊS DE PORTUGAL:
    - Usar "tu" e suas conjugações: "Estás interessado...?", "A tua empresa..."
    - Terminologia portuguesa: "computador" (não "laptop"), "telemóvel" (não "celular")
    - Expressões portuguesas: "pois", "fixe", "ora bem"
    - Horários em formato 24h: "11h" ou "11:00h" (não "11 AM")
  `;
}
