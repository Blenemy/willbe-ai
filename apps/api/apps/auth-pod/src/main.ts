import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { NestAppConfiguration } from '@willbe-server/config-core';
import { AppModule } from './app/app.module';
import { DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // In production nginx mounted this service under /auth; locally the prefix is applied here instead.
  const globalPrefix = process.env['API_GLOBAL_PREFIX'];
  if (globalPrefix) {
    app.setGlobalPrefix(globalPrefix);
  }

  await new NestAppConfiguration(app)
    .addValidationPipe()
    .enableCors()
    .addSwagger(
      new DocumentBuilder()
        .addBearerAuth()
        .setTitle('willbe Auth Pod')
        .setVersion('0.0.1')
        .build()
    )
    .listen(3000);
}

bootstrap();
