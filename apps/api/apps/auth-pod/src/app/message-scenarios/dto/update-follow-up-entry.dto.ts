import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class UpdateFollowUpEntryDto {
  @ApiProperty({
    description: 'Message structure ID of the lead',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsUUID()
  messageStructureId: string;
}