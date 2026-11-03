import { IBuildPromptData } from './follow-up-linkedin-english.prompt';

export function buildFollowUpLinkedinItalianPrompt(data: IBuildPromptData): string {
  const { messageTemplate, company, messageEntryLeadData, targetCompanyFullInfo} = data;

  let messageTemplateString = `Saluto: ${messageTemplate.greeting}\n\n`;
  
  messageTemplateString += `Introduzione (numero massimo di parole della sezione introduzione: ${messageTemplate.introduction.wordsLimit}): ${messageTemplate.introduction.text}`;
  messageTemplateString += 'L\'introduzione dovrebbe essere personalizzata ma non focalizzata sulla vendita.\n\n';

  messageTemplate.paragraphs.forEach((paragraph, index) => {
    messageTemplateString += `Paragrafo ${index + 1} (numero massimo di parole del Paragrafo ${index + 1}: ${paragraph.wordsLimit}): ${paragraph.text}\n\n`;
  });

  messageTemplateString += `Congedo (numero massimo di parole della sezione congedo: ${messageTemplate.goodbye.wordsLimit}): ${messageTemplate.goodbye.text}\n\n`;

  return `
    ${messageTemplate.objective}

    RESTRIZIONE CRITICA DI FORMATO:
    DEVI generare SOLO il testo del messaggio di follow-up LinkedIn.
    VIETATO includere:
    - Note esplicative o commenti: (es: "Questo follow-up è personalizzato attraverso...", "Ho incluso riferimenti a...", "Nota: Il follow-up fa riferimento a...")
    - Analisi o giustificazioni: (es: "Il follow-up evidenzia i punti chiave...", "Si concentra su...", "L'approccio si concentra su...")
    - Metadati o annotazioni: (es: "Tipo: messaggio di follow-up", "Personalizzazione: alta", "Target: decisore")
    - Testo dopo i saluti: (es: elenchi di caratteristiche incluse, spiegazioni delle personalizzazioni fatte, analisi dell'approccio utilizzato)
    - Qualsiasi contenuto che non sia il follow-up stesso: (es: "Ecco il follow-up generato:", "Questo è il follow-up che ho creato:", "Ecco il follow-up:")
    - Frasi introduttive: (es: "Suggerisco il seguente follow-up:", "Ho generato questo follow-up:", "Il follow-up sarebbe così:")

    Il messaggio di follow-up DEVE terminare all'ultima riga del testo, senza alcun contenuto aggiuntivo.

    L'iperpersonalizzazione è OBBLIGATORIA e deve basarsi su:
    - Il profilo professionale del destinatario
    - La sua posizione attuale e le responsabilità
    - L'attività su LinkedIn fornita (sia personale che aziendale)
    - La descrizione e il settore della sua azienda
    - Il contenuto degli ultimi messaggi inviati (per evitare ripetizioni)
    - I punti di connessione tra le sue esigenze e la vostra proposta di valore

    PRIORITIZZAZIONE DEL CONTENUTO:
    Per garantire differenziazione con gli ultimi messaggi:
    - Identificare aspetti del profilo NON menzionati negli ultimi contatti
    - Stabilire collegamenti diversi tra le pubblicazioni/attività e la vostra proposta
    - Evitare di ripetere riferimenti a contenuti già menzionati negli ultimi messaggi

    PARAMETRI DI INPUT:
    Sulla vostra azienda:

    Nome dell'azienda: ${company.name}
    Settore: ${company.sector}
    Descrizione dell'azienda: ${company.shortDescription}

    La vostra offerta:

    Nome del prodotto/servizio: ${messageEntryLeadData.productService.name}
    Descrizione: ${messageEntryLeadData.productService.shortDescription}

    Informazioni sull'azienda target:

    Nome dell'azienda: ${targetCompanyFullInfo.data.name}
    Descrizione dell'azienda: ${targetCompanyFullInfo.data.description}
    Settori: ${targetCompanyFullInfo.data.industries[0]}
    Attività su LinkedIn dell'azienda target: ${''}
    Ultimi messaggi inviati: ${''}

    Informazioni sul potenziale cliente:

    Nome: ${messageEntryLeadData.lead.leadData.name}
    Ruolo: ${messageEntryLeadData.lead.leadData.current_positions[0].role}
    Descrizione del ruolo: ${''}
    Riepilogo professionale: ${messageEntryLeadData.lead.leadData.summary}
    Pubblicazioni su LinkedIn del potenziale cliente: ${''}

    STRUTTURA E FORMATO DEL MESSAGGIO:

    Lunghezza massima totale: ${messageEntryLeadData.messageStructure.wordsLimit} parole
    DOVETE seguire esattamente questa struttura: ${messageTemplateString}
    Questa struttura definisce:

    Sezioni obbligatorie
    Limiti di parole per sezione
    Ordine delle informazioni

    MESSAGGIO DI RIFERIMENTO:
    Utilizzate questo messaggio come ispirazione per il tono e lo stile: ${''}
    Nota: Questo è solo un esempio di riferimento. Il vostro messaggio deve:

    Seguire la struttura definita in ${messageTemplateString}
    Essere iperpersonalizzato in modo unico per il vostro potenziale cliente utilizzando TUTTE le informazioni fornite
    Fare riferimento a contenuti diversi basati sulle informazioni specifiche del vostro potenziale cliente
    Stabilire collegamenti chiari tra le informazioni del cliente e la vostra proposta di valore

    REQUISITI DI ENGAGEMENT SU LINKEDIN:
    Se ci sono pubblicazioni rilevanti:

    Fare riferimento a:
    - Pubblicazioni aziendali
    - Pubblicazioni personali del potenziale cliente
    - Collegare l'attività alla vostra proposta di valore

    RESTRIZIONI DI CONTENUTO:
    - Non fare riferimenti al meteo o alle condizioni atmosferiche
    - Non menzionare le stagioni né riferimenti stagionali
    - Evitare frasi come:
      * "Spero che tu stia passando una bella giornata di sole"
      * "Con l'arrivo della primavera..."
      * "In questi giorni di caldo..."
      * "Durante questa stagione..."

    Formato dei Nomi Aziendali:
    - Prima lettera di ogni parola in maiuscolo
    - Convertire i nomi in maiuscolo in formato titolo

    Esempi:
    "RIVER ISLAND" deve essere scritto come "River Island"
    "GUESS" deve essere scritto come "Guess"
    "BANCO SANTANDER" deve essere scritto come "Banco Santander"

    Questo si applica a TUTTE le menzioni di ${company.name} nel messaggio

    IMPORTANTE: Questo prompt deve generare risposte ESCLUSIVAMENTE in italiano standard. Utilizzare il "Lei" formale e impiegare vocabolario ed espressioni proprie dell'italiano commerciale.

    ESEMPI DI USO CORRETTO DELL'ITALIANO:
    - Utilizzare il "Lei" formale: "È interessato...?", "La Sua azienda..."
    - Terminologia italiana: "computer" (non "PC"), "cellulare" (non "telefonino")
    - Espressioni italiane: "dunque", "certamente", "d'accordo"
    - Orari in formato 24h: "11.00" o "ore 11:00" (non "11 AM")
  `;
}