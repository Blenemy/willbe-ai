import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class UpdateUserPasswordReq {
  @ApiProperty({
    format: 'password',
  })
  @IsString()
  @MinLength(4)
  oldPassword: string;

  @ApiProperty({
    format: 'password',
  })
  @IsString()
  @MinLength(4)
  newPassword: string;
}
