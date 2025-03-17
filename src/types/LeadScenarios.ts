import { FilterValue } from "./LeadFilter";

export interface LeadScenarios {
  id: string;
  name: string;
  userId: string;
  filterId: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  filter: {
    id: string;
    name: string;
    filterValues: {
      filterKey: string;
      filterValue: FilterValue;
    }[];
  };
  user: { firstName: string; lastName: string };
}
