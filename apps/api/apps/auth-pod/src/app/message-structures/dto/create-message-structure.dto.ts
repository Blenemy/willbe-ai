import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MessageSubjectType, MessageType } from '@willbe-server/db-core';

export class CreateMessageStructureReq {
  @ApiProperty({
    example: 'First Email Template',
    description: 'Name of the message structure',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: MessageType.FIRST_EMAIL,
    description: 'Type of the message',
  })
  @IsEnum(MessageType)
  messageType: MessageType;

  @ApiProperty({
    example: 500,
    description: 'Maximum number of words of the message',
  })
  @IsNumber()
  @Min(1)
  wordsLimit: number;

  @ApiProperty({
    example: MessageSubjectType.ACCOUNT_COMPANY,
    description: 'Subject type of the message',
    required: false
  })
  @IsOptional()
  @IsEnum(MessageSubjectType)
  subjectType?: MessageSubjectType;
}
