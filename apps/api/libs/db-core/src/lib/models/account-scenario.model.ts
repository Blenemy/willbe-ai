import { Model, BelongsTo, Table, Column, DataType, ForeignKey, HasMany } from 'sequelize-typescript';
import { IAccountScenario } from '../interfaces/account-scenario.interface';
import { systemSchema } from '../system-schema';
import { User } from './user.model';
import { ApiProperty } from '@nestjs/swagger';
import { AccountScenariosFilterValueModel } from './account-scenarios-filter-value.model';

@Table({
  tableName: 'account_scenarios',
  schema: systemSchema,
  timestamps: true,
  underscored: true,
})
export class AccountScenarioModel extends Model<IAccountScenario> {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Account scenario ID',
  })
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @ApiProperty({
    example: 'Enterprise Companies',
    description: 'Account scenario name',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Scenario creator user ID',
  })
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    unique: false,
  })
  userId: string;

  @BelongsTo(() => User)
  user: User;

  @ApiProperty({
    type: AccountScenariosFilterValueModel,
    isArray: true,
  })
  @HasMany(() => AccountScenariosFilterValueModel)
  filterValues: AccountScenariosFilterValueModel[];
} 