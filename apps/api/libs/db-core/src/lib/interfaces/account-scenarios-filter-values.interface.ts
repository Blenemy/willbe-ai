import { AccountScenarioFilterKey } from './account-scenario.interface';
import { LeadScenarioFilterValue } from './lead-scenario.interface';

export interface IAccountScenariosFilterValues {
  id: string;
  accountScenarioId: string;
  filterKey: AccountScenarioFilterKey | string;
  filterValue: LeadScenarioFilterValue;
}
