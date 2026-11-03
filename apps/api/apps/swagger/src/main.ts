import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import https from 'https';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { NestAppConfiguration } from '@willbe-server/config-core';
import { merge } from 'openapi-merge';
import { OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const httpsAgent = new https.Agent({ rejectUnauthorized: false });

  const app = await NestFactory.create(AppModule);
  const config = app.get<ConfigService>(ConfigService);

  const authPodUrl = config.get('AUTH_POD_URL');

  const swaggerPath = NestAppConfiguration.swaggerPath + '-json';
  const authPodDocs = await axios.get(`${authPodUrl}/${swaggerPath}`, { httpsAgent });

  const mergedDocs = merge([
    {
      oas: authPodDocs.data,
      pathModification: {
        prepend: '/auth',
      },
    },
  ]);

  const swaggerDocument: OpenAPIObject = mergedDocs['output'];
  swaggerDocument.info.title = 'willbe API';
  swaggerDocument.servers = [
    {
      url: authPodUrl,
      description: 'Auth service',
    },
  ];

  SwaggerModule.setup('api-docs', app, swaggerDocument, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
      displayRequestDuration: true,
      docExpansion: 'list',
      filter: true,
    },
  });

  const port = process.env.PORT || 4000;
  await app.listen(port);

  Logger.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap();
