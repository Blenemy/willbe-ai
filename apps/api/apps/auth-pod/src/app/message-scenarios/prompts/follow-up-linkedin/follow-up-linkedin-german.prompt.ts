import { IBuildPromptData } from './follow-up-linkedin-english.prompt';

export function buildFollowUpLinkedinGermanPrompt(data: IBuildPromptData): string {
  const { messageTemplate, company, messageEntryLeadData, targetCompanyFullInfo} = data;

  let messageTemplateString = `Anrede: ${messageTemplate.greeting}\n\n`;
  
  messageTemplateString += `Einleitung (maximale Wortanzahl des Einleitungsabschnitts: ${messageTemplate.introduction.wordsLimit}): ${messageTemplate.introduction.text}`;
  messageTemplateString += 'Die Einleitung sollte personalisiert, aber nicht verkaufsorientiert sein.\n\n';

  messageTemplate.paragraphs.forEach((paragraph, index) => {
    messageTemplateString += `Absatz ${index + 1} (maximale Wortanzahl des Absatzes ${index + 1}: ${paragraph.wordsLimit}): ${paragraph.text}\n\n`;
  });

  messageTemplateString += `Verabschiedung (maximale Wortanzahl des Verabschiedungsabschnitts: ${messageTemplate.goodbye.wordsLimit}): ${messageTemplate.goodbye.text}\n\n`;

  return `
    ${messageTemplate.objective}

    KRITISCHE FORMATBESCHRÄNKUNG:
    Sie MÜSSEN NUR den LinkedIn-Follow-up-Nachrichtentext generieren.
    VERBOTEN zu inkludieren:
    - Erklärende Notizen oder Kommentare: (z.B. "Dieses Follow-up wurde personalisiert durch...", "Ich habe Bezüge eingefügt zu...", "Hinweis: Das Follow-up bezieht sich auf...")
    - Analysen oder Begründungen: (z.B. "Das Follow-up hebt die Kernpunkte hervor...", "Es konzentriert sich auf...", "Der Ansatz konzentriert sich auf...")
    - Metadaten oder Anmerkungen: (z.B. "Typ: Follow-up Nachricht", "Personalisierung: hoch", "Zielgruppe: Entscheider")
    - Text nach der Grußformel: (z.B. Listen von enthaltenen Funktionen, Erklärungen zu Personalisierungen, Analyse des verwendeten Ansatzes)
    - Jeglicher Inhalt, der nicht das Follow-up selbst ist: (z.B. "Hier ist das generierte Follow-up:", "Dies ist das Follow-up, das ich erstellt habe:", "Hier ist das Follow-up:")
    - Einleitende Sätze: (z.B. "Ich schlage folgendes Follow-up vor:", "Ich habe dieses Follow-up generiert:", "Das Follow-up würde so aussehen:")

    Die Follow-up-Nachricht MUSS in der letzten Textzeile enden, ohne zusätzliche Inhalte.

    Die Hyperpersonalisierung ist VERPFLICHTEND und muss sich auf folgende Aspekte stützen:
    - Das berufliche Profil des Empfängers
    - Seine aktuelle Position und Verantwortlichkeiten
    - Die bereitgestellte LinkedIn-Aktivität (sowohl persönlich als auch geschäftlich)
    - Die Beschreibung und Branche seines Unternehmens
    - Den Inhalt der letzten gesendeten Nachrichten (zur Vermeidung von Wiederholungen)
    - Die Verbindungspunkte zwischen seinen Bedürfnissen und Ihrem Wertangebot

    PRIORISIERUNG DES INHALTS:
    Um eine Differenzierung zu den letzten Nachrichten sicherzustellen:
    - Identifizieren Sie Profilaspekte, die in den letzten Kontakten NICHT erwähnt wurden
    - Stellen Sie neue Verbindungen zwischen den Veröffentlichungen/Aktivitäten und Ihrem Angebot her
    - Vermeiden Sie Wiederholungen von bereits in den letzten Nachrichten erwähnten Inhalten

    EINGABEPARAMETER:
    Über Ihr Unternehmen:

    Unternehmensname: ${company.name}
    Branche: ${company.sector}
    Unternehmensbeschreibung: ${company.shortDescription}

    Ihr Angebot:

    Name des Produkts/der Dienstleistung: ${messageEntryLeadData.productService.name}
    Beschreibung: ${messageEntryLeadData.productService.shortDescription}

    Informationen zum Zielunternehmen:

    Firmenname: ${targetCompanyFullInfo.data.name}
    Unternehmensbeschreibung: ${targetCompanyFullInfo.data.description}
    Branchen: ${targetCompanyFullInfo.data.industry[0]}
    LinkedIn-Aktivität des Zielunternehmens: ${''}
    Zuletzt gesendete Nachrichten: ${''}

    Informationen zum potenziellen Kunden:

    Name: ${messageEntryLeadData.lead.leadData.name}
    Position: ${messageEntryLeadData.lead.leadData.current_positions[0].role}
    Positionsbeschreibung: ${''}
    Beruflicher Werdegang: ${messageEntryLeadData.lead.leadData.summary}
    LinkedIn-Beiträge des potenziellen Kunden: ${''}

    STRUKTUR UND FORMAT DER NACHRICHT:

    Maximale Gesamtlänge: ${messageEntryLeadData.messageStructure.wordsLimit} Wörter
    Sie MÜSSEN diese Struktur genau einhalten: ${messageTemplateString}
    Diese Struktur definiert:

    Pflichtabschnitte
    Wörterbegrenzungen pro Abschnitt
    Reihenfolge der Informationen

    REFERENZNACHRICHT:
    Verwenden Sie diese Nachricht als Inspiration für Ton und Stil: ${messageTemplate.sampleMessage}
    Hinweis: Dies ist nur ein Referenzbeispiel. Ihre Nachricht muss:

    Der in ${messageTemplateString} definierten Struktur folgen
    Einzigartig für Ihren potenziellen Kunden hyperpersonalisiert sein und ALLE bereitgestellten Informationen nutzen
    Sich auf unterschiedliche Inhalte beziehen, basierend auf den spezifischen Informationen Ihres potenziellen Kunden
    Klare Verbindungen zwischen den Kundeninformationen und Ihrem Wertangebot herstellen

    ANFORDERUNGEN AN DAS LINKEDIN-ENGAGEMENT:
    Bei relevanten Beiträgen:

    Bezug nehmen auf:
    - Unternehmensbeiträge
    - Persönliche Beiträge des potenziellen Kunden
    - Die Aktivität mit Ihrem Wertangebot verbinden

    INHALTLICHE EINSCHRÄNKUNGEN:
    - Keine Bezugnahme auf Wetter oder atmosphärische Bedingungen
    - Keine Erwähnung von Jahreszeiten oder saisonalen Bezügen
    - Vermeiden Sie Phrasen wie:
      * "Ich hoffe, Sie haben einen schönen sonnigen Tag"
      * "Mit dem Einzug des Frühlings..."
      * "An diesen heißen Tagen..."
      * "Während dieser Saison..."

    Format für Firmennamen:
    - Erster Buchstabe jedes Wortes groß
    - Umwandlung von Großbuchstaben in Titelformat

    Beispiele:
    "RIVER ISLAND" muss als "River Island" geschrieben werden
    "GUESS" muss als "Guess" geschrieben werden
    "BANCO SANTANDER" muss als "Banco Santander" geschrieben werden

    Dies gilt für ALLE Erwähnungen von ${targetCompanyFullInfo.data.name} in der Nachricht

    WICHTIG: Dieser Prompt muss AUSSCHLIESSLICH Antworten in Standarddeutsch generieren. Verwenden Sie die formelle "Sie"-Form und nutzen Sie Vokabular und Ausdrücke, die im deutschen Geschäftskontext üblich sind.

    BEISPIELE FÜR DIE KORREKTE VERWENDUNG DES DEUTSCHEN:
    - Verwendung der "Sie"-Form: "Sind Sie interessiert...?", "Ihr Unternehmen..."
    - Deutsche Fachbegriffe: "Computer" (nicht "PC"), "Handy" (nicht "Mobiltelefon")
    - Deutsche Ausdrücke: "in der Tat", "selbstverständlich", "einverstanden"
    - Uhrzeiten im 24-Stunden-Format: "11:00 Uhr" oder "11 Uhr" (nicht "11 AM")
  `;
}