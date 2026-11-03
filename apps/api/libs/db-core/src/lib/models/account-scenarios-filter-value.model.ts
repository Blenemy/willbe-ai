import { Model, Table, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { AccountScenarioFilterKey } from '../interfaces/account-scenario.interface';
import { systemSchema } from '../system-schema';
import { AccountScenarioModel } from './account-scenario.model';
import { ApiProperty } from '@nestjs/swagger';
import { IAccountScenariosFilterValues } from '../interfaces/account-scenarios-filter-values.interface';
import { LeadScenarioFilterValue } from '../interfaces/lead-scenario.interface';

@Table({
  tableName: 'account_scenarios_filters_values',
  schema: systemSchema,
  timestamps: true,
  underscored: true,
})
export class AccountScenariosFilterValueModel extends Model<IAccountScenariosFilterValues> {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Account scenario filter value record ID',
  })
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Account scenario ID',
  })
  @ForeignKey(() => AccountScenarioModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    unique: false,
  })
  accountScenarioId: string;

  @ApiProperty({
    example: 'company_name',
    description: 'Account scenario filter key',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: false,
  })
  filterKey: AccountScenarioFilterKey;

  @ApiProperty({
    example: 'Enterprise',
    description: 'Account scenario filter value',
  })
  @Column({
    type: DataType.JSONB,
    allowNull: false,
    unique: false,
  })
  filterValue: LeadScenarioFilterValue;

  @BelongsTo(() => AccountScenarioModel, {
    foreignKey: 'accountScenarioId',
    as: 'accountScenario',
  })
  accountScenario: AccountScenarioModel;
} 