import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule } from '@nestjs/swagger';
import { OpenAPIObject } from '@nestjs/swagger/dist/interfaces';
import { GeneralConfig, getGeneralConfig } from './configs/general.config';

export class NestAppConfiguration {
  static swaggerPath = 'api-docs';
  port?: number;
  private readonly generalCfg: GeneralConfig;

  constructor(public readonly nestApp: INestApplication) {
    const config = nestApp.get<ConfigService>(ConfigService);
    this.generalCfg = getGeneralConfig(config);
  }

  public app(): INestApplication {
    return this.nestApp;
  }

  public addValidationPipe(): this {
    this.nestApp.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: this.generalCfg.isDev,
        disableErrorMessages: this.generalCfg.isProd,
        transformOptions: {
          enableImplicitConversion: true,
        },
      })
    );

    return this;
  }

  public enableCors(): this {
    this.nestApp.enableCors({
      origin: (origin, callback) => {
        if (!origin || this.generalCfg.allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          Logger.warn(`Blocked request from unauthorized origin: ${origin}`);
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
    });

    return this;
  }

  public async listen(defaultPort: number): Promise<this> {
    const port = this.generalCfg.port || defaultPort;
    this.port = port;
    await this.nestApp.listen(port);

    Logger.log(`🚀 Application is running on: http://localhost:${port}`);
    return this;
  }

  public addSwagger(swaggerOptions: Omit<OpenAPIObject, 'paths'>): this {
    const swaggerDocument = SwaggerModule.createDocument(
      this.nestApp,
      swaggerOptions
    );

    SwaggerModule.setup(
      NestAppConfiguration.swaggerPath,
      this.nestApp,
      swaggerDocument,
      {
        swaggerOptions: {
          displayExtensions: true,
        },
      }
    );

    return this;
  }
}
