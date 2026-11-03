import { EmailServiceType } from '../models/email-service-tokens.model';

export interface IEmailServiceTokens {
  id: string;
  accessToken: string;
  refreshToken: string;
  type: EmailServiceType,
  userId: string;
}
