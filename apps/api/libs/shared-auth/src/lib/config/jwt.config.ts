/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { ConfigService, ConfigType, registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';
import * as Joi from 'joi';

const JWT_CONFIG_KEY = 'jwt';

interface JwtConfig {
  jwtSecret: string;
}

export const jwtConfig = registerAs(
  JWT_CONFIG_KEY,
  (): JwtConfig => ({
    jwtSecret: process.env['JWT_SECRET']!,
  })
);

export function getJwtConfig(config: ConfigService): JwtConfig {
  return config.getOrThrow<ConfigType<typeof jwtConfig>>(JWT_CONFIG_KEY);
}

export const jwtFactoryConfig = (config: ConfigService): JwtModuleOptions => {
  const jwtCfg = getJwtConfig(config);

  return {
    secret: jwtCfg.jwtSecret,
  };
};

export const jwtValidationSchema = Joi.object({
  JWT_SECRET: Joi.required().description(
    'JWT secret is required'
  ),
});
