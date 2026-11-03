export type FilterValue =
  | string
  | boolean
  | string[]
  | {
      from?: string;
      to?: string;
    }
  | {
      include?: string[];
      exclude?: string[];
    };

export interface LeadFilter {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  filterValues: {
    filterKey: string;
    filterValue: FilterValue;
  }[];
}
