export interface ISavedAccount {
  id: string;
  accountData: object;
  accountScenarioId: string | null;
  companyId: string | null;
  userId: string | null;
  hubspotCompanyId: string | null;
  isSyncedWithCrm: boolean;
}
