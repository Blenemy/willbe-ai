/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { ConfigService, ConfigType, registerAs } from '@nestjs/config';
import { SequelizeModuleOptions } from '@nestjs/sequelize';
import * as Joi from 'joi';

const DATABASE_CONFIG_KEY = 'database';

interface DbConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export const dbConfig = registerAs(
  DATABASE_CONFIG_KEY,
  (): DbConfig => ({
    host: process.env['DB_HOST']!,
    port: parseInt(process.env['DB_PORT']! || '5432', 10),
    username: process.env['DB_USER']!,
    password: process.env['DB_PASS']!,
    database: process.env['DB_NAME']!,
  })
);

export function getDbConfig(config: ConfigService): DbConfig {
  return config.getOrThrow<ConfigType<typeof dbConfig>>(DATABASE_CONFIG_KEY);
}

export const dbSequelizeConfig = (
  config: ConfigService
): SequelizeModuleOptions => {
  const dbCfg = getDbConfig(config);

  return {
    dialect: 'postgres',
    host: dbCfg.host,
    port: dbCfg.port,
    username: dbCfg.username,
    password: dbCfg.password,
    database: dbCfg.database,
    logging: config.get('DB_LOGGING') === 'true' ? console.log : false,
  };
};

export const dbValidationSchema = Joi.object({
  DB_HOST: Joi.string().required().description('Database host is required'),
  DB_PORT: Joi.number().default(5432).description('Database port with default'),
  DB_USER: Joi.string().required().description('Database user is required'),
  DB_PASS: Joi.string().required().description('Database password is required'),
  DB_NAME: Joi.string().required().description('Database name is required'),
});
