import { MessageEntryType } from '@willbe-server/db-core';

export interface TemplateFallbackData {
  leadFirstName: string;
  leadRole?: string;
  targetCompanyName: string;
  targetIndustry?: string;
  senderCompanyName: string;
  productName: string;
  productSummary: string;
}

/**
 * Deterministic outreach copy used when no LLM key is configured,
 * so message campaigns can be demoed end to end offline.
 */
export function buildTemplateMessage(type: MessageEntryType, data: TemplateFallbackData): string {
  const { leadFirstName, leadRole, targetCompanyName, targetIndustry, senderCompanyName, productName } = data;
  const summary = data.productSummary.split(/(?<=\.)\s/)[0].trim();
  const industry = targetIndustry ? targetIndustry.toLowerCase() : 'your space';
  const role = leadRole ? ` as ${leadRole}` : '';

  switch (type) {
    case MessageEntryType.LINKEDIN_CONNECTION:
      return (
        `Hi ${leadFirstName}, I've been following how ${targetCompanyName} is growing in ${industry}. ` +
        `I work at ${senderCompanyName} and would be glad to connect and exchange ideas.`
      );

    case MessageEntryType.LINKEDIN_MESSAGE:
      return (
        `Thanks for connecting, ${leadFirstName}! ` +
        `Teams in ${industry} often tell us outbound takes too much manual research. ${summary} ` +
        `Would a short call next week to see if ${productName} fits ${targetCompanyName} be useful?`
      );

    case MessageEntryType.LINKEDIN_FOLLOW_UP:
      return (
        `Hi ${leadFirstName}, just bubbling this up in case it got buried. ` +
        `Happy to share a 2-minute overview of ${productName} if timing is better now.`
      );

    case MessageEntryType.FOLLOW_UP_EMAIL:
      return [
        `Hi ${leadFirstName},`,
        `Following up on my previous note about ${productName}. ` +
          `I put together a few ideas specific to ${targetCompanyName} and would love to walk you through them.`,
        `Would 15 minutes on Tuesday or Thursday work?`,
        `Best regards`,
      ].join('<br>');

    case MessageEntryType.FIRST_EMAIL:
    default:
      return [
        `Hi ${leadFirstName},`,
        `I noticed your work${role} at ${targetCompanyName} and thought this might be relevant.`,
        `${summary}`,
        `Companies in ${industry} use ${productName} to spend less time on research and more time in conversations with the right buyers.`,
        `Would you be open to a quick call to see whether it could help ${targetCompanyName}?`,
        `Best regards,<br>${senderCompanyName}`,
      ].join('<br>');
  }
}
