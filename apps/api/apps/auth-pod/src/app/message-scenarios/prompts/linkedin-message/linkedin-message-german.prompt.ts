import { IBuildPromptData } from './linkedin-message-english.prompt';

export function buildLinkedinMessageGermanPrompt(data: IBuildPromptData): string {
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
    Sie MÜSSEN NUR den LinkedIn-Nachrichtentext generieren.
    VERBOTEN zu inkludieren:
    - Erklärende Notizen oder Kommentare: (z.B. "Diese Nachricht wurde personalisiert durch...", "Ich habe Bezüge eingefügt zu...", "Hinweis: Die Nachricht bezieht sich auf...")
    - Analysen oder Begründungen: (z.B. "Die Nachricht hebt die Kernpunkte hervor...", "Sie konzentriert sich auf...", "Der Ansatz konzentriert sich auf...")
    - Metadaten oder Anmerkungen: (z.B. "Nachrichtentyp: LinkedIn", "Personalisierung: hoch", "Zielgruppe: Entscheider")
    - Text nach der Grußformel: (z.B. Listen von enthaltenen Funktionen, Erklärungen zu Personalisierungen, Analyse des verwendeten Ansatzes)
    - Jeglicher Inhalt, der nicht die Nachricht selbst ist: (z.B. "Hier ist die generierte Nachricht:", "Dies ist die Nachricht, die ich erstellt habe:", "Hier ist die Nachricht:")
    - Einleitende Sätze: (z.B. "Ich schlage folgende Nachricht vor:", "Ich habe diese Nachricht generiert:", "Die Nachricht würde so aussehen:")

    Die Nachricht MUSS in der letzten Textzeile enden, ohne zusätzliche Inhalte.

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
    Aktuelle LinkedIn-Beiträge des Zielunternehmens: ${''} (MUSS erwähnt werden, falls verfügbar)

    Informationen zum potenziellen Kunden:
    Name: ${messageEntryLeadData.lead.leadData.name}
    Position: ${messageEntryLeadData.lead.leadData.current_positions[0].role}
    Stellenbeschreibung: ${''}
    Beruflicher Werdegang: ${messageEntryLeadData.lead.leadData.summary}
    Aktuelle LinkedIn-Beiträge des potenziellen Kunden: ${''} (MUSS erwähnt werden, falls verfügbar)

    STRUKTUR UND FORMAT DER NACHRICHT:
    Maximale Gesamtlänge: ${messageEntryLeadData.messageStructure.wordsLimit} Wörter
    Sie MÜSSEN diese Struktur befolgen: ${messageTemplateString}
    Diese Struktur definiert:
    - Pflichtabschnitte
    - Wortbegrenzungen pro Abschnitt
    - Reihenfolge der Informationen

    REFERENZNACHRICHT:
    Verwenden Sie diese Nachricht als Inspiration für Ton und Stil: ${messageTemplate.sampleMessage}
    Hinweis: Auch wenn Sie die oben genannte Referenznachricht verwenden, muss Ihre Nachricht:
    - Der Struktur in ${messageTemplateString} folgen
    - Einzigartig auf Ihren potenziellen Kunden zugeschnitten sein
    - Sich auf unterschiedliche Inhalte beziehen, basierend auf den Informationen Ihres potenziellen Kunden

    LINKEDIN-ENGAGEMENT-ANFORDERUNGEN:
    Wenn LinkedIn-Beiträge verfügbar sind:
    Es ist VERPFLICHTEND, sich auf spezifische Inhalte ihrer aktuellsten Beiträge zu beziehen:
    - Aktuelle LinkedIn-Beiträge des potenziellen Kunden und aktuelle LinkedIn-Beiträge des Zielunternehmens
    - Die aktuellen LinkedIn-Beiträge des potenziellen Kunden haben Vorrang
    - Ihre LinkedIn-Aktivitäten nutzen, um Verständnis für ihre aktuellen Prioritäten zu demonstrieren
    - Ihre veröffentlichten Inhalte mit dem Wertversprechen verbinden
    - Zeigen, wie Ihre Lösung mit den Themen zusammenhängt, die sie aktiv diskutieren

    WICHTIGE FORMATIERUNGSREGELN:
    - Professioneller, aber persönlicher Ton
    - Offensichtliche Werbesprache vermeiden

    INHALTLICHE EINSCHRÄNKUNGEN:
    - Keine Bezugnahme auf das Wetter
    - Keine Erwähnung von Jahreszeiten oder saisonalen Bezügen
    - Vermeiden Sie Phrasen wie:
      * "Ich hoffe, Sie genießen den sonnigen Tag"
      * "Mit dem Einzug des Frühlings..."
      * "An diesen warmen Tagen..."
      * "In dieser Jahreszeit..."

    Format für Unternehmensnamen:
    - Erster Buchstabe jedes Wortes groß
    - Großgeschriebene Namen in Titelformat umwandeln
    Beispiele:
    - "RIVER ISLAND" muss als "River Island" geschrieben werden
    - "GUESS" muss als "Guess" geschrieben werden
    - "BANCO SANTANDER" muss als "Banco Santander" geschrieben werden
    Dies gilt für ALLE Erwähnungen von ${company.name} in der Nachricht

    PERSONALISIERUNGSANFORDERUNGEN:
    Muss sich auf mindestens ein spezifisches Detail beziehen aus:
    - Deren LinkedIn-Beiträge (falls verfügbar)
    - Unternehmensbeschreibung
    - Rolle und Verantwortlichkeiten
    - Branchenkontext
    - Klare Recherche und Verständnis ihres Geschäfts zeigen
    - Ihre Herausforderungen mit Ihrer Lösung verbinden, ohne werblich zu sein

    Ihre Antwort darf NUR den LinkedIn-Nachrichtentext enthalten, der der bereitgestellten Struktur folgt und die Beispielnachricht als Referenz für Ton und Stil verwendet. Erstellen Sie eine hochgradig personalisierte Nachricht, die zeigt, dass Sie ihr Profil gründlich analysiert haben und ihren Kontext verstehen.

    WICHTIG: Dieser Prompt muss AUSSCHLIESSLICH Antworten in deutschem Hochdeutsch generieren. Verwenden Sie die formelle Anrede "Sie" und nutzen Sie Vokabular und Ausdrücke, die in Deutschland üblich sind.

    BEISPIELE FÜR KORREKTES HOCHDEUTSCH:
    - Formelle Anrede verwenden: "Sind Sie interessiert...?", "Ihr Unternehmen..."
    - Deutsche Terminologie: "Computer", "Handy", "E-Mail"
    - Deutsche Ausdrücke: "in Ordnung", "prima", "gerne"
    - Uhrzeiten im 24-Stunden-Format: "11 Uhr" oder "11:00 Uhr" (nicht "11 AM")
  `;
}