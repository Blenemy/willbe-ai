/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

const UNIPILE_CONFIG_KEY = 'unipile-config';

interface UnipileConfig {
  apiKey: string;
  apiUrl: string;
  linkedinAuthRedirectUrl: string;
  linkedinAuthNotifyUrl: string;
}

export const unipileConfig = registerAs(
  UNIPILE_CONFIG_KEY,
  (): UnipileConfig => ({
    apiKey: process.env['UNIPILE_API_KEY']!,
    apiUrl: process.env['UNIPILE_API_URL']!,
    linkedinAuthRedirectUrl: process.env['UNIPILE_LINKEDIN_AUTH_REDIRECT_URL']!,
    linkedinAuthNotifyUrl: process.env['UNIPILE_LINKEDIN_AUTH_NOTIFY_URL']!,
  })
);

export const unipileGridValidationSchema = Joi.object({
  UNIPILE_API_KEY: Joi.string()
    .required()
    .description('Unipile API key'),
  UNIPILE_API_URL: Joi.string()
    .required()
    .description('Unipile API url'),
  UNIPILE_LINKEDIN_AUTH_REDIRECT_URL: Joi.string()
    .required()
    .description('Unipile Linkedin auth redirect url'),
    UNIPILE_LINKEDIN_AUTH_NOTIFY_URL: Joi.string()
    .required()
    .description('Unipile Linkedin auth notify url'),
});
