import { IBuildPromptData } from './first-email-english.prompt';

export function buildFirstEmailItalianPrompt(data: IBuildPromptData): string {
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
    DEVI generare SOLO il testo dell'email.
    VIETATO includere:
    - Note esplicative o commenti: (es: "Questa email è personalizzata attraverso...", "Ho incluso riferimenti a...", "Nota: L'email fa riferimento a...")
    - Analisi o giustificazioni: (es: "L'email evidenzia i punti chiave...", "Si concentra su...", "L'approccio si concentra su...")
    - Metadati o annotazioni: (es: "Tipo di email: iniziale", "Personalizzazione: alta", "Target: decisore")
    - Testo dopo i saluti: (es: elenchi di caratteristiche incluse, spiegazioni delle personalizzazioni fatte, analisi dell'approccio utilizzato)
    - Qualsiasi contenuto che non sia l'email stessa: (es: "Ecco l'email generata:", "Questa è l'email che ho creato:", "Ecco l'email:")
    - Frasi introduttive: (es: "Suggerisco la seguente email:", "Ho generato questa email:", "L'email sarebbe così:")

    L'email DEVE terminare all'ultima riga del testo, senza alcun contenuto aggiuntivo.

    PARAMETRI DI INPUT:

    Sulla tua azienda:

    Nome dell'azienda: ${company.name}
    Settore: ${company.sector}
    Descrizione dell'azienda: ${company.shortDescription}

    La tua offerta:

    Nome del prodotto/servizio: ${messageEntryLeadData.productService.name}
    Descrizione: ${messageEntryLeadData.productService.shortDescription}

    Informazioni sull'azienda target:

    Nome dell'azienda: ${targetCompanyFullInfo.data.name}
    Descrizione dell'azienda: ${targetCompanyFullInfo.data.description}
    Settori: ${targetCompanyFullInfo.data.industry[0]}
    Pubblicazioni recenti su LinkedIn dell'azienda target: ${''} (OBBLIGATORIO menzionarle se disponibili)

    Informazioni sul potenziale cliente:

    Nome: ${messageEntryLeadData.lead.leadData.name}
    Ruolo: ${messageEntryLeadData.lead.leadData.current_positions[0].role}
    Descrizione del ruolo: ${''}
    Riepilogo professionale: ${messageEntryLeadData.lead.leadData.summary}
    Pubblicazioni recenti su LinkedIn del potenziale cliente: ${''} (OBBLIGATORIO menzionarle se disponibili)

    STRUTTURA E FORMATO DELL'EMAIL:

    Lunghezza massima totale: ${messageEntryLeadData.messageStructure.wordsLimit}
    DEVI seguire esattamente questa struttura: ${messageTemplateString}

    Questa struttura definisce:

    Sezioni obbligatorie,
    Limiti di parole per sezione,
    Ordine delle informazioni

    EMAIL DI RIFERIMENTO:
    Usa questa email come ispirazione per il tono e lo stile: ${messageTemplate.sampleMessage}

    Nota: Questo è solo un esempio di riferimento. La tua email deve:

    - Seguire questa STRUTTURA E FORMATO: ${messageTemplateString}
    - Essere personalizzata in modo unico per il tuo potenziale cliente
    - Fare riferimento a contenuti diversi basati sulle informazioni del tuo potenziale cliente

    REQUISITI DI ENGAGEMENT SU LINKEDIN:
    Se sono disponibili pubblicazioni LinkedIn:

    È OBBLIGATORIO fare riferimento a contenuti specifici delle loro pubblicazioni più recenti precedentemente menzionate nell'introduzione:

    Pubblicazioni recenti su LinkedIn del potenziale cliente e pubblicazioni recenti su LinkedIn dell'azienda target. Le pubblicazioni recenti su LinkedIn del potenziale cliente hanno la priorità.

    Utilizzare l'attività su LinkedIn per dimostrare comprensione delle loro priorità attuali
    Collegare i loro contenuti pubblicati con la proposta di valore
    Mostrare come la tua soluzione si collega ai temi che stanno attivamente discutendo

    REGOLE IMPORTANTI DI FORMATTAZIONE:

    RESTRIZIONI DI CONTENUTO:
    - Non fare riferimenti al clima o al tempo atmosferico
    - Non menzionare le stagioni né riferimenti stagionali
    - Evitare frasi come:
      * "Spero che tu stia avendo una bella giornata di sole"
      * "Con l'arrivo della primavera..."
      * "In questi giorni di caldo..."
      * "Durante questa stagione..."

    Nessun oggetto dell'email
    Nessuna firma
    Usare il formato <b>testo</b> per i punti chiave (MAI usare asterischi ** né altri formati)
    Evitare linguaggio commerciale ovvio

    Formato dei Nomi Aziendali:

    Prima lettera di ogni parola in maiuscolo
    Convertire nomi in maiuscolo in formato titolo

    Esempi:
    "RIVER ISLAND" deve essere scritto come "River Island"
    "GUESS" deve essere scritto come "Guess"
    "BANCO SANTANDER" deve essere scritto come "Banco Santander"

    Questo si applica a TUTTE le menzioni di ${targetCompanyFullInfo.data.name} nell'email

    REQUISITI DEI TAG IN GRASSETTO - OBBLIGATORIO:
    DEVI usare i tag <b> e </b> (MAI asterischi **) per evidenziare SOLO le frasi più impattanti e rilevanti in ogni paragrafo. L'obiettivo è evidenziare unicamente i punti chiave, non tutto il contenuto. Ogni paragrafo deve contenere AL MASSIMO UNA frase evidenziata che rappresenti il punto più importante.

    LINEE GUIDA PER L'EVIDENZIAZIONE PER PARAGRAFO:

    Paragrafo di Apertura/Introduzione:

    Evidenziare SOLO l'osservazione più rilevante sul potenziale cliente
    CORRETTO: "Ho seguito il vostro lavoro e <b>la vostra recente implementazione di soluzioni sostenibili ha ridotto l'impatto ambientale del 40%</b>"
    SBAGLIATO: "<b>Ho seguito il vostro lavoro e la vostra recente implementazione di soluzioni sostenibili ha ridotto l'impatto ambientale del 40%</b>"

    Paragrafo della Proposta di Valore:

    Evidenziare SOLO il beneficio principale o il differenziatore chiave
    CORRETTO: "La nostra piattaforma offre molteplici funzionalità, e <b>abbiamo ridotto i costi operativi del 30% per aziende simili</b>"
    SBAGLIATO: "<b>La nostra piattaforma offre molteplici funzionalità, e abbiamo ridotto i costi operativi del 30% per aziende simili</b>"

    Paragrafo di Prova Sociale:

    Evidenziare SOLO il risultato o l'obiettivo più impattante
    CORRETTO: "Collaboriamo con diversi clienti del settore e <b>abbiamo aiutato River Island ad aumentare la sua efficienza del 45%</b>"
    SBAGLIATO: "<b>Collaboriamo con diversi clienti del settore e abbiamo aiutato River Island ad aumentare la sua efficienza del 45%</b>"

    Paragrafo di Chiamata all'Azione:

    Evidenziare SOLO la proposta concreta di incontro
    CORRETTO: "<b>Sarebbe possibile un caffè virtuale di 30 minuti giovedì prossimo alle 11:00?</b>"
    SBAGLIATO: "<b>Mi piacerebbe avere l'opportunità di incontrarci. Sarebbe possibile un caffè virtuale di 30 minuti giovedì prossimo alle 11:00?</b>"

    REGOLE GENERALI DI EVIDENZIAZIONE:

    Massimo UNA frase in grassetto per paragrafo
    Evidenziare SOLO il punto più importante o impattante
    Evitare di evidenziare informazioni contestuali o connettori
    Le frasi in grassetto devono poter essere lette indipendentemente e mantenere un senso completo
    Il testo evidenziato non deve superare il 25% del contenuto totale dell'email

    ESEMPI DI EQUILIBRIO CORRETTO:

    BUONO (Evidenziazione selettiva):
    "Buongiorno Giovanni,
    Ho seguito il vostro percorso e <b>la vostra recente espansione internazionale ha generato risultati eccezionali</b>.
    Dalla nostra consulenza specializzata, <b>abbiamo aiutato aziende simili a ridurre i loro costi di espansione del 40%</b>.
    Lavoriamo con numerosi clienti del settore e <b>recentemente abbiamo aiutato Company X a completare la sua espansione il 50% più velocemente</b>.
    <b>Sarebbe disponibile per un incontro giovedì alle 11:00 per condividere la nostra esperienza?</b>
    Cordiali saluti,"

    CATTIVO (Troppa evidenziazione):
    "<b>Buongiorno Giovanni,
    Ho seguito il vostro percorso e la vostra recente espansione internazionale ha generato risultati eccezionali.
    Dalla nostra consulenza specializzata, abbiamo aiutato aziende simili a ridurre i loro costi di espansione del 40%.
    Lavoriamo con numerosi clienti del settore e recentemente abbiamo aiutato Company X a completare la sua espansione il 50% più velocemente.
    Sarebbe disponibile per un incontro giovedì alle 11:00 per condividere la nostra esperienza?</b>
    Cordiali saluti,"

    REQUISITI DI PERSONALIZZAZIONE:

    Deve fare riferimento ad almeno un dettaglio specifico di:

    Le loro pubblicazioni su LinkedIn (se disponibili)
    Descrizione dell'azienda
    Ruolo e responsabilità
    Contesto del settore

    Mostrare chiara ricerca e comprensione del loro business
    Collegare le loro sfide con la vostra soluzione senza essere promozionali

    La tua risposta deve contenere SOLO il testo dell'email, seguendo la struttura fornita mentre usi l'email di esempio come riferimento per il tono e lo stile. Crea un messaggio altamente personalizzato che dimostri che hai esaminato approfonditamente il loro profilo e comprendi il loro contesto.

    IMPORTANTE: Questo prompt deve generare risposte ESCLUSIVAMENTE in italiano standard. Utilizzare il "Lei" come forma di cortesia e impiegare vocabolario ed espressioni tipiche dell'italiano professionale.

    ESEMPI DI USO CORRETTO DELL'ITALIANO PROFESSIONALE:

    Uso del "Lei": "Sarebbe interessato...?", "La Sua azienda..."
    Terminologia italiana: "riunione", "colloquio", "appuntamento"
    Espressioni italiane formali: "Cordiali saluti", "In attesa di un Suo riscontro", "Le porgo i miei migliori saluti"
    Orari in formato 24h: "11:00" o "ore 11:00" (non "11 AM")
  `;
}