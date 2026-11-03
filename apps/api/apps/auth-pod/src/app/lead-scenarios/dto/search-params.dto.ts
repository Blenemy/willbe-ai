import { IsString, IsNotEmpty, IsIn, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { paramsTypes } from '../constants/params.constants';

export class SearchLinkedinParamsReq {
  @ApiProperty({
    enum: paramsTypes,
    description: 'Type of parameters to search for'
  })
  @IsIn(paramsTypes)
  type: string;
  
  @ApiProperty({
    description: 'Keywords to search for',
    example: 'manager'
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  keywords?: string;
}

export class SearchLinkedinParamsRes {
  id: string;
  title: string;
}
