/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

const GOOGLE_CONFIG_KEY = 'google-config';

interface GoogleConfig {
  clientId: string;
  clientSecret: string;
  callbackUrl: string;
}

export const googleConfig = registerAs(
  GOOGLE_CONFIG_KEY,
  (): GoogleConfig => ({
    clientId: process.env['GOOGLE_CLIENT_ID']!,
    clientSecret: process.env['GOOGLE_CLIENT_SECRET']!,
    callbackUrl: process.env['GOOGLE_CALLBACK_URL']!,
  })
);

export const sendGridValidationSchema = Joi.object({
  GOOGLE_CLIENT_ID: Joi.string()
    .required()
    .description('Google client ID'),
  GOOGLE_CLIENT_SECRET: Joi.string()
    .required()
    .description('Google client secret'),
  GOOGLE_CALLBACK_URL: Joi.string()
    .required()
    .description('Google callback URL'),
});
