import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUUID } from 'class-validator';

export class FindLeadsByAccountsAndScenariosReq {
  @ApiProperty({
    example: ['123e4567-e89b-12d3-a456-426614174000'],
    type: [String],
    description: 'An array of saved accounts IDs',
  })
  @IsArray()
  @IsUUID('4', { each: true })
  accountsIds: string[];

  @ApiProperty({
    example: ['123e4567-e89b-12d3-a456-426614174000'],
    type: [String],
    description: 'An array of lead scenarios IDs',
  })
  @IsArray()
  @IsUUID('4', { each: true })
  leadScenariosIds: string[];
}