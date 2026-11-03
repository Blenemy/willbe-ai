import { Company, MessageEntryLeadData, MessageTemplate } from '@willbe-server/db-core';

export interface IBuildPromptData {
  messageTemplate: MessageTemplate;
  company: Company;
  messageEntryLeadData: MessageEntryLeadData;
  targetCompanyFullInfo: any;
}

export function buildLinkedinConnectionEnglishPrompt(data: IBuildPromptData): string {
  const { messageTemplate, company, messageEntryLeadData, targetCompanyFullInfo} = data;

  return `
    ${messageTemplate.objective}

    CRITICAL FORMAT RESTRICTION:
    YOU MUST generate ONLY the connection message text.
    PROHIBITED to include:
    - Explanatory notes or comments: (e.g., "This message is personalized through...", "I have included references to...", "Note: The message references...")
    - Analysis or justifications: (e.g., "The message highlights key points...", "It focuses on...", "The approach focuses on...")
    - Metadata or annotations: (e.g., "Type: connection message", "Personalization: high", "Target: decision maker")
    - Text after the farewell: (e.g., lists of included features, explanations of personalizations made, analysis of approach used)
    - Any content that is not the message itself: (e.g., "Here's the generated message:", "This is the message I've created:", "Here's the message:")
    - Introductory phrases: (e.g., "I suggest the following message:", "I've generated this message:", "The message would be like this:")

    The message MUST end at the last line of text, with no additional content. Remember that this message has a 200-character limit.

    INPUT PARAMETERS:
    About your company:
    Company name: ${company.name}
    Industry: ${company.sector}
    Company description: ${company.shortDescription}

    Your offering:
    Product/service name: ${messageEntryLeadData.productService.name}
    Description: ${messageEntryLeadData.productService.shortDescription}

    Target company information:
    Company name: ${targetCompanyFullInfo.data.name}
    Company description: ${targetCompanyFullInfo.data.description}
    Industries: ${targetCompanyFullInfo.data.industry[0]}
    Recent LinkedIn posts from target company: ${''} (MANDATORY to mention if available)

    Potential client information:
    Name: ${messageEntryLeadData.lead.leadData.name}
    Position: ${messageEntryLeadData.lead.leadData.current_positions[0].role}
    Position description: ${''}
    Professional summary: ${messageEntryLeadData.lead.leadData.summary}
    Recent LinkedIn posts from potential client: ${''} (MANDATORY to mention if available)

    MESSAGE STRUCTURE AND FORMAT:
    STRICT maximum length: 200 characters (including spaces and punctuation)
    IMPORTANT: Message will be rejected if it exceeds 200 characters
    Note: This restriction takes precedence over ${messageEntryLeadData.messageStructure.wordsLimit} words

    REFERENCE MESSAGE:
    Use this message as inspiration for tone and style: ${messageTemplate.sampleMessage}
    Note: This is a reference example. Your message must:
    - Be uniquely personalized for your potential client
    - Reference different content based on your potential client's information
    - Strictly adhere to the 200-character limit

    LINKEDIN ENGAGEMENT REQUIREMENTS:
    If LinkedIn posts are available:
    It is MANDATORY to reference specific content from their most recent posts:
    - Recent LinkedIn posts from the potential client and recent LinkedIn posts from the target company
    - The potential client's recent LinkedIn posts take priority
    - Use their LinkedIn activity to demonstrate understanding of their current priorities
    - Connect their published content with the value proposition
    - Show how your solution relates to the topics they are actively discussing

    IMPORTANT FORMAT RULES:
    - Professional but approachable tone
    - Avoid obvious commercial language
    - Be concise and direct due to the 200-character limit

    CONTENT RESTRICTIONS:
    - No references to weather
    - No mentions of seasons or seasonal references
    - Avoid phrases like:
      * "Hope you're having a sunny day"
      * "With the arrival of spring..."
      * "In these warm days..."
      * "During this season..."

    Company Name Format:
    - First letter of each word capitalized
    - Convert uppercase names to title format
    Examples:
    - "RIVER ISLAND" should be written as "River Island"
    - "GUESS" should be written as "Guess"
    - "BANCO SANTANDER" should be written as "Banco Santander"
    This applies to ALL mentions of ${targetCompanyFullInfo.data.name} in the message

    PERSONALIZATION REQUIREMENTS:
    Must reference at least one specific detail from:
    - Their LinkedIn posts (if available)
    - Company description
    - Role and responsibilities
    - Industry context
    - Show clear research and understanding of their business
    - Connect their challenges with your solution without being promotional

    Your response must contain ONLY the connection message text, using the example message as reference for tone and style. Create a highly personalized message that demonstrates you've thoroughly reviewed their profile and understand their context.

    IMPORTANT: This prompt must generate responses in either American OR British English consistently throughout the message. Choose ONE version and stick to it throughout:

    For AMERICAN ENGLISH output:
    - Use American spelling (e.g., "personalized," "organization")
    - American terminology: "cell phone," "elevator," "vacation"
    - American date format: "March 15, 2024"
    - Times in 12-hour format: "11:00 AM" or "11 AM"
    - American expressions: "reach out," "touch base," "connect"
    - Example greetings: "Hi [Name]," "Hello [Name]"

    For BRITISH ENGLISH output:
    - Use British spelling (e.g., "personalised," "organisation")
    - British terminology: "mobile phone," "lift," "holiday"
    - British date format: "15 March 2024"
    - Times in 24-hour format: "11:00" or "11.00"
    - British expressions: "get in touch," "follow up," "liaise"
    - Example greetings: "Dear [Name]," "Good morning [Name]"

    The entire message must consistently follow either American OR British English conventions - do not mix them. Once you choose a version, maintain consistency throughout the message with spelling, terminology, date formats, and expressions.
  `;
}
