export interface AccountSearch {
  type: string;
  id: string;
  name: string;
  profile_url: string;
  summary: string;
  industry: string;
  location: string;
  headcount: number;
  logo: string;
  isSaved: boolean;
  messageStatus: string;
  lastSentMessageDate: string;
  lastSentMessageStatus: string;
  lastSentScenarioId: string;
  lastReceivedMessageDate: string;
  lastReceivedMessageStatus: string;
  lastReceivedScenarioId: string;
}
