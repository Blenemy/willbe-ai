import { MessageEntryType } from '@willbe-server/db-core';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsEnum, IsISO8601, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateMessageEntryReq {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Message scenario ID',
    required: true,
  })
  @IsOptional()
  @IsUUID('4')
  messageScenarioId?: string;

  @ApiProperty({
    example: MessageEntryType.FIRST_EMAIL,
    description: 'Type of message entry',
    required: false,
    enum: MessageEntryType,
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
    example: true,
    description: 'Send now',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  sendNow?: boolean;
}
