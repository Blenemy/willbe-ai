
export interface ICompany {
  id: string;
  name: string;
  description: string;
  shortDescription: string | null;
  sector: string;
  autoSyncCrm: boolean;
}