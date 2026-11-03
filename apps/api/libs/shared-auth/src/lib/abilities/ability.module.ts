import { Module } from '@nestjs/common';
import { AbilityFactory } from './ability.factory';
import { AbilityService } from './ability.service';

@Module({
  providers: [AbilityFactory, AbilityService],
  exports: [AbilityService],
})
export class AbilityModule {}
