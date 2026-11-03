import { IBuildPromptData } from './first-email-english.prompt';

export function buildFirstEmailGermanPrompt(data: IBuildPromptData): string {
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

    WICHTIGE FORMATIERUNGSEINSCHRÄNKUNGEN:
    Sie MÜSSEN NUR den E-Mail-Text generieren.
    VERBOTEN sind:
    - Erklärende Hinweise oder Kommentare: (z-B- "Diese E-Mail ist personalisiert durch-", "Ich habe Verweise auf- eingefügt", "Hinweis: Die E-Mail bezieht sich auf-")
    - Analysen oder Begründungen: (z-B- "Die E-Mail hebt wichtige Punkte hervor-", "Sie konzentriert sich auf-", "Der Ansatz konzentriert sich auf-")
    - Metadaten oder Anmerkungen: (z-B- "E-Mail-Typ: initial", "Personalisierung: hoch", "Zielgruppe: Entscheidungsträger")
    - Text nach der Verabschiedung: (z-B- Listen der enthaltenen Funktionen, Erklärungen zu vorgenommenen Personalisierungen, Analyse des verwendeten Ansatzes)
    - Jeglicher Inhalt, der nicht die E-Mail selbst ist: (z-B- "Hier ist die generierte E-Mail:", "Dies ist die E-Mail, die ich erstellt habe:", "Hier ist die E-Mail:")
    - Einleitende Phrasen: (z-B- "Ich schlage folgende E-Mail vor-", "Ich habe diese E-Mail generiert-", "Die E-Mail würde so aussehen-")
    Die E-Mail MUSS in der letzten Textzeile enden, ohne zusätzliche Inhalte.

    Die E-Mail MUSS in der letzten Textzeile enden, ohne zusätzliche Inhalte.

    EINGABEPARAMETER:

    Über Ihr Unternehmen:

    Unternehmensname: ${company.name}
    Branche: ${company.sector}
    Unternehmensbeschreibung: ${company.shortDescription}

    Ihr Angebot:

    Produkt-/Servicename: ${messageEntryLeadData.productService.name}
    Beschreibung: ${messageEntryLeadData.productService.shortDescription}

    Informationen zum Zielunternehmen:

    Unternehmensname: ${targetCompanyFullInfo.data.name}
    Unternehmensbeschreibung: ${targetCompanyFullInfo.data.description}
    Branchen: ${targetCompanyFullInfo.data.industry[0]}
    Aktuelle LinkedIn-Beiträge des Zielunternehmens: ${''}

    Informationen zum potenziellen Kunden:

    Name: ${messageEntryLeadData.lead.leadData.name}
    Position: ${messageEntryLeadData.lead.leadData.current_positions[0].role}
    Positionsbeschreibung: ${''}
    Beruflicher Werdegang: ${messageEntryLeadData.lead.leadData.summary}
    Aktuelle LinkedIn-Beiträge des potenziellen Kunden: ${''}

    STRUKTUR UND FORMAT DER E-MAIL:

    Maximale Gesamtlänge: ${messageEntryLeadData.messageStructure.wordsLimit}
    Sie MÜSSEN genau diese Struktur befolgen: ${messageTemplateString}

    Diese Struktur definiert:

    Pflichtabschnitte,
    Wortbegrenzungen pro Abschnitt,
    Reihenfolge der Informationen

    BEISPIEL-E-MAIL:
    Verwenden Sie diese E-Mail als Inspiration für Ton und Stil: ${messageTemplate.sampleMessage}

    Hinweis: Dies ist nur ein Referenzbeispiel. Ihre E-Mail muss:

    - Diese STRUKTUR UND FORMAT befolgen: ${messageTemplateString}
    - Einzigartig für Ihren potenziellen Kunden personalisiert sein
    - Auf unterschiedliche Inhalte basierend auf den Informationen Ihres potenziellen Kunden Bezug nehmen

    LINKEDIN-ENGAGEMENT-ANFORDERUNGEN:
    Wenn LinkedIn-Beiträge verfügbar sind:

    Es ist PFLICHT, auf spezifische Inhalte ihrer zuvor in der Einleitung erwähnten aktuellen Beiträge Bezug zu nehmen:

    Aktuelle LinkedIn-Beiträge des potenziellen Kunden und aktuelle LinkedIn-Beiträge des Zielunternehmens. Die aktuellen LinkedIn-Beiträge des potenziellen Kunden haben Vorrang.

    LinkedIn-Aktivität nutzen, um Verständnis für ihre aktuellen Prioritäten zu demonstrieren
    Ihre veröffentlichten Inhalte mit dem Wertversprechen verbinden
    Zeigen, wie Ihre Lösung mit den aktiv diskutierten Themen zusammenhängt

    WICHTIGE FORMATIERUNGSREGELN:

    INHALTLICHE EINSCHRÄNKUNGEN:
    - Keine Bezugnahme auf Wetter oder atmosphärische Bedingungen
    - Keine Erwähnung von Jahreszeiten oder saisonalen Bezügen
    - Vermeiden Sie Phrasen wie:
      * "Ich hoffe, Sie haben einen sonnigen Tag"
      * "Mit dem Beginn des Frühlings..."
      * "An diesen heißen Tagen..."
      * "In dieser Jahreszeit..."

    Kein E-Mail-Betreff
    Keine Signatur
    Format <b>Text</b> für Schlüsselpunkte verwenden (NIEMALS Sternchen ** oder andere Formate)
    Offensichtliche Werbesprache vermeiden

    Format für Unternehmensnamen:

    Erster Buchstabe jedes Wortes groß
    Großgeschriebene Namen in Titelformat umwandeln

    Beispiele:
    "RIVER ISLAND" muss als "River Island" geschrieben werden
    "GUESS" muss als "Guess" geschrieben werden
    "BANCO SANTANDER" muss als "Banco Santander" geschrieben werden

    Dies gilt für ALLE Erwähnungen von ${targetCompanyFullInfo.data.name} in der E-Mail

    ANFORDERUNGEN FÜR FETTSCHRIFT-TAGS - PFLICHT:
    Sie MÜSSEN <b> und </b> Tags verwenden (NIEMALS Sternchen **) um NUR die wirkungsvollsten und relevantesten Sätze in jedem Absatz hervorzuheben. Ziel ist es, nur die Schlüsselpunkte hervorzuheben, nicht den gesamten Inhalt. Jeder Absatz darf MAXIMAL EINEN hervorgehobenen Satz enthalten, der den wichtigsten Punkt darstellt.

    RICHTLINIEN FÜR HERVORHEBUNGEN PRO ABSATZ:

    Eröffnungs-/Einleitungsabsatz:

    NUR die relevanteste Beobachtung über den potenziellen Kunden hervorheben
    RICHTIG: "Ich verfolge Ihre Arbeit und <b>Ihre kürzliche Implementierung nachhaltiger Lösungen hat den Umwelteinfluss um 40% reduziert</b>"
    FALSCH: "<b>Ich verfolge Ihre Arbeit und Ihre kürzliche Implementierung nachhaltiger Lösungen hat den Umwelteinfluss um 40% reduziert</b>"

    Wertversprechen-Absatz:

    NUR den Hauptnutzen oder wichtigsten Differenzierungsfaktor hervorheben
    RICHTIG: "Unsere Plattform bietet vielfältige Funktionalitäten, und <b>wir konnten die Betriebskosten für ähnliche Unternehmen um 30% senken</b>"
    FALSCH: "<b>Unsere Plattform bietet vielfältige Funktionalitäten, und wir konnten die Betriebskosten für ähnliche Unternehmen um 30% senken</b>"

    Social Proof-Absatz:

    NUR die wirkungsvollste Errungenschaft oder das wichtigste Ergebnis hervorheben
    RICHTIG: "Wir arbeiten mit verschiedenen Kunden in der Branche zusammen und <b>haben River Island geholfen, ihre Effizienz um 45% zu steigern</b>"
    FALSCH: "<b>Wir arbeiten mit verschiedenen Kunden in der Branche zusammen und haben River Island geholfen, ihre Effizienz um 45% zu steigern</b>"

    Call-to-Action-Absatz:

    NUR den konkreten Terminvorschlag hervorheben
    RICHTIG: "<b>Hätten Sie am nächsten Donnerstag um 11:00 Uhr Zeit für einen virtuellen Kaffee?</b>"
    FALSCH: "<b>Ich würde mich sehr über ein Treffen freuen. Hätten Sie am nächsten Donnerstag um 11:00 Uhr Zeit für einen virtuellen Kaffee?</b>"

    ALLGEMEINE HERVORHEBUNGSREGELN:

    Maximal EIN Satz in Fettschrift pro Absatz
    NUR den wichtigsten oder wirkungsvollsten Punkt hervorheben
    Kontextinformationen oder Verbindungswörter nicht hervorheben
    Fettgedruckte Sätze müssen unabhängig lesbar sein und vollständigen Sinn ergeben
    Hervorgehobener Text darf nicht mehr als 25% des Gesamtinhalts der E-Mail ausmachen

    BEISPIELE FÜR KORREKTE AUSGEWOGENHEIT:

    GUT (Selektive Hervorhebung):
    "Guten Tag Herr Schmidt,
    Ich verfolge Ihren Werdegang und <b>Ihre kürzliche internationale Expansion hat außergewöhnliche Ergebnisse erzielt</b>.
    Als spezialisierte Beratung <b>haben wir ähnlichen Unternehmen geholfen, ihre Expansionskosten um 40% zu reduzieren</b>.
    Wir arbeiten mit zahlreichen Kunden in der Branche und <b>haben kürzlich Company X geholfen, ihre Expansion 50% schneller abzuschließen</b>.
    <b>Hätten Sie am Donnerstag um 11:00 Uhr Zeit für ein Gespräch, um unsere Erfahrungen zu teilen?</b>
    Mit freundlichen Grüßen,"

    SCHLECHT (Zu viel Hervorhebung):
    "<b>Guten Tag Herr Schmidt,
    Ich verfolge Ihren Werdegang und Ihre kürzliche internationale Expansion hat außergewöhnliche Ergebnisse erzielt.
    Als spezialisierte Beratung haben wir ähnlichen Unternehmen geholfen, ihre Expansionskosten um 40% zu reduzieren.
    Wir arbeiten mit zahlreichen Kunden in der Branche und haben kürzlich Company X geholfen, ihre Expansion 50% schneller abzuschließen.
    Hätten Sie am Donnerstag um 11:00 Uhr Zeit für ein Gespräch, um unsere Erfahrungen zu teilen?</b>
    Mit freundlichen Grüßen,"

    PERSONALISIERUNGSANFORDERUNGEN:

    Muss auf mindestens ein spezifisches Detail Bezug nehmen aus:

    Ihren LinkedIn-Beiträgen (falls verfügbar)
    Unternehmensbeschreibung
    Rolle und Verantwortlichkeiten
    Branchenkontext

    Klare Recherche und Verständnis ihres Geschäfts zeigen
    Ihre Herausforderungen mit Ihrer Lösung verbinden, ohne werblich zu sein

    Ihre Antwort sollte NUR den E-Mail-Text enthalten, der die vorgegebene Struktur befolgt und die Beispiel-E-Mail als Referenz für Ton und Stil verwendet. Erstellen Sie eine hochgradig personalisierte Nachricht, die zeigt, dass Sie ihr Profil gründlich analysiert haben und ihren Kontext verstehen.

    WICHTIG: Dieser Prompt muss AUSSCHLIESSLICH Antworten in standardisiertem Geschäftsdeutsch generieren. Die förmliche Sie-Form verwenden und typisch deutsche Geschäftsausdrücke und -formulierungen einsetzen.

    BEISPIELE FÜR KORREKTES GESCHÄFTSDEUTSCH:

    Förmliche Anrede: "Sehr geehrter Herr/Sehr geehrte Frau", "Mit freundlichen Grüßen"
    Deutsche Terminologie: "Termin", "Besprechung", "Geschäftsführer"
    Deutsche Geschäftsformulierungen: "Ich freue mich auf Ihre Rückmeldung", "Gerne stehe ich Ihnen für Rückfragen zur Verfügung"
    Uhrzeiten im 24-Stunden-Format: "11:00 Uhr" oder "11.00 Uhr" (nicht "11 AM")
  `;
}