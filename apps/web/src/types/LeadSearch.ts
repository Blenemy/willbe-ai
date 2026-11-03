interface Lead {
  id: string;
  type: string;
  first_name: string;
  last_name: string;
  name: string;
  industry: string | null;
  location: string;
  headline: string;
  summary: string;
  public_identifier: string;
  hasSalesNavigator: boolean;
  public_profile_url: string;
  profile_url: string;
  profile_picture_url: string;
  profile_picture_url_large: string;
  network_distance: string;
  pending_invitation: boolean;
  member_urn: string;
  current_positions: {
    company: string;
    company_id: string;
    location: string;
    industry: string[];
    role?: string;
  }[];
}

export interface LeadSearchResponse {
  items: Lead[];
  cursor: string | null;
  paging: {
    start: number;
    page_count: number;
    total_count: number;
  };
  config: unknown;
  params: unknown;
  lastPageCursor: string;
  previousPageCursor?: string;
  pageIndex: number;
}
