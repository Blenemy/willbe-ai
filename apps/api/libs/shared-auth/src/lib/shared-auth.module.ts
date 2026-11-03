import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { baseModels, DbCoreModule } from '@willbe-server/db-core';
import {
  jwtConfig,
  jwtFactoryConfig,
  jwtValidationSchema,
} from './config/jwt.config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { googleConfig } from './config/google.config';
import { LinkedInStrategy } from './strategies/linkedin.strategy';
import { MicrosoftStrategy } from './strategies/microsoft.strategy';
import { GoogleAccountsStrategy } from './strategies/google-accounts.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [jwtConfig, googleConfig],
      validationSchema: jwtValidationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    DbCoreModule.forRoot([...baseModels]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return jwtFactoryConfig(configService);
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [JwtStrategy, GoogleStrategy, LinkedInStrategy, MicrosoftStrategy, GoogleAccountsStrategy],
  exports: [JwtStrategy, JwtModule, GoogleStrategy, LinkedInStrategy, MicrosoftStrategy, GoogleAccountsStrategy],
})
export class SharedAuthModule {}
