import { FindLeadsRes } from './lead-scenario.interface';

export interface ISearchLeadsResult {
  id: string;
  data: any;
  cursor: string;
  leadScenarioId: string;
  createdAt: Date;
  updatedAt: Date;
}
