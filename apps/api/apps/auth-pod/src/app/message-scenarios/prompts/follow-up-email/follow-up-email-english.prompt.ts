import { Company, MessageEntryLeadData, MessageTemplate } from '@willbe-server/db-core';

export interface IBuildPromptData {
  messageTemplate: MessageTemplate;
  company: Company;
  messageEntryLeadData: MessageEntryLeadData;
  targetCompanyFullInfo: any;
}

export function buildFollowUpEmailEnglishPrompt(data: IBuildPromptData): string {
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
    YOU MUST generate ONLY the follow-up email text.
    PROHIBITED to include:
    - Explanatory notes or comments: (e.g., "This follow-up is personalized through...", "I have included references to...", "Note: The follow-up references...")
    - Analysis or justifications: (e.g., "The follow-up highlights key points...", "It focuses on...", "The approach focuses on...")
    - Metadata or annotations: (e.g., "Type: follow-up email", "Personalization: high", "Target: decision maker")
    - Text after the farewell: (e.g., lists of included features, explanations of personalizations made, analysis of approach used)
    - Any content that is not the follow-up itself: (e.g., "Here's the generated follow-up:", "This is the follow-up I've created:", "Here's the follow-up:")
    - Introductory phrases: (e.g., "I suggest the following follow-up:", "I've generated this follow-up:", "The follow-up would be like this:")

    The follow-up email MUST end at the last line of text, with no additional content.

    Hyperpersonalization is MANDATORY and must be based on:
    - The recipient's professional profile
    - Their current position and responsibilities
    - The provided LinkedIn activity (both personal and company)
    - Their company's description and sector
    - The content of the last messages sent (to avoid repetition)
    - The connection points between their needs and your value proposition

    CONTENT PRIORITIZATION:
    To ensure differentiation from the last messages sent:
    - Identify profile aspects NOT mentioned in the last messages
    - Establish different connections between posts/activities and your proposal
    - Avoid repeating references to content already mentioned in the last messages

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

    Potential customer information:

    Name: ${messageEntryLeadData.lead.leadData.name}
    Position: ${messageEntryLeadData.lead.leadData.current_positions[0].role}
    Position description: ${''}
    Professional summary: ${messageEntryLeadData.lead.leadData.summary}
    Potential customer's LinkedIn posts: ${''}

    EMAIL STRUCTURE AND FORMAT:

    Maximum total length: ${messageEntryLeadData.messageStructure.wordsLimit} words
    You MUST follow exactly this structure: ${messageTemplateString}
    This structure defines:

    Mandatory sections
    Word limits per section
    Information order

    REFERENCE EMAIL:
    Use this email as inspiration for tone and style: ${messageTemplate.sampleMessage}
    Note: This is only a reference example. Your email must:

    Follow this STRUCTURE AND FORMAT: ${messageTemplateString}
    Be uniquely hyperpersonalized for your potential customer using ALL provided information
    Reference different content based on your potential customer's specific information
    Establish clear connections between customer information and your value proposition

    LINKEDIN ENGAGEMENT REQUIREMENTS:
    If there are relevant posts:

    Reference:
    - Company posts
    - Potential customer's personal posts
    - Connect the activity with your value proposition

    IMPORTANT FORMAT RULES:

    CONTENT RESTRICTIONS:
    - No references to weather or atmospheric conditions
    - No mentions of seasons or seasonal references
    - Avoid phrases like:
      * "Hope you're enjoying a sunny day"
      * "With the arrival of spring..."
      * "In these hot days..."
      * "During this season..."

    No email subject
    No signature
    Use <b>text</b> format for key points (NEVER use asterisks ** or any other format)
    Avoid obvious commercial language

    Company Name Format:
    - First letter of each word capitalized
    - Convert uppercase names to title format

    Examples:
    "RIVER ISLAND" should be written as "River Island"
    "GUESS" should be written as "Guess"
    "BANCO SANTANDER" should be written as "Banco Santander"

    This applies to ALL mentions of ${targetCompanyFullInfo.data.name} in the email

    BOLD TAG REQUIREMENTS - MANDATORY:
    You MUST use <b> and </b> tags (NEVER asterisks **) to highlight ONLY the most impactful and relevant sentences in each paragraph. The goal is to highlight only the key points, not all content. Each paragraph must contain AT MOST ONE highlighted sentence representing the most important point.

    HIGHLIGHTING GUIDELINES PER PARAGRAPH:

    Contextualization:
    - Highlight ONLY the most relevant reference to previous contact
    CORRECT: "I wrote to you last week about <b>how we could help you optimize your international logistics process</b>."
    INCORRECT: "<b>I'm writing to you again because I haven't received a response to my previous email about international logistics</b>."

    Added Value:
    - Highlight ONLY the new relevant information
    CORRECT: "This week <b>we published a detailed analysis of how River Island reduced their logistics costs by 35%</b>."
    INCORRECT: "<b>As I mentioned in my last email, we've helped several companies reduce their logistics costs</b>."

    Main Benefit:
    - Highlight ONLY the updated key benefit
    CORRECT: "Looking at your recent projects, <b>we could help you achieve similar results in half the time</b>."
    INCORRECT: "<b>As I mentioned before, our solution can help you reduce time and costs</b>."

    Call to Action:
    - Highlight ONLY the concrete meeting proposal
    CORRECT: "<b>Would you be available for a 30-minute video call this Thursday at 10am?</b>"
    INCORRECT: "<b>I would like the opportunity to explain more details. Would you be available for a video call?</b>"

    IMPORTANT: This prompt should generate replies consistently in either American or British English. Once a variety is chosen for the email, maintain consistency throughout.

    EXAMPLES OF CONSISTENCY IN ENGLISH USAGE:
    - Choose and maintain consistent terminology (e.g., either "mobile/cell phone" consistently)
    - Use consistent spelling conventions throughout (e.g., either "-ise/-ization" or "-ize/-ization" consistently)
    - Maintain consistent time format throughout (e.g., stick to either "10:00" or "10am" format)
    - Use consistent grammar and punctuation conventions throughout the email
  `;
}
