import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsUUID, IsArray } from 'class-validator';

export class AccountRes {
  @ApiProperty({
    description: 'The ID of the account',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'The title of the account',
    example: 'Willbe',
  })
  companyTitle: string;

  @ApiProperty({
    description: 'The founded year of the account',
    example: '2020',
  })
  foundedIn: string;

  @ApiProperty({
    description: 'The headquarters of the account',
    example: 'San Francisco',
  })
  headquarters: string;

  @ApiProperty({
    description: 'The employees of the account',
    example: '100',
  })
  employees: string;

  @ApiProperty({
    description: 'The industry of the account',
    example: 'Software',
  })
  industry: string;

  @ApiProperty({
    description: 'The website of the account',
    example: 'https://willbe.ai',
  })
  website: string;

  @ApiProperty({
    description: 'The linkedin of the account',
    example: 'https://linkedin.com/company/willbe',
  })
  linkedin: string;

  @ApiProperty({
    description: 'The description of the account',
    example: 'Willbe is a software company',
  })
  description: string;

  @ApiProperty({
    description: 'The logo of the account',
    example: 'https://willbe.ai/logo.png',
  })
  logo: string;

  @ApiProperty({
    description: 'Whether the account is synced with Hubspot',
    example: true,
  })
  isConnectedToHubspot: boolean;
}

export class AccountLeadRes {
  @ApiProperty({
    description: 'The ID of the lead',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'The first name of the lead',
    example: 'John',
  })
  firstName: string;

  @ApiProperty({
    description: 'The last name of the lead',
    example: 'Doe',
  })
  lastName: string;

  @ApiProperty({
    description: 'The email of the lead',
    example: 'john.doe@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'The phone of the lead',
    example: '+1234567890',
  })
  phone: string;

  @ApiProperty({
    description: 'The role of the lead',
    example: 'Software Engineer',
  })
  role: string;
}

export class FindAccountLeadsReq {
  @ApiProperty({
    description: 'The keywords of the lead (first name, last name, email, role)',
    example: 'John Doe',
    required: false,
  })
  @IsString()
  @IsOptional()
  keywords?: string;

  @ApiProperty({
    description: 'The limit of the leads',
    example: 10,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  limit?: number;

  @ApiProperty({
    description: 'The offset of the leads',
    example: 0,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  offset?: number;
}

export class RemoveAccountsReq {
  @ApiProperty({ type: String, isArray: true })
  @IsArray()
  @IsUUID('4', { each: true })
  accountIds: string[]
}
