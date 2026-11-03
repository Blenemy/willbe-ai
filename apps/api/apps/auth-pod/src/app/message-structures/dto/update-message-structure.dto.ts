import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MessageSubjectType, MessageType } from '@willbe-server/db-core';

export class UpdateMessageStructureReq {
  @ApiProperty({
    example: 'First Email Template',
    description: 'Name of the message structure',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: MessageType.FIRST_EMAIL,
    description: 'Type of the message',
    required: false,
  })
  @IsEnum(MessageType)
  @IsOptional()
  messageType?: MessageType;

  @ApiProperty({
    example: 500,
    description: 'Maximum number of words of the message',
    required: false,
  })
  @IsNumber()
  @Min(1)
  @IsOptional()
  wordsLimit?: number;

  @ApiProperty({
    example: MessageSubjectType.ACCOUNT_COMPANY,
    description: 'Subject type of the message',
    required: false,
  })
  @IsEnum(MessageSubjectType)
  @IsOptional()
  subjectType?: MessageSubjectType;
}
