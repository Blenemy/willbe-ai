import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class FindAccountsQuery {
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  limit?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  cursor?: string;

  @ApiProperty({ required: false, description: 'Free-text search applied on top of the scenario filters' })
  @IsString()
  @IsOptional()
  query?: string;
}