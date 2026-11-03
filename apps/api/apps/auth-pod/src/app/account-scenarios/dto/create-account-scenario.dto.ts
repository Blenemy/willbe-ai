import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAccountScenarioReq {
  @ApiProperty({
    example: 'Enterprise Companies',
    description: 'Account scenario name',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
} 