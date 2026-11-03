import { MessageLanguage } from '@willbe-server/db-core';
import { IBuildPromptData } from './follow-up-linkedin-english.prompt';
import { buildFollowUpLinkedinEnglishPrompt } from './follow-up-linkedin-english.prompt';
import { buildFollowUpLinkedinSpanishPrompt } from './follow-up-linkedin-spanish.prompt';
import { buildFollowUpLinkedinFrenchPrompt } from './follow-up-linkedin-french.prompt';
import { buildFollowUpLinkedinGermanPrompt } from './follow-up-linkedin-german.prompt';
import { buildFollowUpLinkedinItalianPrompt } from './follow-up-linkedin-italian.prompt';
import { buildFollowUpLinkedinPortuguesePrompt } from './follow-up-linkedin-portuguese.prompt';

export function buildFollowUpLinkedinPrompt(language: string, data: IBuildPromptData): string {
  const promptBuilders = {
    [MessageLanguage.EN]: buildFollowUpLinkedinEnglishPrompt,
    [MessageLanguage.ES]: buildFollowUpLinkedinSpanishPrompt,
    [MessageLanguage.FR]: buildFollowUpLinkedinFrenchPrompt,
    [MessageLanguage.DE]: buildFollowUpLinkedinGermanPrompt,
    [MessageLanguage.IT]: buildFollowUpLinkedinItalianPrompt,
    [MessageLanguage.PT]: buildFollowUpLinkedinPortuguesePrompt,
  };

  return promptBuilders[language](data);
}
