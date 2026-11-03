import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserLanguage } from '@willbe-server/db-core';

export class UpdateUserReq {
  @ApiProperty({
    format: 'email',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  firstName?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  lastName?: string;

  @ApiProperty({
    enum: UserLanguage,
  })
  @IsEnum(UserLanguage)
  @IsOptional()
  language?: UserLanguage;
}
