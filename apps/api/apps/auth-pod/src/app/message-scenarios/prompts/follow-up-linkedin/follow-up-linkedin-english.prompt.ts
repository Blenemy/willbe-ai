import { Company, MessageEntryLeadData, MessageTemplate } from '@willbe-server/db-core';

export interface IBuildPromptData {
  messageTemplate: MessageTemplate;
  company: Company;
  messageEntryLeadData: MessageEntryLeadData;
  targetCompanyFullInfo: any;
}

export function buildFollowUpLinkedinEnglishPrompt(data: IBuildPromptData): string {
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
    YOU MUST generate ONLY the LinkedIn follow-up message text.
    PROHIBITED to include:
    - Explanatory notes or comments: (e.g., "This follow-up is personalized through...", "I have included references to...", "Note: The follow-up references...")
    - Analysis or justifications: (e.g., "The follow-up highlights key points...", "It focuses on...", "The approach focuses on...")
    - Metadata or annotations: (e.g., "Type: follow-up message", "Personalization: high", "Target: decision maker")
    - Text after the farewell: (e.g., lists of included features, explanations of personalizations made, analysis of approach used)
    - Any content that is not the follow-up itself: (e.g., "Here's the generated follow-up:", "This is the follow-up I've created:", "Here's the follow-up:")
    - Introductory phrases: (e.g., "I suggest the following follow-up:", "I've generated this follow-up:", "The follow-up would be like this:")

    The follow-up message MUST end at the last line of text, with no additional content.

    Hyperpersonalization is MANDATORY and must be based on:
    - The recipient's professional profile
    - Their current position and responsibilities
    - The provided LinkedIn activity (both personal and company)
    - Their company's description and sector
    - The content of the last messages sent (to avoid repetition)
    - The connection points between their needs and your value proposition

    CONTENT PRIORITIZATION:
    To ensure differentiation from the last messages:
    - Identify profile aspects NOT mentioned in recent contacts
    - Establish different connections between the posts/activities and your proposition
    - Avoid repeating references to content already mentioned in recent messages

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
    Target company LinkedIn activity: ${''}
    Last messages sent: ${''}

    Potential client information:

    Name: ${messageEntryLeadData.lead.leadData.name}
    Position: ${messageEntryLeadData.lead.leadData.current_positions[0].role}
    Position description: ${''}
    Professional summary: ${messageEntryLeadData.lead.leadData.summary}
    Potential client's LinkedIn posts: ${''}

    MESSAGE STRUCTURE AND FORMAT:

    Maximum total length: ${messageEntryLeadData.messageStructure.wordsLimit} words
    You MUST follow this structure exactly: ${messageTemplateString}
    This structure defines:

    Mandatory sections
    Word limits per section
    Information order

    REFERENCE MESSAGE:
    Use this message as inspiration for tone and style: ${messageTemplate.sampleMessage}
    Note: This is only a reference example. Your message must:

    Follow the structure defined in ${messageTemplateString}
    Be uniquely hyperpersonalized for your potential client using ALL provided information
    Reference different content based on your potential client's specific information
    Establish clear connections between client information and your value proposition

    LINKEDIN ENGAGEMENT REQUIREMENTS:
    If there are relevant posts:

    Reference:
    - Company posts
    - Potential client's personal posts
    - Connect the activity to your value proposition

    CONTENT RESTRICTIONS:
    - Do not make references to weather or atmospheric conditions
    - Do not mention seasons or seasonal references
    - Avoid phrases like:
      * "I hope you're having a sunny day"
      * "With the arrival of spring..."
      * "In these hot days..."
      * "During this season..."

    Company Name Format:
    - First letter of each word capitalized
    - Convert uppercase names to title format

    Examples:
    "RIVER ISLAND" should be written as "River Island"
    "GUESS" should be written as "Guess"
    "BANCO SANTANDER" should be written as "Banco Santander"

    This applies to ALL mentions of ${targetCompanyFullInfo.data.name} in the message

    IMPORTANT: This prompt must generate responses that are consistently either in American or British English throughout. Choose ONE variant and maintain it consistently in the output.

    LANGUAGE CONSISTENCY EXAMPLES:
    If using American English:
    - Use American spellings: "personalize", "customize", "organization"
    - American date format: MM/DD/YYYY
    - Time format: "11:00 AM" or "11 AM"

    If using British English:
    - Use British spellings: "personalise", "customise", "organisation"
    - British date format: DD/MM/YYYY
    - Time format: "11.00" or "11:00"

    Choose ONE variant and maintain consistency throughout the output.
  `;
}
