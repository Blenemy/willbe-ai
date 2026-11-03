import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsUUID } from 'class-validator';
import { UpdateMessageEntryLeadDto } from './update-message-entry-lead.dto';

export class BulkUpdateMessageEntryLeadsDto extends OmitType(UpdateMessageEntryLeadDto, ['email', 'phone'] as const) {
  @ApiProperty({
    description: 'IDs of the message entry lead data records to update',
    type: [String],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('all', { each: true })
  leadIds: string[];
}
