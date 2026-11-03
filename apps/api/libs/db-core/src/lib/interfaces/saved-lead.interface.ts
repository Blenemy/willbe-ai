export interface ISavedLead {
  id: string;
  leadData: object;
  leadScenarioId: string | null;
  companyId: string | null; // ?
  
  accountId: string | null;
  hubspotContactId: string | null;

  isSyncedWithCrm: boolean;
}
