export interface LeadTenure {
  years: number;
  months: number;
}

export interface LeadPosition {
  company: string;
  company_id: string;
  location: string;
  industry: string[];
  role: string;
  tenure_at_company: LeadTenure;
  tenure_at_role: LeadTenure;
}

export interface LeadData {
  type: string;
  id: string;
  industry: string;
  name: string;
  first_name: string;
  last_name: string;
  member_urn: string;
  public_identifier: string;
  public_profile_url: string;
  profile_url: string;
  profile_picture_url: string;
  profile_picture_url_large: string;
  network_distance: string;
  location: string;
  headline: string;
  summary: string;
  pending_invitation: boolean;
  current_positions: LeadPosition[];
  open_profile: boolean;
  premium: boolean;
  shared_connections_count: number;
  recent_posts_count: number;
}

export interface SavedLead {
  id: string;
  leadData: LeadData;
  leadScenarioId: string;
}
