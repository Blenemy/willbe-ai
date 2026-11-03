import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import {
  LinkedinCompanyProfile,
  LinkedinProvider,
  LinkedinSearchBody,
  LinkedinSearchOptions,
  LinkedinSearchPage,
  LinkedinSearchParameter,
} from '../linkedin.provider';
import { CatalogItem, departments, industries, jobTitles, locations, personas, schools, technologies } from './mock-catalog';
import { generateMockDataset, MockDataset } from './mock-dataset';
import {
  buildCompaniesPredicate,
  buildPeoplePredicate,
  toCompanyItem,
  toCompanyProfile,
  toPersonItem,
} from './mock-search';

const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 100;
const MAX_PARAMETERS = 25;

/**
 * Offline stand-in for Unipile / Sales Navigator backed by a deterministic generated dataset,
 * so the same ids resolve across restarts and saved leads keep pointing to existing companies.
 */
export class MockLinkedinProvider extends LinkedinProvider {
  readonly isMock = true;

  private readonly logger = new Logger(MockLinkedinProvider.name);
  private dataset?: MockDataset;

  constructor(private readonly hostedAuthBaseUrl: string) {
    super();
  }

  private get data(): MockDataset {
    if (!this.dataset) {
      this.dataset = generateMockDataset();
      this.logger.log(
        `Generated mock LinkedIn dataset: ${this.dataset.companies.length} companies, ${this.dataset.people.length} people`,
      );
    }
    return this.dataset;
  }

  async search(
    _accountId: string,
    body: LinkedinSearchBody,
    options: LinkedinSearchOptions = {},
  ): Promise<LinkedinSearchPage> {
    const start = this.decodeCursor(options.cursor);
    const limit = Math.min(Math.max(Number(options.limit) || DEFAULT_PAGE_SIZE, 1), MAX_PAGE_SIZE);

    const matches =
      body.category === 'people'
        ? this.data.people.filter(buildPeoplePredicate(body)).map(toPersonItem)
        : this.data.companies.filter(buildCompaniesPredicate(body)).map(toCompanyItem);

    const items = matches.slice(start, start + limit);
    const nextStart = start + items.length;

    return {
      object: 'LinkedinSearch',
      items,
      config: { params: { ...body } },
      paging: {
        start,
        page_count: items.length,
        total_count: matches.length,
      },
      cursor: nextStart < matches.length ? this.encodeCursor(nextStart) : null,
    };
  }

  async searchParameters(_accountId: string, type: string, keywords?: string): Promise<LinkedinSearchParameter[]> {
    const sources: Record<string, CatalogItem[]> = {
      JOB_TITLE: jobTitles,
      DEPARTMENT: departments,
      SCHOOL: schools,
      LOCATION: locations,
      INDUSTRY: industries,
      PERSONA: personas,
      TECHNOLOGIES: technologies,
      COMPANY: this.data.companies.map(({ id, name }) => ({ id, title: name })),
      SAVED_ACCOUNTS: [],
    };

    const query = keywords?.trim().toLowerCase() ?? '';
    return (sources[type] ?? [])
      .filter((item) => !query || item.title.toLowerCase().includes(query))
      .slice(0, MAX_PARAMETERS)
      .map(({ id, title }) => ({ id, title }));
  }

  async getCompany(_accountId: string, companyId: string): Promise<LinkedinCompanyProfile> {
    const company = this.data.companiesById.get(String(companyId));
    if (!company) {
      throw new NotFoundException(`Company ${companyId} not found`);
    }
    return toCompanyProfile(company);
  }

  async createHostedAuthLink(userId: string): Promise<string> {
    return `${this.hostedAuthBaseUrl}/users-accounts/linkedin/mock-auth?userId=${encodeURIComponent(userId)}`;
  }

  async hasSalesNavigator(): Promise<boolean> {
    return true;
  }

  async deleteAccount(accountId: string): Promise<void> {
    this.logger.log(`[mock] LinkedIn account ${accountId} disconnected`);
  }

  async sendInvitation(accountId: string, providerId: string, message?: string | null): Promise<void> {
    this.logger.log(`[mock] Invitation from ${accountId} to ${providerId}: ${message ?? '<no note>'}`);
  }

  async sendMessage(accountId: string, attendeeId: string, text: string): Promise<void> {
    this.logger.log(`[mock] Message from ${accountId} to ${attendeeId}: ${text.slice(0, 80)}`);
  }

  private encodeCursor(start: number): string {
    return Buffer.from(JSON.stringify({ start })).toString('base64url');
  }

  private decodeCursor(cursor?: string): number {
    if (!cursor) {
      return 0;
    }
    try {
      const { start } = JSON.parse(Buffer.from(cursor, 'base64url').toString('utf8'));
      if (Number.isInteger(start) && start >= 0) {
        return start;
      }
    } catch {
      // fall through
    }
    throw new BadRequestException('Invalid cursor');
  }
}
