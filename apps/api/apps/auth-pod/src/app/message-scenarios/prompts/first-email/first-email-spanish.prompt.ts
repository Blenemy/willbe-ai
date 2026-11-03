import { IBuildPromptData } from './first-email-english.prompt';

export function buildFirstEmailSpanishPrompt(data: IBuildPromptData): string {
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
    DEBES generar ÚNICAMENTE el texto del email.
    PROHIBIDO incluir:
    - Notas explicativas o comentarios: (ej: "Este email está personalizado mediante...", "He incluido referencias a...", "Nota: El email hace referencia a...")
    - Análisis o justificaciones: (ej: "El email destaca los puntos clave...", "Se ha enfocado en...", "El enfoque se centra en...")
    - Metadata o anotaciones: (ej: "Tipo de email: inicial", "Personalización: alta", "Destinatario: decisor")
    - Texto después de la despedida: (ej: listas de características incluidas, explicaciones sobre personalizaciones realizadas, análisis del enfoque usado)
    - Cualquier contenido que no sea el email mismo: (ej: "Aquí tienes el email generado:", "Este es el email que he creado:", "A continuación el email:")
    - Frases introductorias: (ej: "Te propongo el siguiente email:", "He generado este email:", "El email quedaría así:")

    El email DEBE terminar en la última línea del texto, sin ningún contenido adicional.

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
    Publicaciones recientes en LinkedIn de la empresa objetivo: ${''}

    Información del potencial cliente:

    Nombre: ${messageEntryLeadData.lead.leadData.name}
    Cargo: ${messageEntryLeadData.lead.leadData.current_positions[0].role}
    Descripción del cargo: ${''}
    Resumen profesional: ${messageEntryLeadData.lead.leadData.summary}
    Publicaciones recientes en LinkedIn del potencial cliente: ${''}

    ESTRUCTURA Y FORMATO DEL EMAIL:

    Longitud máxima total: ${messageEntryLeadData.messageStructure.wordsLimit}
    DEBES seguir exactamente esta estructura: ${messageTemplateString}

    Esta estructura define:

    Secciones obligatorias,
    Límites de palabras por sección,
    órden de la información

    EMAIL DE REFERENCIA:
    Utiliza este email como inspiración para el tono y estilo: ${messageTemplate.sampleMessage}

    Nota: Este es solo un ejemplo de referencia. Tu email debe:

    - Seguir esta ESTRUCTURA Y FORMATO: ${messageTemplateString}
    - Estar personalizado de forma única para tu potencial cliente
    - Hacer referencia a contenido diferente basado en la información de tu potencial cliente

    REQUISITOS DE ENGAGEMENT EN LINKEDIN:
    Si hay publicaciones de LinkedIn disponibles:

    ES OBLIGATORIO hacer referencia a contenido específico de sus publicaciones más recientes previamente mencionadas en la introducción:

    Publicaciones recientes en LinkedIn del potencial cliente y publicaciones recientes en LinkedIn de la empresa objetivo. Las publicaciones recientes en LinkedIn del potencial cliente tienen prioridad.

    Utilizar la actividad en LinkedIn para demostrar comprensión de sus prioridades actuales
    Conectar su contenido publicado con la propuesta de valor
    Mostrar cómo tu solución se relaciona con los temas que están discutiendo activamente

    REGLAS IMPORTANTES DE FORMATO:

    RESTRICCIONES DE CONTENIDO:
    - No hacer referencias al clima o tiempo atmosférico
    - No mencionar las estaciones del año ni referencias estacionales
    - Evitar frases como:
      * "Espero que estés teniendo un buen día soleado"
      * "Con la llegada de la primavera..."
      * "En estos días de calor..."
      * "Durante esta temporada..."

    Sin asunto del email
    Sin firma
    Usar formato <b>texto</b> para puntos clave (NUNCA usar asteriscos ** ni ningún otro formato)
    Evitar lenguaje comercial obvio

    Formato de Nombres de Empresa:

    Primera letra de cada palabra en mayúscula
    Convertir nombres en mayúsculas a formato título

    Ejemplos:
    "RIVER ISLAND" debe escribirse como "River Island"
    "GUESS" debe escribirse como "Guess"
    "BANCO SANTANDER" debe escribirse como "Banco Santander"

    Esto se aplica a TODAS las menciones de ${targetCompanyFullInfo.data.name}

    REQUISITOS DE ETIQUETAS EN NEGRITA - OBLIGATORIO:
    DEBES usar etiquetas <b> y </b> (NUNCA asteriscos **) para resaltar SOLO las frases más impactantes y relevantes en cada párrafo. El objetivo es destacar únicamente los puntos clave, no todo el contenido. Cada párrafo debe contener COMO MÁXIMO UNA frase resaltada que represente el punto más importante.

    DIRECTRICES DE RESALTADO POR PÁRRAFO:

    Párrafo de Apertura/Introducción:

    Resaltar SOLO la observación más relevante sobre el potencial cliente
    CORRECTO: "He seguido vuestro trabajo y <b>vuestra reciente implementación de soluciones sostenibles ha logrado reducir el impacto ambiental en un 40%</b>"
    INCORRECTO: "<b>He seguido vuestro trabajo y vuestra reciente implementación de soluciones sostenibles ha logrado reducir el impacto ambiental en un 40%</b>"

    Párrafo de Propuesta de Valor:

    Resaltar SOLO el beneficio principal o diferenciador clave
    CORRECTO: "Nuestra plataforma ofrece múltiples funcionalidades, y <b>hemos conseguido reducir los costes operativos en un 30% para empresas similares</b>"
    INCORRECTO: "<b>Nuestra plataforma ofrece múltiples funcionalidades, y hemos conseguido reducir los costes operativos en un 30% para empresas similares</b>"

    Párrafo de Prueba Social:

    Resaltar SOLO el logro o resultado más impactante
    CORRECTO: "Colaboramos con diversos clientes del sector y <b>hemos ayudado a River Island a aumentar su eficiencia en un 45%</b>"
    INCORRECTO: "<b>Colaboramos con diversos clientes del sector y hemos ayudado a River Island a aumentar su eficiencia en un 45%</b>"

    Párrafo de Llamada a la Acción:

    Resaltar SOLO la propuesta concreta de reunión
    CORRECTO: "<b>¿Os vendría bien un café virtual de 30 minutos el próximo jueves a las 11h?</b>"
    INCORRECTO: "<b>Me encantaría tener la oportunidad de reunirnos. ¿Os vendría bien un café virtual de 30 minutos el próximo jueves a las 11h?</b>"

    REGLAS GENERALES DE RESALTADO:

    Máximo UNA frase en negrita por párrafo
    Resaltar SOLO el punto más importante o impactante
    Evitar resaltar información contextual o conectores
    Las frases en negrita deben poder leerse de forma independiente y mantener sentido completo
    El texto resaltado no debe superar el 25% del contenido total del email

    EJEMPLOS DE BALANCE CORRECTO:

    BUENO (Resaltado selectivo):
    "Buenos días Juan,
    He seguido vuestra trayectoria y <b>vuestra reciente expansión internacional ha generado resultados excepcionales</b>.
    Desde nuestra consultoría especializada, <b>hemos ayudado a empresas similares a reducir sus costes de expansión en un 40%</b>.
    Trabajamos con múltiples clientes del sector y <b>recientemente ayudamos a Company X a completar su expansión un 50% más rápido</b>.
    <b>¿Os vendría bien una reunión el jueves a las 11h para compartir nuestra experiencia?</b>
    Saludos cordiales,"

    MALO (Demasiado resaltado):
    "<b>Buenos días Juan,
    He seguido vuestra trayectoria y vuestra reciente expansión internacional ha generado resultados excepcionales.
    Desde nuestra consultoría especializada, hemos ayudado a empresas similares a reducir sus costes de expansión en un 40%.
    Trabajamos con múltiples clientes del sector y recientemente ayudamos a Company X a completar su expansión un 50% más rápido.
    ¿Os vendría bien una reunión el jueves a las 11h para compartir nuestra experiencia?</b>
    Saludos cordiales,"

    REQUISITOS DE PERSONALIZACIÓN:

    Debe hacer referencia a al menos un detalle específico de:

    Sus publicaciones de LinkedIn (si están disponibles)
    Descripción de la empresa
    Rol y responsabilidades
    Contexto del sector

    Mostrar clara investigación y comprensión de su negocio
    Conectar sus retos con vuestra solución sin ser promocional

    Tu respuesta debe contener SOLO el texto del email, siguiendo la estructura proporcionada mientras utilizas el email de ejemplo como referencia para el tono y estilo. Crea un mensaje altamente personalizado que demuestre que has revisado exhaustivamente su perfil y comprendes su contexto.

    IMPORTANTE: Este prompt debe generar respuestas EXCLUSIVAMENTE en español de España (no de Latinoamérica). Utilizar "vosotros" en lugar de "ustedes", y emplear vocabulario y expresiones propias de España.

    EJEMPLOS DE USO CORRECTO DEL ESPAÑOL DE ESPAÑA:

    Usar "vosotros" y sus conjugaciones: "¿Estáis interesados...?", "Vuestra empresa..."
    Terminología española: "ordenador" (no "computadora"), "móvil" (no "celular")
    Expresiones españolas: "vale", "genial", "venga"
    Horarios en formato 24h: "11h" o "11:00h" (no "11 AM")
  `;
}