import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { CompanyUserRole } from '@willbe-server/db-core';

export class CreateInvitationReq {
  @ApiProperty({ format: 'email' })
  @IsEmail()
  email: string;

  @ApiProperty({ enum: CompanyUserRole })
  @IsEnum(CompanyUserRole)
  role: CompanyUserRole;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  position: string;
}
