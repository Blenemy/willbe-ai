import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsString } from "class-validator";

export class SyncLeadsReq {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    isArray: true,
  })
  @IsArray()
  @IsString({ each: true })
  leadIds: string[];
}

export class SyncAccountsReq {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    isArray: true,
  })
  @IsArray()
  @IsString({ each: true })
  accountIds: string[];
}

export class UpdateAutoSyncReq {
  @ApiProperty()
  @IsBoolean()
  isAutoSync: boolean;
}