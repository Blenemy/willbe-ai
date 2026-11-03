import { HttpService } from '@nestjs/axios';
import { Logger, Provider } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { unipileConfig } from '@willbe-server/shared-auth';
import { LinkedinProvider } from './linkedin.provider';
import { MockLinkedinProvider } from './mock/mock-linkedin.provider';
import { UnipileLinkedinProvider } from './unipile-linkedin.provider';

export const linkedinProviderFactory: Provider = {
  provide: LinkedinProvider,
  inject: [ConfigService, HttpService, unipileConfig.KEY],
  useFactory: (
    configService: ConfigService,
    httpService: HttpService,
    unipileCfg: ConfigType<typeof unipileConfig>,
  ): LinkedinProvider => {
    const provider = configService.get<string>('LINKEDIN_PROVIDER', 'mock');
    Logger.log(`LinkedIn provider: ${provider}`, 'LinkedinProvider');

    if (provider === 'unipile') {
      return new UnipileLinkedinProvider(httpService, unipileCfg);
    }

    const publicApiUrl = configService.get<string>('API_PUBLIC_URL', 'http://localhost:3000/auth');
    return new MockLinkedinProvider(publicApiUrl.replace(/\/$/, ''));
  },
};
