import { IBuildPromptData } from './follow-up-email-english.prompt';

export function buildFollowUpEmailItalianPrompt(data: IBuildPromptData): string {
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
    DEVI generare SOLO il testo dell'email di follow-up.
    VIETATO includere:
    - Note esplicative o commenti: (es: "Questo follow-up è personalizzato attraverso...", "Ho incluso riferimenti a...", "Nota: Il follow-up fa riferimento a...")
    - Analisi o giustificazioni: (es: "Il follow-up evidenzia i punti chiave...", "Si concentra su...", "L'approccio si concentra su...")
    - Metadati o annotazioni: (es: "Tipo: email di follow-up", "Personalizzazione: alta", "Target: decisore")
    - Testo dopo i saluti: (es: elenchi di caratteristiche incluse, spiegazioni delle personalizzazioni fatte, analisi dell'approccio utilizzato)
    - Qualsiasi contenuto che non sia il follow-up stesso: (es: "Ecco il follow-up generato:", "Questo è il follow-up che ho creato:", "Ecco il follow-up:")
    - Frasi introduttive: (es: "Suggerisco il seguente follow-up:", "Ho generato questo follow-up:", "Il follow-up sarebbe così:")

    L'email di follow-up DEVE terminare all'ultima riga del testo, senza alcun contenuto aggiuntivo.

    L'iperpersonalizzazione è OBBLIGATORIA e deve basarsi su:
    - Il profilo professionale del destinatario
    - La sua posizione attuale e responsabilità
    - L'attività su LinkedIn fornita (sia personale che aziendale)
    - La descrizione e il settore della sua azienda
    - Il contenuto degli ultimi messaggi inviati (per evitare ripetizioni)
    - I punti di connessione tra le sue esigenze e la tua proposta di valore

    PRIORITIZZAZIONE DEI CONTENUTI:
    Per garantire differenziazione con gli ultimi messaggi inviati:
    - Identificare aspetti del profilo NON menzionati negli ultimi messaggi
    - Stabilire connessioni diverse tra i post/attività e la tua proposta
    - Evitare di ripetere riferimenti a contenuti già menzionati negli ultimi messaggi

    PARAMETRI DI INPUT:
    Sulla tua azienda:

    Nome dell'azienda: ${company.name}
    Settore: ${company.sector}
    Descrizione dell'azienda: ${company.shortDescription}

    La tua offerta:

    Nome del prodotto/servizio: ${messageEntryLeadData.productService.name}
    Descrizione: ${messageEntryLeadData.productService.description}

    Informazioni sull'azienda target:

    Nome dell'azienda: ${targetCompanyFullInfo.data.name}
    Descrizione dell'azienda: ${targetCompanyFullInfo.data.description}
    Settori: ${targetCompanyFullInfo.data.industries[0]}
    Attività LinkedIn dell'azienda target: ${''}
    Ultimi messaggi inviati: ${''}

    Informazioni sul potenziale cliente:

    Nome: ${messageEntryLeadData.lead.leadData.name}
    Posizione: ${messageEntryLeadData.lead.leadData.current_positions[0].role}
    Descrizione della posizione: ${''}
    Riepilogo professionale: ${messageEntryLeadData.lead.leadData.summary}
    Post LinkedIn del potenziale cliente: ${''}

    STRUTTURA E FORMATO DELL'EMAIL:

    Lunghezza massima totale: ${messageEntryLeadData.messageStructure.wordsLimit} parole
    DEVI seguire esattamente questa struttura: ${messageTemplateString}
    Questa struttura definisce:

    Sezioni obbligatorie
    Limiti di parole per sezione
    Ordine delle informazioni

    EMAIL DI RIFERIMENTO:
    Utilizza questa email come ispirazione per il tono e lo stile: ${messageTemplateString}
    Nota: Questo è solo un esempio di riferimento. La tua email deve:

    Seguire questa STRUTTURA E FORMATO: ${messageTemplateString}
    Essere iperpersonalizzata in modo unico per il tuo potenziale cliente utilizzando TUTTE le informazioni fornite
    Fare riferimento a contenuti diversi basati sulle informazioni specifiche del tuo potenziale cliente
    Stabilire connessioni chiare tra le informazioni del cliente e la tua proposta di valore

    REQUISITI DI ENGAGEMENT SU LINKEDIN:
    Se ci sono post rilevanti:

    Fare riferimento a:
    - Post aziendali
    - Post personali del potenziale cliente
    - Collegare l'attività con la tua proposta di valore

    REGOLE IMPORTANTI DI FORMATO:

    RESTRIZIONI DI CONTENUTO:
    - Non fare riferimenti al meteo o alle condizioni atmosferiche
    - Non menzionare le stagioni né riferimenti stagionali
    - Evitare frasi come:
      * "Spero che tu stia godendo di una bella giornata di sole"
      * "Con l'arrivo della primavera..."
      * "In questi giorni di caldo..."
      * "Durante questa stagione..."

    Nessun oggetto dell'email
    Nessuna firma
    Usare il formato <b>testo</b> per i punti chiave (MAI usare asterischi ** né altri formati)
    Evitare linguaggio commerciale ovvio

    Formato dei Nomi Aziendali:
    - Prima lettera di ogni parola in maiuscolo
    - Convertire i nomi in maiuscolo in formato titolo

    Esempi:
    "RIVER ISLAND" deve essere scritto come "River Island"
    "GUESS" deve essere scritto come "Guess"
    "BANCO SANTANDER" deve essere scritto come "Banco Santander"

    Questo si applica a TUTTE le menzioni di ${targetCompanyFullInfo.data.name} nell'email

    REQUISITI DEI TAG IN GRASSETTO - OBBLIGATORIO:
    DEVI usare i tag <b> e </b> (MAI asterischi **) per evidenziare SOLO le frasi più impattanti e rilevanti in ogni paragrafo. L'obiettivo è evidenziare unicamente i punti chiave, non tutto il contenuto. Ogni paragrafo deve contenere AL MASSIMO UNA frase evidenziata che rappresenti il punto più importante.

    LINEE GUIDA PER L'EVIDENZIAZIONE PER PARAGRAFO:

    Contestualizzazione:
    - Evidenziare SOLO il riferimento più rilevante al contatto precedente
    CORRETTO: "Ti ho scritto la settimana scorsa riguardo <b>come potremmo aiutarvi a ottimizzare il vostro processo di logistica internazionale</b>."
    SBAGLIATO: "<b>Ti scrivo di nuovo perché non ho ricevuto risposta alla mia email precedente sulla logistica internazionale</b>."

    Valore Aggiunto:
    - Evidenziare SOLO la nuova informazione rilevante
    CORRETTO: "Questa settimana <b>abbiamo pubblicato un'analisi dettagliata su come River Island ha ridotto i suoi costi logistici del 35%</b>."
    SBAGLIATO: "<b>Come menzionavo nella mia ultima email, abbiamo aiutato diverse aziende a ridurre i loro costi logistici</b>."

    Beneficio Principale:
    - Evidenziare SOLO il beneficio chiave aggiornato
    CORRETTO: "Osservando i vostri ultimi progetti, <b>potremmo aiutarvi a raggiungere risultati simili in metà tempo</b>."
    SBAGLIATO: "<b>Come dicevo prima, la nostra soluzione può aiutarvi a ridurre tempi e costi</b>."

    Call to Action:
    - Evidenziare SOLO la proposta concreta di riunione
    CORRETTO: "<b>Vi andrebbe bene una videochiamata di 30 minuti questo giovedì alle 10:00?</b>"
    SBAGLIATO: "<b>Mi piacerebbe avere l'opportunità di spiegarvi più dettagli. Vi andrebbe bene una videochiamata?</b>"

    IMPORTANTE: Questo prompt deve generare risposte ESCLUSIVAMENTE in italiano standard. Utilizzare il "voi" formale e impiegare vocabolario ed espressioni proprie dell'italiano.

    ESEMPI DI USO CORRETTO DELL'ITALIANO:
    - Usare il "voi" formale: "Siete interessati...?", "La vostra azienda..."
    - Terminologia italiana: "computer" (non "PC"), "cellulare" (non "telefonino")
    - Espressioni italiane: "va bene", "ottimo", "d'accordo"
    - Orari in formato 24 ore: "11:00" o "ore 11:00" (non "11 AM")
  `;
}