import { ApiProperty } from '@nestjs/swagger';
import { MessageLanguage } from '@willbe-server/db-core';
import { IsEnum } from 'class-validator';

enum ExampleTemplateType {
  GREETING = 'greeting',
  INTRODUCTION = 'introduction',
  PARAGRAPH_1 = 'paragraph_1',
  PARAGRAPH_2 = 'paragraph_2',
  PARAGRAPH_3 = 'paragraph_3',
  GOODBYE = 'goodbye',
  SAMPLE_MESSAGE = 'sample_message',
}

export class FindExampleTemplatesDto {
  @ApiProperty({ enum: MessageLanguage })
  @IsEnum(MessageLanguage)
  language: MessageLanguage;

  @ApiProperty({ enum: ExampleTemplateType })
  @IsEnum(ExampleTemplateType)
  type: ExampleTemplateType;
}