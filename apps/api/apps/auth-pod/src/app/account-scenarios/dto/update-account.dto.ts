import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateAccountReq {
  @ApiProperty({
    description: 'The title of the account',
    example: 'Willbe',
    required: false,
  })
  @IsString()
  @IsOptional()
  companyTitle?: string;

  @ApiProperty({
    description: 'The founded year of the account',
    example: '2020',
    required: false,
  })
  @IsString()
  @IsOptional()
  foundedIn?: string;

  @ApiProperty({
    description: 'The headquarters of the account',
    example: 'San Francisco',
    required: false,
  })
  @IsString()
  @IsOptional()
  headquarters?: string;

  @ApiProperty({
    description: 'The employees of the account',
    example: '100',
    required: false,
  })
  @IsString()
  @IsOptional()
  employees?: string;

  @ApiProperty({
    description: 'The industry of the account',
    example: 'Software',
    required: false,
  })
  @IsString()
  @IsOptional()
  industry?: string;

  @ApiProperty({
    description: 'The website of the account',
    example: 'https://willbe.ai',
    required: false,
  })
  @IsString()
  @IsOptional()
  website?: string;

  @ApiProperty({
    description: 'The linkedin of the account',
    example: 'https://linkedin.com/company/willbe',
    required: false,
  })
  @IsString()
  @IsOptional()
  linkedin?: string;

  @ApiProperty({
    description: 'The description of the account',
    example: 'Willbe is a software company',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}