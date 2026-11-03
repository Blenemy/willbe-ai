import { LeadScenarioFilterKey, LeadScenarioFilterValue } from './lead-scenario.interface';

export interface ILeadScenarioFilterValue {
  id: string;
  filterId: string;
  filterKey: LeadScenarioFilterKey | string;
  filterValue: LeadScenarioFilterValue
}
