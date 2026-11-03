import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUUID } from 'class-validator';

export class GenerateLeadScenarioReq {
  @ApiProperty({})
  @IsUUID('4')
  accountScenarioId: string;

  @ApiProperty({ type: String, isArray: true })
  @IsArray()
  @IsUUID('4', { each: true })
  accountIds: string[];
}
