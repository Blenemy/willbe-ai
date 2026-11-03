import { MessageLanguage } from '@willbe-server/db-core';
import { IBuildPromptData } from '../linkedin-connection/linkedin-connection-english.prompt';
import { buildFirstEmailEnglishPrompt } from './first-email-english.prompt';
import { buildFirstEmailSpanishPrompt } from './first-email-spanish.prompt';
import { buildFirstEmailGermanPrompt } from './first-email-german.prompt';
import { buildFirstEmailItalianPrompt } from './first-email-italian.prompt';
import { buildFirstEmailPortuguesePrompt } from './first-email-portuguese.prompt';
import { buildFirstEmailFrenchPrompt } from './first-email.french.prompt';
import { buildFirstEmailHebrewPrompt } from './first-email-hebrew.prompt';

export function buildFirstEmailPrompt(language: string, data: IBuildPromptData): string {
  const promptBuilders = {
    [MessageLanguage.EN]: buildFirstEmailEnglishPrompt,
    [MessageLanguage.ES]: buildFirstEmailSpanishPrompt,
    [MessageLanguage.FR]: buildFirstEmailFrenchPrompt,
    [MessageLanguage.DE]: buildFirstEmailGermanPrompt,
    [MessageLanguage.IT]: buildFirstEmailItalianPrompt,
    [MessageLanguage.PT]: buildFirstEmailPortuguesePrompt,
    [MessageLanguage.HE]: buildFirstEmailHebrewPrompt,
  };

  return promptBuilders[language](data);
}
