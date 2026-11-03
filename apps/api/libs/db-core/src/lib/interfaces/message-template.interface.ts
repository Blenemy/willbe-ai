export interface IMessageTemplate {
  id: string;
  objective: string;
  subject: string;
  greeting: string;
  introduction: IMessageTemplateSection;
  paragraphs: IMessageTemplateSection[];
  goodbye: IMessageTemplateSection;
  sampleMessage: string;
  language: MessageLanguage;
  messageStructureId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMessageTemplateSection {
  wordsLimit: number;
  text: string;
}

export enum MessageLanguage {
  ES = 'es',
  EN = 'en',
  FR = 'fr',
  PT = 'pt',
  DE = 'de',
  IT = 'it',
  HE = 'he',
}

export enum MessageSubjectType {
  ACCOUNT_COMPANY = 'account_company',
  ACCOUNT_COMPANY_TEXT = 'account_company_text',
  TEXT = 'text',
}
