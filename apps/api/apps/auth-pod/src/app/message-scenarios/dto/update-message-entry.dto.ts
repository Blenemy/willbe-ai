import { MessageEntryType } from '@willbe-server/db-core';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsISO8601, IsOptional } from 'class-validator';

export class UpdateMessageEntryReq {
  @ApiProperty({
    example: MessageEntryType.FIRST_EMAIL,
    description: 'Type of message entry',
    required: false,
  })
  @IsOptional()
  @IsEnum(MessageEntryType)
  type?: MessageEntryType;

  @ApiProperty({
    example: new Date(),
    description: 'Date to be send',
    required: false,
  })
  @IsOptional()
  @IsISO8601()
  sendDate?: string;

  @ApiProperty({
    example: false,
    description: 'Send now',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  sendNow?: boolean;
}