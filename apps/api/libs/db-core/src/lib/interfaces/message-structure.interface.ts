import { IMessageTemplate, MessageSubjectType } from './message-template.interface';

export class IMessageStructure {
  id: string;
  name: string;
  messageType: MessageType;
  subjectType: MessageSubjectType;
  wordsLimit: number;
  userId: string;
  templates: IMessageTemplate[];
  createdAt: Date;
  updatedAt: Date;
}

export enum MessageType {
  FIRST_EMAIL = 'first_email',
  FOLLOW_UP_EMAIL = 'follow_up_email',
  LINKEDIN_CONNECTION = 'linkedin_connection',
  LINKEDIN_MESSAGE = 'linkedin_message',
  LINKEDIN_FOLLOW_UP = 'linkedin_follow_up',
}
