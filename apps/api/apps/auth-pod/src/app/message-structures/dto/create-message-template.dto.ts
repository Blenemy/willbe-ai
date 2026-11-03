
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { MessageLanguage } from '@willbe-server/db-core';

export class CreateMessageTemplateReq {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID of the associated message structure',
  })
  @IsUUID()
  @IsNotEmpty()
  messageStructureId: string;

  @ApiProperty({
    enum: MessageLanguage,
    example: MessageLanguage.EN,
    description: 'Language of the message template',
  })
  @IsEnum(MessageLanguage)
  language: MessageLanguage;

  @ApiProperty({
    enum: MessageLanguage,
    example: MessageLanguage.EN,
    description: 'Language of the message template',
    required: false,
  })
  @IsEnum(MessageLanguage)
  @IsOptional()
  translateFromLanguage?: MessageLanguage;
}
