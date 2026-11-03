import { MessageLanguage } from '@willbe-server/db-core';
import { buildLinkedinConnectionEnglishPrompt } from './linkedin-connection-english.prompt';
import { buildLinkedinConnectionSpanishPrompt } from './linkedin-connection-spanish.prompt';
import { buildLinkedinConnectionFrenchPrompt } from './linkedin-connection-french.prompt';
import { buildLinkedinConnectionGermanPrompt } from './linkedin-connection-german.prompt';
import { buildLinkedinConnectionItalianPrompt } from './linkedin-connection-italian.prompt';
import { buildLinkedinConnectionPortuguesePrompt } from './linkedin-connection-portuguese.prompt';
import { IBuildPromptData } from './linkedin-connection-english.prompt';

export function buildLinkedinConnectionPrompt(language: string, data: IBuildPromptData): string {
  const promptBuilders = {
    [MessageLanguage.EN]: buildLinkedinConnectionEnglishPrompt,
    [MessageLanguage.ES]: buildLinkedinConnectionSpanishPrompt,
    [MessageLanguage.FR]: buildLinkedinConnectionFrenchPrompt,
    [MessageLanguage.DE]: buildLinkedinConnectionGermanPrompt,
    [MessageLanguage.IT]: buildLinkedinConnectionItalianPrompt,
    [MessageLanguage.PT]: buildLinkedinConnectionPortuguesePrompt,
  };

  return promptBuilders[language](data);
}
