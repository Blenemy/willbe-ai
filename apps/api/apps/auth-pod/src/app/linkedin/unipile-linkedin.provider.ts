import { HttpService } from '@nestjs/axios';
import { BadRequestException, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { unipileConfig } from '@willbe-server/shared-auth';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { UnipileClient } from 'unipile-node-sdk';
import {
  LinkedinCompanyProfile,
  LinkedinProvider,
  LinkedinSearchBody,
  LinkedinSearchOptions,
  LinkedinSearchPage,
  LinkedinSearchParameter,
} from './linkedin.provider';

const UNIPILE_API_BASE = 'https://api2.unipile.com:13216/api/v1';

export class UnipileLinkedinProvider extends LinkedinProvider {
  readonly isMock = false;

  private readonly logger = new Logger(UnipileLinkedinProvider.name);
  private readonly client: UnipileClient;

  constructor(
    private readonly httpService: HttpService,
    private readonly cfg: ConfigType<typeof unipileConfig>,
  ) {
    super();
    this.client = new UnipileClient(cfg.apiUrl, cfg.apiKey);
  }

  private get headers() {
    return {
      accept: 'application/json',
      'content-type': 'application/json',
      'X-API-KEY': this.cfg.apiKey,
    };
  }

  async search(
    accountId: string,
    body: LinkedinSearchBody,
    options: LinkedinSearchOptions = {},
  ): Promise<LinkedinSearchPage> {
    let endpoint = `${UNIPILE_API_BASE}/linkedin/search?account_id=${accountId}`;
    if (options.limit) {
      endpoint += `&limit=${options.limit}`;
    }
    if (options.cursor) {
      endpoint += `&cursor=${options.cursor}`;
    }

    const res = await firstValueFrom(
      this.httpService.post(endpoint, body, { headers: this.headers }).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.message);
          throw new BadRequestException(`Failed to find ${body.category === 'people' ? 'leads' : 'accounts'}`);
        }),
      ),
    );

    return res.data;
  }

  async searchParameters(accountId: string, type: string, keywords?: string): Promise<LinkedinSearchParameter[]> {
    const res = await firstValueFrom(
      this.httpService
        .get(`${UNIPILE_API_BASE}/linkedin/search/parameters`, {
          params: { keywords, type, account_id: accountId },
          headers: this.headers,
        })
        .pipe(
          catchError(() => {
            throw new BadRequestException('Unable to retrieve parameters');
          }),
        ),
    );

    return res.data.items;
  }

  async getCompany(accountId: string, companyId: string): Promise<LinkedinCompanyProfile> {
    const res = await firstValueFrom(
      this.httpService
        .get(`${UNIPILE_API_BASE}/linkedin/company/${companyId}?account_id=${accountId}`, {
          headers: this.headers,
        })
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.message);
            throw new BadRequestException('Failed to find company');
          }),
        ),
    );

    return res.data;
  }

  async createHostedAuthLink(userId: string): Promise<string> {
    const expiresOn = new Date();
    expiresOn.setDate(expiresOn.getDate() + 1);

    const data = await this.client.account.createHostedAuthLink({
      type: 'create',
      expiresOn: expiresOn.toISOString(),
      api_url: this.cfg.apiUrl,
      providers: ['LINKEDIN'],
      success_redirect_url: this.cfg.linkedinAuthRedirectUrl,
      failure_redirect_url: this.cfg.linkedinAuthRedirectUrl,
      notify_url: this.cfg.linkedinAuthNotifyUrl,
      name: userId,
    });

    return data.url;
  }

  async hasSalesNavigator(accountId: string): Promise<boolean> {
    const account = await this.client.account.getOne(accountId);
    const { premiumFeatures } = account.connection_params['im'];
    return premiumFeatures.includes('sales_navigator');
  }

  async deleteAccount(accountId: string): Promise<void> {
    await this.client.account.delete(accountId);
  }

  async sendInvitation(accountId: string, providerId: string, message?: string | null): Promise<void> {
    await this.client.users.sendInvitation({
      account_id: accountId,
      provider_id: providerId,
      message: message ?? null,
    });
  }

  async sendMessage(accountId: string, attendeeId: string, text: string): Promise<void> {
    const formData = new FormData();
    formData.append('attendees_ids', attendeeId);
    formData.append('account_id', accountId);
    formData.append('text', text);

    await firstValueFrom(
      this.httpService.post(`${UNIPILE_API_BASE}/chats`, formData, {
        headers: { accept: 'application/json', 'X-API-KEY': this.cfg.apiKey },
      }),
    );
  }
}
