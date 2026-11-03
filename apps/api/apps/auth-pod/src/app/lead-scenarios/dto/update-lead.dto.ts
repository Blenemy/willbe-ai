import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateLeadReq {
  @ApiProperty({  
    description: 'The first name of the lead',
    example: 'John',
    required: false,
  })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({
    description: 'The last name of the lead',
    example: 'Doe',
    required: false,
  })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({
    description: 'The position of the lead',
    example: 'Software Engineer',
    required: false,
  })
  @IsString()
  @IsOptional()
  position?: string;

  @ApiProperty({
    description: 'The position description of the lead',
    example: 'Software Engineer',
    required: false,
  })
  @IsString()
  @IsOptional()
  positionDescription?: string;

  @ApiProperty({
    description: 'The email of the lead',
    example: 'john.doe@example.com',
    required: false,
  })
  @IsString()
  @IsOptional()
  email?: string;
  
  @ApiProperty({
    description: 'The phone of the lead',
    example: '+1234567890',
    required: false,
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({
    description: 'The company of the lead',
    example: 'Willbe',
    required: false,
  })
  @IsString()
  @IsOptional()
  company?: string;

  @ApiProperty({
    description: 'The industry of the lead',
    example: 'Software',
    required: false,
  })
  @IsString()
  @IsOptional()
  industry?: string;

  @ApiProperty({
    description: 'The language of the lead',
    example: 'English',
    required: false,
  })
  @IsString()
  @IsOptional()
  language?: string;

  @ApiProperty({
    description: 'The country of the lead',
    example: 'United States',
    required: false,
  })
  @IsString()
  @IsOptional()
  locationCountry?: string;

  @ApiProperty({
    description: 'The city of the lead',
    example: 'New York',
    required: false,
  })
  @IsString()
  @IsOptional()
  locationCity?: string;

  @ApiProperty({
    description: 'The subtitle of the lead',
    example: 'Software Engineer',
    required: false,
  })
  @IsString()
  @IsOptional()
  subtitle?: string;

  @ApiProperty({
    description: 'The summary of the lead',
    example: 'Software Engineer',
    required: false,
  })
  @IsString()
  @IsOptional()
  summary?: string;

  @ApiProperty({
    description: 'The linkedin of the lead',
    example: 'https://www.linkedin.com/in/john-doe',
    required: false,
  })
  @IsString()
  @IsOptional()
  linkedin?: string;
}

export class CreateLeadReq extends UpdateLeadReq {
  @ApiProperty({
    description: 'ID of associated account',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  })
  @IsUUID('4')
  accountId: string;
}