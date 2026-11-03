import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  generalConfig,
  generalValidationSchema,
} from './configs/general.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [generalConfig],
      validationSchema: generalValidationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
  ],
  controllers: [],
  providers: [],
  exports: [ConfigModule],
})
export class ConfigCoreModule {}
