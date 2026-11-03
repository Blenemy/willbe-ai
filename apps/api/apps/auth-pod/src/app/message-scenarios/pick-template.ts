import { MessageLanguage, MessageTemplate } from '@willbe-server/db-core';

/** Template in the lead's language, falling back to English and then to any available template. */
export function pickTemplate(templates: MessageTemplate[], language: MessageLanguage): MessageTemplate | undefined {
  return (
    templates.find((template) => template.language === language) ??
    templates.find((template) => template.language === MessageLanguage.EN) ??
    templates[0]
  );
}
