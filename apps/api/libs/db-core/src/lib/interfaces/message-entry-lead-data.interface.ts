import { MessageLanguage } from './message-template.interface';

export interface IMessageEntryLeadData {
  id: string;
  messageEntryId: string;
  leadId: string;
  email: string;
  phone: string;
  language: MessageLanguage;
  messageStructureId: string;
  productServiceId: string;
  message: string;
  status: LeadCampaignStatus;
  createdAt: Date;
  updatedAt: Date;
}

export enum LeadCampaignStatus {
  IN_CADENCE = 'in_cadence',
  RESPONSE = 'response',
  MEETING = 'meeting',
  BOUNCED = 'bounced',
}
