/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

const MICROSOFT_CONFIG_KEY = 'microsoft-config';

interface MicrosoftConfig {
  clientId: string;
  clientSecret: string;
  callbackUrl: string;
}

export const microsoftConfig = registerAs(
  MICROSOFT_CONFIG_KEY,
  (): MicrosoftConfig => ({
    clientId: process.env['MICROSOFT_CLIENT_ID']!,
    clientSecret: process.env['MICROSOFT_CLIENT_SECRET']!,
    callbackUrl: process.env['MICROSOFT_CALLBACK_URL']!,
  })
);

export const microsoftValidationSchema = Joi.object({
  MICROSOFT_CLIENT_ID: Joi.string()
    .required()
    .description('Microsoft client ID'),
  MICROSOFT_CLIENT_SECRET: Joi.string()
    .required()
    .description('Microsoft client secret'),
  MICROSOFT_CALLBACK_URL: Joi.string()
    .required()
    .description('Microsoft callback URL'),
});
