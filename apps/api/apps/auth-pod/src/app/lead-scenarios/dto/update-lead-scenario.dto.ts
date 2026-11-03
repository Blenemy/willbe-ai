import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { ScenarioStatus } from '@willbe-server/db-core';

export class UpdateLeadScenarioReq {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsUUID()
  @IsOptional()
  filterId?: string;

  @ApiProperty({ enum: ScenarioStatus })
  @IsEnum(ScenarioStatus)
  @IsOptional()
  status?: ScenarioStatus;
}
