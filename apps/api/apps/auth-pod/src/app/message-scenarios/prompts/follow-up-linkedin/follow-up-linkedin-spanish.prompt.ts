import { IBuildPromptData } from './follow-up-linkedin-english.prompt';

export function buildFollowUpLinkedinSpanishPrompt(data: IBuildPromptData): string {
  const { messageTemplate, company, messageEntryLeadData, targetCompanyFullInfo} = data;

  let messageTemplateString = `Saludo: ${messageTemplate.greeting}\n\n`;
  
  messageTemplateString += `Introducción (número máximo de palabras de la sección introducción: ${messageTemplate.introduction.wordsLimit}): ${messageTemplate.introduction.text}`;
  messageTemplateString += 'La introducción debe ser personalizada pero no centrada en las ventas.\n\n';

  messageTemplate.paragraphs.forEach((paragraph, index) => {
    messageTemplateString += `Párrafo ${index + 1} (número máximo de palabras del Párrafo ${index + 1}: ${paragraph.wordsLimit}): ${paragraph.text}\n\n`;
  });

  messageTemplateString += `Despedida (número máximo de palabras de la sección despedida: ${messageTemplate.goodbye.wordsLimit}): ${messageTemplate.goodbye.text}\n\n`;

  return `
    ${messageTemplate.objective}

    RESTRICCIÓN CRÍTICA DE FORMATO:
    DEBES generar ÚNICAMENTE el texto del mensaje de seguimiento de LinkedIn.
    PROHIBIDO incluir:
    - Notas explicativas o comentarios: (ej: "Este follow-up está personalizado mediante...", "He incluido referencias a...", "Nota: El follow-up hace referencia a...")
    - Análisis o justificaciones: (ej: "El follow-up destaca los puntos clave...", "Se ha enfocado en...", "El enfoque se centra en...")
    - Metadata o anotaciones: (ej: "Tipo: mensaje de seguimiento", "Personalización: alta", "Destinatario: decisor")
    - Texto después de la despedida: (ej: listas de características incluidas, explicaciones sobre personalizaciones realizadas, análisis del enfoque usado)
    - Cualquier contenido que no sea el follow-up mismo: (ej: "Aquí tienes el follow-up generado:", "Este es el follow-up que he creado:", "A continuación el follow-up:")
    - Frases introductorias: (ej: "Te propongo el siguiente follow-up:", "He generado este follow-up:", "El follow-up quedaría así:")

    El mensaje de seguimiento DEBE terminar en la última línea del texto, sin ningún contenido adicional.

    La hiperpersonalización es OBLIGATORIA y debe basarse en:
    - El perfil profesional del destinatario
    - Su cargo actual y responsabilidades
    - La actividad de LinkedIn proporcionada (tanto personal como de empresa)
    - La descripción y sector de su empresa
    - El contenido de los últimos mensajes enviados (para evitar repetición)
    - Los puntos de conexión entre sus necesidades y tu propuesta de valor

    PRIORIZACIÓN DE CONTENIDO:
    Para asegurar diferenciación con los últimos mensajes:
    - Identificar aspectos del perfil NO mencionados en los últimos contactos
    - Establecer conexiones diferentes entre las publicaciones/actividades y tu propuesta
    - Evitar repetir referencias a contenido ya mencionado en los últimos mensajes

    PARÁMETROS DE ENTRADA:
    Sobre tu empresa:

    Nombre de la empresa: ${company.name}
    Sector: ${company.sector}
    Descripción de la empresa: ${company.shortDescription}

    Tu oferta:

    Nombre del producto/servicio: ${messageEntryLeadData.productService.name}
    Descripción: ${messageEntryLeadData.productService.shortDescription}

    Información de la empresa objetivo:

    Nombre de la empresa: ${targetCompanyFullInfo.data.name}
    Descripción de la empresa: ${targetCompanyFullInfo.data.description}
    Sectores: ${targetCompanyFullInfo.data.industry[0]}
    Actividad en LinkedIn de la empresa objetivo: ${''}
    Últimos mensajes enviados: ${''}

    Información del potencial cliente:

    Nombre: ${messageEntryLeadData.lead.leadData.name}
    Cargo: ${messageEntryLeadData.lead.leadData.current_positions[0].role}
    Descripción del cargo: ${''}
    Resumen profesional: ${messageEntryLeadData.lead.leadData.summary}
    Publicaciones en LinkedIn del potencial cliente: ${''}

    ESTRUCTURA Y FORMATO DEL MENSAJE:

    Longitud máxima total: ${messageEntryLeadData.messageStructure.wordsLimit} palabras
    DEBES seguir exactamente esta estructura: ${messageTemplateString}
    Esta estructura define:

    Secciones obligatorias
    Límites de palabras por sección
    Orden de la información

    MENSAJE DE REFERENCIA:
    Utiliza este mensaje como inspiración para el tono y estilo: ${''}
    Nota: Este es solo un ejemplo de referencia. Tu mensaje debe:

    Seguir la estructura definida en ${messageTemplateString}
    Estar hiperpersonalizado de forma única para tu potencial cliente utilizando TODA la información proporcionada
    Hacer referencia a contenido diferente basado en la información específica de tu potencial cliente
    Establecer conexiones claras entre la información del cliente y tu propuesta de valor

    REQUISITOS DE ENGAGEMENT EN LINKEDIN:
    Si hay publicaciones relevantes:

    Hacer referencia a:
    - Publicaciones de empresa
    - Publicaciones personales del potencial cliente
    - Conectar la actividad con tu propuesta de valor

    RESTRICCIONES DE CONTENIDO:
    - No hacer referencias al clima o tiempo atmosférico
    - No mencionar las estaciones del año ni referencias estacionales
    - Evitar frases como:
      * "Espero que estés teniendo un buen día soleado"
      * "Con la llegada de la primavera..."
      * "En estos días de calor..."
      * "Durante esta temporada..."

    Formato de Nombres de Empresa:
    - Primera letra de cada palabra en mayúscula
    - Convertir nombres en mayúsculas a formato título

    Ejemplos:
    "RIVER ISLAND" debe escribirse como "River Island"
    "GUESS" debe escribirse como "Guess"
    "BANCO SANTANDER" debe escribirse como "Banco Santander"

    Esto se aplica a TODAS las menciones de ${targetCompanyFullInfo.data.name} en el mensaje

    IMPORTANTE: Este prompt debe generar respuestas EXCLUSIVAMENTE en español de España (no de Latinoamérica). Utilizar "vosotros" en lugar de "ustedes", y emplear vocabulario y expresiones propias de España.

    EJEMPLOS DE USO CORRECTO DEL ESPAÑOL DE ESPAÑA:
    - Usar "vosotros" y sus conjugaciones: "¿Estáis interesados...?", "Vuestra empresa..."
    - Terminología española: "ordenador" (no "computadora"), "móvil" (no "celular")
    - Expresiones españolas: "vale", "genial", "venga"
    - Horarios en formato 24h: "11h" o "11:00h" (no "11 AM")
  `;
}