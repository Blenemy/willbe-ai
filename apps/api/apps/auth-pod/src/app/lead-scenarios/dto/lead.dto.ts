import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray } from 'class-validator';

export class LeadRes {
  @ApiProperty({
    description: 'The id of the lead',
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
    description: 'The position of the lead',
    example: 'Software Engineer',
  })
  position: string;

  @ApiProperty({
    description: 'The position description of the lead',
    example: 'Software Engineer',
  })
  positionDescription: string;

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
    description: 'The company of the lead',
    example: 'Willbe',
  })
  company: string;

  @ApiProperty({
    description: 'The industry of the lead',
    example: 'Software',
  })
  industry: string;

  @ApiProperty({
    description: 'The language of the lead',
    example: 'English',
  })
  language: string;

  @ApiProperty({
    description: 'The country of the lead',
    example: 'United States',
  })
  locationCountry: string;

  @ApiProperty({
    description: 'The city of the lead',
    example: 'New York',
  })
  locationCity: string;

  @ApiProperty({
    description: 'The subtitle of the lead',
    example: 'Software Engineer',
  })
  subtitle: string;

  @ApiProperty({
    description: 'The summary of the lead',
    example: 'Software Engineer',
  })
  summary: string;

  @ApiProperty({
    description: 'The linkedin of the lead',
    example: 'https://www.linkedin.com/in/john-doe',
  })
  linkedin: string;

  @ApiProperty({
    description: 'Whether the lead is connected to Hubspot',
    example: true,
  })
  isConnectedToHubspot: boolean;
}

export class RemoveLeadsReq {
  @ApiProperty({
    description: 'The ids of the leads to remove',
    example: ['123e4567-e89b-12d3-a456-426614174000'],
  })
  @IsArray()
  @IsString({ each: true })
  leadIds: string[];
}