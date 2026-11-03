
export interface IMessageEntry {
  id: string;
  messageScenarioId: string;
  type: MessageEntryType;
  sendDate: Date | string | null;
  sendDateUtc: Date | null;
  sendNow: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum MessageEntryType {
  FIRST_EMAIL = 'first_email',
  FOLLOW_UP_EMAIL = 'follow_up_email',
  LINKEDIN_CONNECTION = 'linkedin_connection',
  LINKEDIN_MESSAGE = 'linkedin_message',
  LINKEDIN_FOLLOW_UP = 'linkedin_follow_up',
}
