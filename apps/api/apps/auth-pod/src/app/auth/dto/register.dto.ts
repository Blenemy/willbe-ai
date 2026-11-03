import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { UserAuthProvider } from '@willbe-server/db-core';
export class RegistrationReq {
  @ApiProperty({
    example: 'John',
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    example: 'Doe',
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    format: 'email',
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  password: string;
}

export type SocialMediaRegistrationReq = Omit<RegistrationReq, 'password'> & { authProvider: UserAuthProvider };

export class RegistrationRes {
  message: string;
  accessToken: string;
  refreshToken: string;
}
