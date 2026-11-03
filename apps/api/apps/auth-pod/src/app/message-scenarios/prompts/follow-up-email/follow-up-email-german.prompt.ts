import { IBuildPromptData } from './follow-up-email-english.prompt';

export function buildFollowUpEmailGermanPrompt(data: IBuildPromptData): string {
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
    Sie MÜSSEN NUR den Follow-up-E-Mail-Text generieren.
    VERBOTEN zu inkludieren:
    - Erklärende Notizen oder Kommentare: (z.B. "Dieses Follow-up wurde personalisiert durch...", "Ich habe Bezüge eingefügt zu...", "Hinweis: Das Follow-up bezieht sich auf...")
    - Analysen oder Begründungen: (z.B. "Das Follow-up hebt die Kernpunkte hervor...", "Es konzentriert sich auf...", "Der Ansatz konzentriert sich auf...")
    - Metadaten oder Anmerkungen: (z.B. "Typ: Follow-up E-Mail", "Personalisierung: hoch", "Zielgruppe: Entscheider")
    - Text nach der Grußformel: (z.B. Listen von enthaltenen Funktionen, Erklärungen zu Personalisierungen, Analyse des verwendeten Ansatzes)
    - Jeglicher Inhalt, der nicht das Follow-up selbst ist: (z.B. "Hier ist das generierte Follow-up:", "Dies ist das Follow-up, das ich erstellt habe:", "Hier ist das Follow-up:")
    - Einleitende Sätze: (z.B. "Ich schlage folgendes Follow-up vor:", "Ich habe dieses Follow-up generiert:", "Das Follow-up würde so aussehen:")

    Die Follow-up-E-Mail MUSS in der letzten Textzeile enden, ohne zusätzliche Inhalte.

    Die Hyperpersonalisierung ist VERPFLICHTEND und muss sich basieren auf:
    - Dem beruflichen Profil des Empfängers
    - Seiner aktuellen Position und Verantwortlichkeiten
    - Der bereitgestellten LinkedIn-Aktivität (sowohl persönlich als auch geschäftlich)
    - Der Beschreibung und Branche seines Unternehmens
    - Dem Inhalt der letzten gesendeten Nachrichten (zur Vermeidung von Wiederholungen)
    - Den Verbindungspunkten zwischen seinen Bedürfnissen und Ihrem Wertangebot

    PRIORISIERUNG DES INHALTS:
    Zur Sicherstellung der Differenzierung von den letzten gesendeten Nachrichten:
    - Identifizierung von Profilaspekten, die in den letzten Nachrichten NICHT erwähnt wurden
    - Herstellung unterschiedlicher Verbindungen zwischen den Beiträgen/Aktivitäten und Ihrem Angebot
    - Vermeidung von Wiederholungen bereits erwähnter Inhalte aus den letzten Nachrichten

    EINGABEPARAMETER:
    Über Ihr Unternehmen:

    Unternehmensname: ${company.name}
    Branche: ${company.sector}
    Unternehmensbeschreibung: ${company.shortDescription}

    Ihr Angebot:

    Name des Produkts/der Dienstleistung: ${messageEntryLeadData.productService.name}
    Beschreibung: ${messageEntryLeadData.productService.shortDescription}

    Informationen zum Zielunternehmen:

    Unternehmensname: ${targetCompanyFullInfo.data.name}
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

    STRUKTUR UND FORMAT DER E-MAIL:

    Maximale Gesamtlänge: ${messageEntryLeadData.messageStructure.wordsLimit} Wörter
    Sie MÜSSEN exakt diese Struktur befolgen: ${messageTemplateString}
    Diese Struktur definiert:

    Pflichtabschnitte
    Wortbegrenzungen pro Abschnitt
    Reihenfolge der Informationen

    REFERENZ-E-MAIL:
    Verwenden Sie diese E-Mail als Inspiration für Ton und Stil: ${''}
    Hinweis: Dies ist nur ein Referenzbeispiel. Ihre E-Mail muss:

    Diese STRUKTUR UND DIESES FORMAT befolgen: ${messageTemplateString}
    Einzigartig für Ihren potenziellen Kunden hyperpersonalisiert sein unter Verwendung ALLER bereitgestellten Informationen
    Auf unterschiedliche Inhalte Bezug nehmen, basierend auf den spezifischen Informationen Ihres potenziellen Kunden
    Klare Verbindungen zwischen den Kundeninformationen und Ihrem Wertangebot herstellen

    LINKEDIN-ENGAGEMENT-ANFORDERUNGEN:
    Bei relevanten Beiträgen:

    Bezug nehmen auf:
    - Unternehmensbeiträge
    - Persönliche Beiträge des potenziellen Kunden
    - Die Aktivität mit Ihrem Wertangebot verbinden

    WICHTIGE FORMATIERUNGSREGELN:

    INHALTLICHE EINSCHRÄNKUNGEN:
    - Keine Bezugnahme auf Wetter oder atmosphärische Bedingungen
    - Keine Erwähnung von Jahreszeiten oder saisonalen Bezügen
    - Vermeidung von Phrasen wie:
      * "Ich hoffe, Sie genießen einen sonnigen Tag"
      * "Mit dem Einzug des Frühlings..."
      * "In diesen heißen Tagen..."
      * "Während dieser Saison..."

    Kein E-Mail-Betreff
    Keine Signatur
    Format <b>Text</b> für Schlüsselpunkte verwenden (NIEMALS Sternchen ** oder andere Formate)
    Offensichtliche Werbesprache vermeiden

    Format für Unternehmensnamen:
    - Erster Buchstabe jedes Wortes groß
    - Großgeschriebene Namen in Titelformat umwandeln

    Beispiele:
    "RIVER ISLAND" muss als "River Island" geschrieben werden
    "GUESS" muss als "Guess" geschrieben werden
    "BANCO SANTANDER" muss als "Banco Santander" geschrieben werden

    Dies gilt für ALLE Erwähnungen von ${targetCompanyFullInfo.data.name} in der E-Mail

    ANFORDERUNGEN FÜR FETTDRUCK-TAGS - VERPFLICHTEND:
    Sie MÜSSEN <b> und </b> Tags verwenden (NIEMALS Sternchen **) um NUR die wirkungsvollsten und relevantesten Sätze in jedem Absatz hervorzuheben. Ziel ist es, ausschließlich die Schlüsselpunkte hervorzuheben, nicht den gesamten Inhalt. Jeder Absatz darf MAXIMAL EINEN hervorgehobenen Satz enthalten, der den wichtigsten Punkt darstellt.

    RICHTLINIEN FÜR HERVORHEBUNGEN PRO ABSATZ:

    Kontextualisierung:
    - NUR den relevantesten Bezug zum vorherigen Kontakt hervorheben
    RICHTIG: "Ich schrieb Ihnen letzte Woche bezüglich <b>wie wir Ihnen bei der Optimierung Ihres internationalen Logistikprozesses helfen könnten</b>."
    FALSCH: "<b>Ich schreibe Ihnen erneut, da ich keine Antwort auf meine vorherige E-Mail über internationale Logistik erhalten habe</b>."

    Mehrwert:
    - NUR die neue relevante Information hervorheben
    RICHTIG: "Diese Woche <b>haben wir eine detaillierte Analyse veröffentlicht, wie River Island seine Logistikkosten um 35% reduziert hat</b>."
    FALSCH: "<b>Wie in meiner letzten E-Mail erwähnt, haben wir mehreren Unternehmen geholfen, ihre Logistikkosten zu reduzieren</b>."

    Hauptnutzen:
    - NUR den aktualisierten Hauptnutzen hervorheben
    RICHTIG: "Bei Betrachtung Ihrer letzten Projekte <b>könnten wir Ihnen helfen, ähnliche Ergebnisse in der Hälfte der Zeit zu erreichen</b>."
    FALSCH: "<b>Wie zuvor erwähnt, kann unsere Lösung Ihnen helfen, Zeit und Kosten zu reduzieren</b>."

    Call-to-Action:
    - NUR den konkreten Meetingvorschlag hervorheben
    RICHTIG: "<b>Würde Ihnen ein 30-minütiges Videogespräch diesen Donnerstag um 10 Uhr passen?</b>"
    FALSCH: "<b>Ich würde Ihnen gerne mehr Details erklären. Würde Ihnen ein Videogespräch passen?</b>"

    WICHTIG: Dieser Prompt muss AUSSCHLIESSLICH Antworten in Standarddeutsch generieren. Verwenden Sie die förmliche Anrede "Sie" und nutzen Sie Vokabular und Ausdrücke, die in Deutschland üblich sind.

    BEISPIELE FÜR KORREKTEN DEUTSCHEN SPRACHGEBRAUCH:
    - Förmliche Anrede verwenden: "Sind Sie interessiert...?", "Ihr Unternehmen..."
    - Deutsche Terminologie: "Computer", "Handy" (nicht "Mobiltelefon")
    - Deutsche Ausdrücke: "in Ordnung", "prima", "alles klar"
    - Uhrzeiten im 24-Stunden-Format: "11:00 Uhr" oder "11 Uhr" (nicht "11 AM")
  `;
}