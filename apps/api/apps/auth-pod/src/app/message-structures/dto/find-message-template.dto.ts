import { ApiProperty } from '@nestjs/swagger';
import { MessageLanguage } from '@willbe-server/db-core';
import { IsEnum, IsUUID } from 'class-validator';

export class FindMessageTemplateDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID of the associated message structure',
  })
  @IsUUID()
  structureId: string;

  @ApiProperty({
    enum: MessageLanguage,
    example: MessageLanguage.EN,
    description: 'Language of the message template',
  })
  @IsEnum(MessageLanguage)
  language: MessageLanguage;
}