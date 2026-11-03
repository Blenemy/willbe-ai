import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IsArray } from 'class-validator';

export class MessageEntriesDataIdsDto {
  @ApiProperty({
    example: ['123e4567-e89b-12d3-a456-426614174000'],
    type: [String],
    description: 'Message entry data IDs',
    required: true,
  })
  @IsArray()
  @IsString({ each: true })
  messageEntryDataIds: string[];
}
