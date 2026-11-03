import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateLeadScenarioReq {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}
