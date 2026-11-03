
export interface ISentEmailMessage {
  id: string;
  emailMessageId: string;
  messageEntryLeadDataId: string;
  messageScenarioId: string;
  status: SentMessageStatus;
  sentAt: Date;
  respondedAt: Date;
}

export enum SentMessageStatus {
  SENT = 'sent',
  RESPONDED = 'responded',
  BOUNCED = 'bounced',
  NOT_ANSWERED = 'not_answered',
  OUT_OF_OFFICE = 'out_of_office',
}

export enum LeadMessageStatus {
  RESPONDED = 'responded',
  BOUNCED = 'bounced',
  NOT_ANSWERED = 'not_answered',
  OUT_OF_OFFICE = 'out_of_office',
}
