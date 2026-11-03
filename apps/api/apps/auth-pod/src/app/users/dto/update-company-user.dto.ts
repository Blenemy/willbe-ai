import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@willbe-server/db-core';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateCompanyUserReq {
  @ApiProperty({ enum: UserRole })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  position?: string;
}
