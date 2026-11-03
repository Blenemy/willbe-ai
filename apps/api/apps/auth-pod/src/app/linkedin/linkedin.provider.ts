export type LinkedinSearchCategory = 'people' | 'companies';

export type LinkedinSearchBody = {
  api: 'sales_navigator';
  category: LinkedinSearchCategory;
} & Record<string, unknown>;

export interface LinkedinSearchOptions {
  limit?: number;
  cursor?: string;
}

export interface LinkedinSearchPage<T = unknown> {
  object: 'LinkedinSearch';
  items: T[];
  config: { params: Record<string, unknown> };
  paging: {
    start: number;
    page_count: number;
    total_count: number;
  };
  cursor: string | null;
}

export interface LinkedinSearchParameter {
  id: string;
  title: string;
}

export interface LinkedinCompanyProfile {
  id: string;
  name: string;
  description: string;
  industry: string[];
  industries: string[];
  logo_large: string | null;
  website: string | null;
  profile_url: string;
  locations: { city: string; country: string; area: string }[];
  employee_count_range: { from: number; to: number } | null;
}

/**
 * Source of LinkedIn / Sales Navigator data and actions.
 * Responses follow the Unipile API format, which the rest of the app and the web client rely on.
 */
export abstract class LinkedinProvider {
  abstract readonly isMock: boolean;

  abstract search(
    accountId: string,
    body: LinkedinSearchBody,
    options?: LinkedinSearchOptions,
  ): Promise<LinkedinSearchPage>;

  abstract searchParameters(
    accountId: string,
    type: string,
    keywords?: string,
  ): Promise<LinkedinSearchParameter[]>;

  abstract getCompany(accountId: string, companyId: string): Promise<LinkedinCompanyProfile>;

  abstract createHostedAuthLink(userId: string): Promise<string>;

  abstract hasSalesNavigator(accountId: string): Promise<boolean>;

  abstract deleteAccount(accountId: string): Promise<void>;

  abstract sendInvitation(accountId: string, providerId: string, message?: string | null): Promise<void>;

  abstract sendMessage(accountId: string, attendeeId: string, text: string): Promise<void>;
}
