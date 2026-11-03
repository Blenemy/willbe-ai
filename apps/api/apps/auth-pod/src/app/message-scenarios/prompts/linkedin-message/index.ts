import { MessageLanguage } from '@willbe-server/db-core';
import { IBuildPromptData } from './linkedin-message-english.prompt';
import { buildLinkedinMessageEnglishPrompt } from './linkedin-message-english.prompt';
import { buildLinkedinMessageSpanishPrompt } from './linkedin-message-spanish.prompt';
import { buildLinkedinMessageFrenchPrompt } from './linkedin-message-french.prompt';
import { buildLinkedinMessageGermanPrompt } from './linkedin-message-german.prompt';
import { buildLinkedinMessageItalianPrompt } from './linkedin-message-italian.prompt';
import { buildLinkedinMessagePortuguesePrompt } from './linkedin-message-portuguese.prompt';


export function buildLinkedinMessagePrompt(language: string, data: IBuildPromptData): string {
  const promptBuilders = {
    [MessageLanguage.EN]: buildLinkedinMessageEnglishPrompt,
    [MessageLanguage.ES]: buildLinkedinMessageSpanishPrompt,
    [MessageLanguage.FR]: buildLinkedinMessageFrenchPrompt,
    [MessageLanguage.DE]: buildLinkedinMessageGermanPrompt,
    [MessageLanguage.IT]: buildLinkedinMessageItalianPrompt,
    [MessageLanguage.PT]: buildLinkedinMessagePortuguesePrompt,
  };

  return promptBuilders[language](data);
}
