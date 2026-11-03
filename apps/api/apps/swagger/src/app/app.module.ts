import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigCoreModule } from '@willbe-server/config-core';
import { HealthModule } from './health/health.module';

@Module({
  imports: [ConfigModule.forRoot(), ConfigCoreModule, HealthModule],
})
export class AppModule {}
