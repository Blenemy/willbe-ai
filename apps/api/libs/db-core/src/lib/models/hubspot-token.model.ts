import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { systemSchema } from '../system-schema';
import { IHubspotToken } from '../interfaces/hubspot-token.interface';
import { ApiProperty } from '@nestjs/swagger';
import { Company } from './company.model';

@Table({
  tableName: 'hubspot_tokens',
  schema: systemSchema,
  timestamps: true,
  underscored: true,
})
export class HubspotToken extends Model<IHubspotToken> {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Hubspot token record ID',
  })
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Company ID',
  })
  @ForeignKey(() => Company)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  companyId: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Hubspot access token',
  })
  @Column({
    type: DataType.STRING,
  })
  accessToken: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Hubspot refresh token',
  })
  @Column({
    type: DataType.STRING,
  })
  refreshToken: string;
}
