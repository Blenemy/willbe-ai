import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateMessageScenarioWithLeadsReq {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The ID of the lead scenario to create the message scenario from',
  })
  @IsUUID('4')
  @IsNotEmpty()
  leadScenarioId: string;

  @ApiProperty({
    example: ['123e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174001'],
    description: 'The IDs of the saved leads to add to the message scenario',
  })
  @IsArray()
  @IsUUID('4', { each: true })
  leadsIds: string[];
}
