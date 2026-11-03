import { MessageLanguage } from '@willbe-server/db-core';
import { buildFollowUpEmailEnglishPrompt, IBuildPromptData } from './follow-up-email-english.prompt';
import { buildFollowUpEmailSpanishPrompt } from './follow-up-email-spanish.prompt';
import { buildFollowUpEmailFrenchPrompt } from './follow-up-email.french.prompt';
import { buildFollowUpEmailGermanPrompt } from './follow-up-email-german.prompt';
import { buildFollowUpEmailItalianPrompt } from './follow-up-email-italian.prompt';
import { buildFollowUpEmailPortuguesePrompt } from './follow-up-email-portuguese.prompt';

export function buildFollowUpEmailPrompt(language: string, data: IBuildPromptData): string {
  const promptBuilders = {
    [MessageLanguage.EN]: buildFollowUpEmailEnglishPrompt,
    [MessageLanguage.ES]: buildFollowUpEmailSpanishPrompt,
    [MessageLanguage.FR]: buildFollowUpEmailFrenchPrompt,
    [MessageLanguage.DE]: buildFollowUpEmailGermanPrompt,
    [MessageLanguage.IT]: buildFollowUpEmailItalianPrompt,
    [MessageLanguage.PT]: buildFollowUpEmailPortuguesePrompt,
  };

  return promptBuilders[language](data);
}
