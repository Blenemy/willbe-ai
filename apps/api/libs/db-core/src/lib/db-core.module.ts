import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  dbConfig,
  dbSequelizeConfig,
  dbValidationSchema,
} from './config/db.config';
import { ModelCtor } from 'sequelize-typescript';

@Module({})
export class DbCoreModule {
  static forRoot(models: ModelCtor[] = []): DynamicModule {

    return {
      module: DbCoreModule,
      imports: [
        ConfigModule.forRoot({
          load: [dbConfig],
          validationSchema: dbValidationSchema,
          validationOptions: {
            allowUnknown: true,
            abortEarly: true,
          },
        }),
        SequelizeModule.forFeature(models),
        SequelizeModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => {
            return {
              ...dbSequelizeConfig(configService),
              models: models,
              autoLoadModels: false,
            };
          },
          inject: [ConfigService],
        }),
      ],
      exports: [SequelizeModule, SequelizeModule.forFeature(models)],
    };
  }
}
