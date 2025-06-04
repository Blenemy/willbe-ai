type UUID = string;

interface FilterValue {
  id: UUID;
  accountScenarioId: UUID;
  filterKey: string;
  filterValue: string;
}

export interface AccountScenario {
  id: UUID;
  name: string;
  userId: UUID;
  createdAt: string;
  filterValues: FilterValue[];
}
