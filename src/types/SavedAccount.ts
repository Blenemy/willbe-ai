export interface SavedAccount {
  id: string;
  accountScenarioId: string;
  createdAt: string;
  updatedAt: string;
  accountData: {
    id: string;
    name: string;
    summary: string;
    industry: string;
    headcount: string;
    location: string;
    profile_url: string;
    logo: string;
    website?: string;
    created_at?: string;
  };
}
