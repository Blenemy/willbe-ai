import { IBuildPromptData } from './linkedin-connection-english.prompt';

export function buildLinkedinConnectionSpanishPrompt(data: IBuildPromptData): string {
  const { messageTemplate, company, messageEntryLeadData, targetCompanyFullInfo} = data;

  return `
    ${messageTemplate.objective}

    RESTRICCIÓN CRÍTICA DE FORMATO:
    DEBES generar ÚNICAMENTE el texto del mensaje de conexión.
    PROHIBIDO incluir:
    - Notas explicativas o comentarios: (ej: "Este mensaje está personalizado mediante...", "He incluido referencias a...", "Nota: El mensaje hace referencia a...")
    - Análisis o justificaciones: (ej: "El mensaje destaca los puntos clave...", "Se ha enfocado en...", "El enfoque se centra en...")
    - Metadata o anotaciones: (ej: "Tipo: mensaje de conexión", "Personalización: alta", "Destinatario: decisor")
    - Texto después de la despedida: (ej: listas de características incluidas, explicaciones sobre personalizaciones realizadas, análisis del enfoque usado)
    - Cualquier contenido que no sea el mensaje mismo: (ej: "Aquí tienes el mensaje generado:", "Este es el mensaje que he creado:", "A continuación el mensaje:")
    - Frases introductorias: (ej: "Te propongo el siguiente mensaje:", "He generado este mensaje:", "El mensaje quedaría así:")

    El mensaje DEBE terminar en la última línea del texto, sin ningún contenido adicional. Recuerda que este mensaje tiene un límite de 200 caracteres.

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
    Publicaciones recientes en LinkedIn de la empresa objetivo: ${''} (OBLIGATORIO mencionarla si está disponible)

    Información del potencial cliente:
    Nombre: ${messageEntryLeadData.lead.leadData.name}
    Cargo: ${messageEntryLeadData.lead.leadData.current_positions[0].role}
    Descripción del cargo: ${''}
    Resumen profesional: ${messageEntryLeadData.lead.leadData.summary}
    Publicaciones recientes en LinkedIn del potencial cliente: ${''} (OBLIGATORIO mencionarlas si están disponibles)

    ESTRUCTURA Y FORMATO DEL MENSAJE:
    Longitud máxima ESTRICTA: 200 caracteres (incluyendo espacios y signos de puntuación)
    IMPORTANTE: El mensaje será rechazado si supera los 200 caracteres
    Nota: Esta restricción tiene prioridad sobre ${messageEntryLeadData.messageStructure.wordsLimit} palabras

    MENSAJE DE REFERENCIA:
    Utiliza este mensaje como inspiración para el tono y estilo: ${messageTemplate.sampleMessage}
    Nota: Este es un ejemplo de referencia. Tu mensaje debe:
    - Estar personalizado de forma única para tu potencial cliente
    - Hacer referencia a contenido diferente basado en la información de tu potencial cliente
    - Ajustarse estrictamente al límite de 200 caracteres

    REQUISITOS DE ENGAGEMENT EN LINKEDIN:
    Si hay publicaciones de LinkedIn disponibles:
    ES OBLIGATORIO hacer referencia a contenido específico de sus publicaciones más recientes:
    - Publicaciones recientes en LinkedIn del potencial cliente y publicaciones recientes en LinkedIn de la empresa objetivo
    - Las publicaciones recientes en LinkedIn del potencial cliente tienen prioridad
    - Utilizar su actividad en LinkedIn para demostrar comprensión de sus prioridades actuales
    - Conectar su contenido publicado con la propuesta de valor
    - Mostrar cómo tu solución se relaciona con los temas que están discutiendo activamente

    REGLAS IMPORTANTES DE FORMATO:
    - Tono profesional pero cercano
    - Evitar lenguaje comercial obvio
    - Ser conciso y directo debido al límite de 200 caracteres

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
    - "RIVER ISLAND" debe escribirse como "River Island"
    - "GUESS" debe escribirse como "Guess"
    - "BANCO SANTANDER" debe escribirse como "Banco Santander"
    Esto se aplica a TODAS las menciones de ${targetCompanyFullInfo.data.name} en el mensaje

    REQUISITOS DE PERSONALIZACIÓN:
    Debe hacer referencia a al menos un detalle específico de:
    - Sus publicaciones de LinkedIn (si están disponibles)
    - Descripción de la empresa
    - Rol y responsabilidades
    - Contexto del sector
    - Mostrar clara investigación y comprensión de su negocio
    - Conectar sus retos con vuestra solución sin ser promocional

    Tu respuesta debe contener SOLO el texto del mensaje de conexión, usando el mensaje de ejemplo como referencia para el tono y estilo. Crea un mensaje altamente personalizado que demuestre que has revisado exhaustivamente su perfil y comprendes su contexto.

    IMPORTANTE: Este prompt debe generar respuestas EXCLUSIVAMENTE en español de España (no de Latinoamérica). Utilizar "vosotros" en lugar de "ustedes", y emplear vocabulario y expresiones propias de España.

    EJEMPLOS DE USO CORRECTO DEL ESPAÑOL DE ESPAÑA:
    - Usar "vosotros" y sus conjugaciones: "¿Estáis interesados...?", "Vuestra empresa..."
    - Terminología española: "ordenador" (no "computadora"), "móvil" (no "celular")
    - Expresiones españolas: "vale", "genial", "venga"
    - Horarios en formato 24h: "11h" o "11:00h" (no "11 AM")
  `;
}
