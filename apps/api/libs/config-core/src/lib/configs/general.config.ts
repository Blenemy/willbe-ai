/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { ConfigService, ConfigType, registerAs } from '@nestjs/config';
import * as Joi from 'joi';

const GENERAL_CONFIG_KEY = 'general';

export interface GeneralConfig {
  isDev: boolean;
  isProd: boolean;
  port?: number;
  allowedOrigins: string[];
}

export const generalConfig = registerAs(
  GENERAL_CONFIG_KEY,
  (): GeneralConfig => ({
    isDev: process.env['NODE_ENV']! === 'development',
    isProd: process.env['NODE_ENV']! === 'production',
    port: process.env['PORT'] ? parseInt(process.env['PORT']) : undefined,
    allowedOrigins: process.env['ALLOWED_ORIGINS']
      ? process.env['ALLOWED_ORIGINS'].split(',')
      : [],
  })
);

export function getGeneralConfig(config: ConfigService): GeneralConfig {
  return config.getOrThrow<ConfigType<typeof generalConfig>>(
    GENERAL_CONFIG_KEY
  );
}

export const generalValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production')
    .required()
    .description('Node environment is required'),
  ALLOWED_ORIGINS: Joi.string()
    .default('')
    .description('Comma-separated list of allowed origins for CORS'),
});
