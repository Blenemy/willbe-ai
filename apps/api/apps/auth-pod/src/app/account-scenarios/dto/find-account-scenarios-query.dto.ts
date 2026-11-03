import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class FindAccountScenariosQuery {
  @ApiProperty({
    example: 10,
    description: 'Number of records to skip',
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(0)
  offset?: number;

  @ApiProperty({
    example: 100,
    description: 'Number of records to take',
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  limit?: number;
}