import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateMessageScenarioReq {
  @ApiProperty({
    example: 'Message Scenario',
    description: 'Name of the message scenario',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
