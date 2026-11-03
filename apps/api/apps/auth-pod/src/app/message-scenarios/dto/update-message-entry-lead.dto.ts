import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { MessageLanguage } from '@willbe-server/db-core';
import { ApiProperty } from '@nestjs/swagger';
import { LeadCampaignStatus } from '@willbe-server/db-core';

export class UpdateMessageEntryLeadDto {
  @ApiProperty({
    description: 'Email of the lead',
    example: 'john.doe@example.com',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'Phone of the lead',
    example: '+1234567890',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  phone?: string;

  @ApiProperty({
    description: 'Message of the lead',
    example: 'Hello, how are you?',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  message?: string;

  @ApiProperty({
    description: 'Language of the lead',
    example: MessageLanguage.EN,
    required: false,
    enum: MessageLanguage,
  })
  @IsEnum(MessageLanguage)
  @IsOptional()
  language?: MessageLanguage;
  
  @ApiProperty({
    description: 'Message structure ID of the lead',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  messageStructureId?: string;

  @ApiProperty({
    description: 'Product service ID of the lead',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  productServiceId?: string;

  @ApiProperty({
    description: 'Status of the lead',
    example: LeadCampaignStatus.IN_CADENCE,
    required: false,
    enum: LeadCampaignStatus,
  })
  @IsOptional()
  @IsEnum(LeadCampaignStatus)
  status?: LeadCampaignStatus;
}
