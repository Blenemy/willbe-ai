import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUUID } from 'class-validator';

export class AddLeadsToMessageScenarioReq {
  @ApiProperty({
    example: ['123e4567-e89b-12d3-a456-426614174000'],
    type: [String],
    description: 'An array of saved leads IDs',
  })
  @IsArray()
  @IsUUID('4', { each: true })
  leadsIds: string[];
}
