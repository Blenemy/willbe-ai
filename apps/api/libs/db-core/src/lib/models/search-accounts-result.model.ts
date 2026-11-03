import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { ISearchAccountsResult } from '../interfaces/search-accounts-result.interface';
import { ApiProperty } from '@nestjs/swagger';
import { systemSchema } from '../system-schema';
import { FindAccountsRes } from '../interfaces/account-scenario.interface';
import { AccountScenarioModel } from './account-scenario.model';

@Table({
  tableName: 'accounts_search_results',
  schema: systemSchema,
  timestamps: true,
  underscored: true,
})
export class SearchAccountsResult extends Model<ISearchAccountsResult> {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Search account result record ID',
  })
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @ApiProperty({
    description: 'Search account result',
    type: FindAccountsRes,
    isArray: true
  })
  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  data: any;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Cursor which is used for search',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  cursor: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Account scenario ID',
  })
  @ForeignKey(() => AccountScenarioModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  accountScenarioId: string;
}
