import { ISavedLead } from './saved-lead.interface';

export interface IMessageScenario {
  id: string;
  name: string;
  status: MessageScenarioStatus;
  leads: ISavedLead[];
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum MessageScenarioStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
}
