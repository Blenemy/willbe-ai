import { Company, MessageEntryLeadData, MessageTemplate } from '@willbe-server/db-core';

export interface IBuildPromptData {
  messageTemplate: MessageTemplate;
  company: Company;
  messageEntryLeadData: MessageEntryLeadData;
  targetCompanyFullInfo: any;
}

export function buildFirstEmailEnglishPrompt(data: IBuildPromptData): string {
  const { messageTemplate, company, messageEntryLeadData, targetCompanyFullInfo} = data;

  let messageTemplateString = `Greeting: ${messageTemplate.greeting}\n\n`;
  
  messageTemplateString += `Introduction (maximum number of words of the introduction section: ${messageTemplate.introduction.wordsLimit}): ${messageTemplate.introduction.text}`;
  messageTemplateString += 'The introduction should be personalized but not sales-focused.\n\n';

  messageTemplate.paragraphs.forEach((paragraph, index) => {
    messageTemplateString += `Paragraph ${index + 1} (maximum number of words of the Paragraph ${index + 1} section: ${paragraph.wordsLimit}): ${paragraph.text}\n\n`;
  });

  messageTemplateString += `Goodbye (maximum number of words of the Goodbye section: ${messageTemplate.goodbye.wordsLimit}): ${messageTemplate.goodbye.text}\n\n`;

  return `
    ${messageTemplate.objective}

    CRITICAL FORMAT RESTRICTION:
    YOU MUST generate ONLY the email text.
    PROHIBITED to include:
    - Explanatory notes or comments: (e.g., "This email is personalized through...", "I have included references to...", "Note: The email references...")
    - Analysis or justifications: (e.g., "The email highlights key points...", "It focuses on...", "The approach focuses on...")
    - Metadata or annotations: (e.g., "Email type: initial", "Personalization: high", "Target: decision maker")
    - Text after the farewell: (e.g., lists of included features, explanations of personalizations made, analysis of approach used)
    - Any content that is not the email itself: (e.g., "Here's the generated email:", "This is the email I've created:", "Here's the email:")
    - Introductory phrases: (e.g., "I suggest the following email:", "I've generated this email:", "The email would be like this:")

    The email MUST end at the last line of text, with no additional content.

    INPUT PARAMETERS:

    About your company:

    Company name: ${company.name}
    Sector: ${company.sector}
    Company description: ${company.shortDescription}

    Your offer:

    Product/service name: ${messageEntryLeadData.productService.name}
    Description: ${messageEntryLeadData.productService.shortDescription}

    Target company information:

    Company name: ${targetCompanyFullInfo.data.name}
    Company description: ${targetCompanyFullInfo.data.description}
    Sectors: ${targetCompanyFullInfo.data.industry[0]}
    Recent LinkedIn posts from target company: ${''} (MANDATORY to mention if available)

    Potential client information:

    Name: ${messageEntryLeadData.lead.leadData.name}
    Position: ${messageEntryLeadData.lead.leadData.current_positions[0].role}
    Position description: ${''}
    Professional summary: ${messageEntryLeadData.lead.leadData.summary}
    Recent LinkedIn posts from potential client: ${''} (MANDATORY to mention if available)

    EMAIL STRUCTURE AND FORMAT:

    Maximum total length: ${messageEntryLeadData.messageStructure.wordsLimit} words
    You MUST follow exactly this structure: ${messageTemplateString}

    This structure defines:

    Mandatory sections,
    Word limits per section,
    Information order

    REFERENCE EMAIL:
    Use this email as inspiration for tone and style: ${messageTemplate.sampleMessage}

    Note: This is just a reference example. Your email must:

    - Follow this STRUCTURE AND FORMAT: ${messageTemplateString}
    - Be uniquely personalized for your potential client
    - Reference different content based on your potential client's information

    LINKEDIN ENGAGEMENT REQUIREMENTS:
    If LinkedIn posts are available:

    It is MANDATORY to reference specific content from their most recent posts previously mentioned in the introduction:

    Recent LinkedIn posts from the potential client and recent LinkedIn posts from the target company. The potential client's recent LinkedIn posts take priority.

    Use LinkedIn activity to demonstrate understanding of their current priorities
    Connect their published content with the value proposition
    Show how your solution relates to the topics they are actively discussing

    IMPORTANT FORMATTING RULES:

    CONTENT RESTRICTIONS:
    - No references to weather or atmospheric conditions
    - No mention of seasons or seasonal references
    - Avoid phrases like:
      * "Hope you're having a sunny day"
      * "With the arrival of spring..."
      * "In these hot days..."
      * "During this season..."

    No email subject
    No signature
    Use format <b>text</b> for key points (NEVER use asterisks ** or any other format)
    Avoid obvious commercial language

    Company Name Format:

    First letter of each word capitalized
    Convert uppercase names to title format

    Examples:
    "RIVER ISLAND" should be written as "River Island"
    "GUESS" should be written as "Guess"
    "BANCO SANTANDER" should be written as "Banco Santander"

    This applies to ALL mentions of ${targetCompanyFullInfo.data.name} in the email

    BOLD TAG REQUIREMENTS - MANDATORY:
    You MUST use <b> and </b> tags (NEVER asterisks **) to highlight ONLY the most impactful and relevant sentences in each paragraph. The goal is to highlight only the key points, not all content. Each paragraph must contain AT MOST ONE highlighted sentence that represents the most important point.

    HIGHLIGHTING GUIDELINES PER PARAGRAPH:

    Opening/Introduction Paragraph:

    Highlight ONLY the most relevant observation about the potential client
    CORRECT: "I've been following your work and <b>your recent implementation of sustainable solutions has reduced environmental impact by 40%</b>"
    INCORRECT: "<b>I've been following your work and your recent implementation of sustainable solutions has reduced environmental impact by 40%</b>"

    Value Proposition Paragraph:

    Highlight ONLY the main benefit or key differentiator
    CORRECT: "Our platform offers multiple functionalities, and <b>we've helped similar companies reduce their operational costs by 30%</b>"
    INCORRECT: "<b>Our platform offers multiple functionalities, and we've helped similar companies reduce their operational costs by 30%</b>"

    Social Proof Paragraph:

    Highlight ONLY the most impactful achievement or result
    CORRECT: "We collaborate with various clients in the industry and <b>we've helped River Island increase their efficiency by 45%</b>"
    INCORRECT: "<b>We collaborate with various clients in the industry and we've helped River Island increase their efficiency by 45%</b>"

    Call to Action Paragraph:

    Highlight ONLY the concrete meeting proposal
    CORRECT: "<b>Would you be available for a 30-minute virtual coffee next Thursday at 11:00?</b>"
    INCORRECT: "<b>I would love the opportunity to meet. Would you be available for a 30-minute virtual coffee next Thursday at 11:00?</b>"

    GENERAL HIGHLIGHTING RULES: 

    Maximum ONE bold sentence per paragraph
    Highlight ONLY the most important or impactful point
    Avoid highlighting contextual information or connectors
    Bold sentences must be readable independently and maintain complete meaning
    Highlighted text should not exceed 25% of the total email content

    EXAMPLES OF CORRECT BALANCE:

    GOOD (Selective highlighting):
    "Hi John,
    I've been following your journey and <b>your recent international expansion has generated exceptional results</b>.
    From our specialized consultancy, <b>we've helped similar companies reduce their expansion costs by 40%</b>.
    We work with multiple clients in the sector and <b>recently helped Company X complete their expansion 50% faster</b>.
    <b>Would you be available for a meeting on Thursday at 11:00 to share our experience?</b>
    Best regards,"

    BAD (Too much highlighting):
    "<b>Hi John,
    I've been following your journey and your recent international expansion has generated exceptional results.
    From our specialized consultancy, we've helped similar companies reduce their expansion costs by 40%.
    We work with multiple clients in the sector and recently helped Company X complete their expansion 50% faster.
    Would you be available for a meeting on Thursday at 11:00 to share our experience?</b>
    Best regards,"

    PERSONALIZATION REQUIREMENTS:

    Must reference at least one specific detail from:

    Their LinkedIn posts (if available)
    Company description
    Role and responsibilities
    Industry context

    Show clear research and understanding of their business
    Connect their challenges with your solution without being promotional

    Your response should contain ONLY the email text, following the provided structure while using the example email as reference for tone and style. Create a highly personalized message that demonstrates you've thoroughly reviewed their profile and understand their context.

    LANGUAGE REQUIREMENTS:
    This prompt must generate responses in English, using EITHER British OR American English consistently throughout the email. Choose one variety and maintain consistency in spelling, terminology, and expressions throughout the entire response.

    Examples of consistency:

    If using American English:
    - "customize", "analyze", "organization"
    - "program", "catalog"
    - Times: "11:00 AM" or "11 AM"
    - Dates: "September 15, 2024"

    If using British English:
    - "customise", "analyse", "organisation"
    - "programme", "catalogue"
    - Times: "11:00" or "11.00"
    - Dates: "15 September 2024"

    The chosen variety must be maintained consistently throughout all parts of the email, including greetings, body text, and closings.
  `;
}
