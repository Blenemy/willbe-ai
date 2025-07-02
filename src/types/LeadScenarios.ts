import { FilterValue } from "./LeadFilter";

export interface LeadScenarios {
  id: string;
  name: string;
  userId: string;
  filterId: string;
  createdAt: string;
  updatedAt: string;
  lastPageCursor?: string;
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

export interface Lead {
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
  current_positions: [
    {
      company: string;
      company_id: string;
      location: string;
      industry: string[];
      role: string;
      tenure_at_company: {
        years: number;
        months: number;
      };
      tenure_at_role: {
        years: number;
        months: number;
      };
    }
  ];
  open_profile: boolean;
  premium: boolean;
  shared_connections_count: number;
  recent_posts_count: number;
}
