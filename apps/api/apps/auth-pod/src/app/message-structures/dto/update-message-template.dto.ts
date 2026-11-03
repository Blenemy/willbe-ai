import { IsArray, IsNumber, Min, IsOptional, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class MessageTemplateSectionDto {
  @ApiProperty({
    example: 'Increase brand awareness',
    description: 'Text of the message section (paragraph, introduction, goodbye)',
  })
  @IsString()
  text: string;

  @ApiProperty({
    example: 100,
    description: 'Maximum number of words in the message section',
  })
  @IsNumber()
  @Min(0)  
  wordsLimit: number;
}

export class UpdateMessageTemplateReq {
  @ApiProperty({
    example: 'Increase brand awareness',
    description: 'Objective of the message',
    required: false,
  })
  @IsString()
  @IsOptional()
  objective?: string;

  @ApiProperty({
    example: 'Partnership Opportunity',
    description: 'Subject of the message', 
    required: false,
  })
  @IsString()
  @IsOptional()
  subject?: string;

  @ApiProperty({
    example: 'Dear John',
    description: 'Greeting part of the message',
    required: false,
  })
  @IsString()
  @IsOptional()
  greeting?: string;

  @ApiProperty({
    example: { wordsLimit: 100, text: 'I hope this email finds you well.' },
    description: 'Introduction part of the message',
    type: MessageTemplateSectionDto,
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => MessageTemplateSectionDto)
  introduction?: MessageTemplateSectionDto;

  @ApiProperty({
    example: [{ wordsLimit: 100, text: 'I would like to discuss a potential partnership opportunity...' }],
    description: 'Paragraphs of the message',
    type: MessageTemplateSectionDto,
    isArray: true,
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MessageTemplateSectionDto)
  @IsOptional()
  paragraphs?: MessageTemplateSectionDto[];

  @ApiProperty({
    example: { wordsLimit: 100, text: 'Looking forward to your response.' },
    description: 'Goodbye part of the message',
    type: MessageTemplateSectionDto,
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => MessageTemplateSectionDto)
  goodbye?: MessageTemplateSectionDto;

  @ApiProperty({
    example: 'Dear Mr. Anderson, I would like to discuss a potential partnership...',
    description: 'Sample message',
    required: false,
  })
  @IsString()
  @IsOptional()
  sampleMessage?: string;
}