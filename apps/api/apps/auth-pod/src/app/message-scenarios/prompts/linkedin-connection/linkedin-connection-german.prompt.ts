import { IBuildPromptData } from './linkedin-connection-english.prompt';

export function buildLinkedinConnectionGermanPrompt(data: IBuildPromptData): string {
  const { messageTemplate, company, messageEntryLeadData, targetCompanyFullInfo} = data;

  return `
    ${messageTemplate.objective}

    KRITISCHE FORMATBESCHRÄNKUNG:
    Sie MÜSSEN NUR den Text der Kontaktanfrage generieren.
    VERBOTEN zu inkludieren:
    - Erklärende Notizen oder Kommentare: (z.B. "Diese Anfrage wurde personalisiert durch...", "Ich habe Bezüge eingefügt zu...", "Hinweis: Die Anfrage bezieht sich auf...")
    - Analysen oder Begründungen: (z.B. "Die Anfrage hebt die Kernpunkte hervor...", "Sie konzentriert sich auf...", "Der Ansatz konzentriert sich auf...")
    - Metadaten oder Anmerkungen: (z.B. "Typ: Kontaktanfrage", "Personalisierung: hoch", "Zielgruppe: Entscheider")
    - Text nach der Grußformel: (z.B. Listen von enthaltenen Funktionen, Erklärungen zu Personalisierungen, Analyse des verwendeten Ansatzes)
    - Jeglicher Inhalt, der nicht die Anfrage selbst ist: (z.B. "Hier ist die generierte Anfrage:", "Dies ist die Anfrage, die ich erstellt habe:", "Hier ist die Anfrage:")
    - Einleitende Sätze: (z.B. "Ich schlage folgende Anfrage vor:", "Ich habe diese Anfrage generiert:", "Die Anfrage würde so aussehen:")

    Die Nachricht MUSS in der letzten Textzeile enden, ohne zusätzliche Inhalte. Beachten Sie, dass diese Nachricht auf 200 Zeichen begrenzt ist.

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
    STRIKTE maximale Länge: 200 Zeichen (einschließlich Leerzeichen und Satzzeichen)
    WICHTIG: Die Nachricht wird abgelehnt, wenn sie 200 Zeichen überschreitet
    Hinweis: Diese Beschränkung hat Vorrang vor ${messageEntryLeadData.messageStructure.wordsLimit} Wörtern

    REFERENZNACHRICHT:
    Verwenden Sie diese Nachricht als Inspiration für Ton und Stil: ${messageTemplate.sampleMessage}
    Hinweis: Dies ist ein Referenzbeispiel. Ihre Nachricht muss:
    - Einzigartig auf Ihren potenziellen Kunden zugeschnitten sein
    - Sich auf unterschiedliche Inhalte beziehen, basierend auf den Informationen Ihres potenziellen Kunden
    - Strikt die 200-Zeichen-Grenze einhalten

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
    - Knapp und direkt aufgrund der 200-Zeichen-Begrenzung

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
    Dies gilt für ALLE Erwähnungen von ${targetCompanyFullInfo.data.name} in der Nachricht

    PERSONALISIERUNGSANFORDERUNGEN:
    Muss sich auf mindestens ein spezifisches Detail beziehen aus:
    - Deren LinkedIn-Beiträge (falls verfügbar)
    - Unternehmensbeschreibung
    - Rolle und Verantwortlichkeiten
    - Branchenkontext
    - Klare Recherche und Verständnis ihres Geschäfts zeigen
    - Ihre Herausforderungen mit Ihrer Lösung verbinden, ohne werblich zu sein

    Ihre Antwort darf NUR den Text der Kontaktanfrage enthalten, wobei die Beispielnachricht als Referenz für Ton und Stil verwendet wird. Erstellen Sie eine hochgradig personalisierte Nachricht, die zeigt, dass Sie ihr Profil gründlich analysiert haben und ihren Kontext verstehen.

    WICHTIG: Dieser Prompt muss AUSSCHLIESSLICH Antworten in deutschem Hochdeutsch generieren. Verwenden Sie die formelle Anrede "Sie" und nutzen Sie Vokabular und Ausdrücke, die in Deutschland üblich sind.

    BEISPIELE FÜR KORREKTES HOCHDEUTSCH:
    - Formelle Anrede verwenden: "Sind Sie interessiert...?", "Ihr Unternehmen..."
    - Deutsche Terminologie: "Computer", "Handy", "E-Mail"
    - Deutsche Ausdrücke: "in Ordnung", "prima", "gerne"
    - Uhrzeiten im 24-Stunden-Format: "11 Uhr" oder "11:00 Uhr" (nicht "11 AM")
  `;
}
