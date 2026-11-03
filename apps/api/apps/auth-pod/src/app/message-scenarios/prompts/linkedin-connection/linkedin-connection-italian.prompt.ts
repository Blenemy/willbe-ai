import { IBuildPromptData } from './linkedin-connection-english.prompt';

export function buildLinkedinConnectionItalianPrompt(data: IBuildPromptData): string {
  const { messageTemplate, company, messageEntryLeadData, targetCompanyFullInfo} = data;

  return `
    ${messageTemplate.objective}

    RESTRIZIONE CRITICA DI FORMATO:
    DEVI generare SOLO il testo del messaggio di connessione.
    VIETATO includere:
    - Note esplicative o commenti: (es: "Questo messaggio è personalizzato attraverso...", "Ho incluso riferimenti a...", "Nota: Il messaggio fa riferimento a...")
    - Analisi o giustificazioni: (es: "Il messaggio evidenzia i punti chiave...", "Si concentra su...", "L'approccio si concentra su...")
    - Metadati o annotazioni: (es: "Tipo: messaggio di connessione", "Personalizzazione: alta", "Target: decisore")
    - Testo dopo i saluti: (es: elenchi di caratteristiche incluse, spiegazioni delle personalizzazioni fatte, analisi dell'approccio utilizzato)
    - Qualsiasi contenuto che non sia il messaggio stesso: (es: "Ecco il messaggio generato:", "Questo è il messaggio che ho creato:", "Ecco il messaggio:")
    - Frasi introduttive: (es: "Suggerisco il seguente messaggio:", "Ho generato questo messaggio:", "Il messaggio sarebbe così:")

    Il messaggio DEVE terminare all'ultima riga del testo, senza alcun contenuto aggiuntivo. Ricorda che questo messaggio ha un limite di 200 caratteri.

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
    Post recenti su LinkedIn dell'azienda target: ${''} (OBBLIGATORIO menzionarli se disponibili)

    Informazioni sul potenziale cliente:
    Nome: ${messageEntryLeadData.lead.leadData.name}
    Ruolo: ${messageEntryLeadData.lead.leadData.current_positions[0].role}
    Descrizione del ruolo: ${''}
    Riepilogo professionale: ${messageEntryLeadData.lead.leadData.summary}
    Post recenti su LinkedIn del potenziale cliente: ${''} (OBBLIGATORIO menzionarli se disponibili)

    STRUTTURA E FORMATO DEL MESSAGGIO:
    Lunghezza massima TASSATIVA: 200 caratteri (spazi e punteggiatura inclusi)
    IMPORTANTE: Il messaggio sarà rifiutato se supera i 200 caratteri
    Nota: Questa restrizione ha la precedenza su ${messageEntryLeadData.messageStructure.wordsLimit} parole

    MESSAGGIO DI RIFERIMENTO:
    Usa questo messaggio come ispirazione per il tono e lo stile: ${messageTemplate.sampleMessage}
    Nota: Questo è un esempio di riferimento. Il tuo messaggio deve:
    - Essere personalizzato in modo unico per il tuo potenziale cliente
    - Fare riferimento a contenuti diversi basati sulle informazioni del tuo potenziale cliente
    - Rispettare rigorosamente il limite di 200 caratteri

    REQUISITI DI ENGAGEMENT SU LINKEDIN:
    Se sono disponibili post LinkedIn:
    È OBBLIGATORIO fare riferimento a contenuti specifici dei loro post più recenti:
    - Post recenti su LinkedIn del potenziale cliente e post recenti su LinkedIn dell'azienda target
    - I post recenti su LinkedIn del potenziale cliente hanno la priorità
    - Utilizzare la loro attività su LinkedIn per dimostrare comprensione delle loro priorità attuali
    - Collegare i loro contenuti pubblicati con la proposta di valore
    - Mostrare come la tua soluzione si relaziona con i temi che stanno discutendo attivamente

    REGOLE IMPORTANTI DI FORMATO:
    - Tono professionale ma cordiale
    - Evitare linguaggio commerciale ovvio
    - Essere concisi e diretti per il limite di 200 caratteri

    RESTRIZIONI DI CONTENUTO:
    - Non fare riferimenti al meteo
    - Non menzionare le stagioni né riferimenti stagionali
    - Evitare frasi come:
      * "Spero che tu stia godendo di una bella giornata di sole"
      * "Con l'arrivo della primavera..."
      * "In questi giorni di caldo..."
      * "Durante questa stagione..."

    Formato dei Nomi Aziendali:
    - Prima lettera di ogni parola maiuscola
    - Convertire i nomi in maiuscolo in formato titolo
    Esempi:
    - "RIVER ISLAND" deve essere scritto come "River Island"
    - "GUESS" deve essere scritto come "Guess"
    - "BANCO SANTANDER" deve essere scritto come "Banco Santander"
    Questo si applica a TUTTE le menzioni di ${targetCompanyFullInfo.data.name} nel messaggio

    REQUISITI DI PERSONALIZZAZIONE:
    Deve fare riferimento ad almeno un dettaglio specifico di:
    - I loro post LinkedIn (se disponibili)
    - Descrizione dell'azienda
    - Ruolo e responsabilità
    - Contesto del settore
    - Mostrare chiara ricerca e comprensione del loro business
    - Collegare le loro sfide con la tua soluzione senza essere promozionale

    La tua risposta deve contenere SOLO il testo del messaggio di connessione, utilizzando il messaggio esempio come riferimento per il tono e lo stile. Crea un messaggio altamente personalizzato che dimostri di aver esaminato approfonditamente il loro profilo e di comprendere il loro contesto.

    IMPORTANTE: Questo prompt deve generare risposte ESCLUSIVAMENTE in italiano standard. Utilizzare il "Lei" come forma di cortesia e impiegare vocabolario ed espressioni proprie dell'italiano.

    ESEMPI DI USO CORRETTO DELL'ITALIANO:
    - Usare la forma di cortesia: "È interessato...?", "La Sua azienda..."
    - Terminologia italiana: "computer", "cellulare", "e-mail"
    - Espressioni italiane: "va bene", "ottimo", "d'accordo"
    - Orari in formato 24 ore: "ore 11" o "11:00" (non "11 AM")
  `;
}
