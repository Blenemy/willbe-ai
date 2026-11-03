import { BeforeUpdate, BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { systemSchema } from '../system-schema';
import { ApiProperty } from '@nestjs/swagger';
import { ISavedAccount } from '../interfaces/saved-account.interface';
import { FindAccountsRes } from '../interfaces/account-scenario.interface';
import { AccountScenarioModel } from './account-scenario.model';
import { Company } from './company.model';
import { User } from './user.model';

@Table({
  tableName: 'saved_accounts',
  schema: systemSchema,
  timestamps: true,
  underscored: true,
})
export class SavedAccount extends Model<ISavedAccount> {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Saved account record ID',
  })
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @ApiProperty({
    description: 'Account data object',
    type: FindAccountsRes,
  })
  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  accountData: FindAccountsRes;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Account scenario ID',
  })
  @ForeignKey(() => AccountScenarioModel)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  accountScenarioId: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Company ID',
  })
  @ForeignKey(() => Company)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  companyId: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'User ID',
  })
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  userId: string;

  @ApiProperty({
    example: '426614174000',
    description: 'Hubspot company ID',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  hubspotCompanyId: string | null;

  @ApiProperty({
    example: false,
    description: 'Is synced with CRM',
  })
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isSyncedWithCrm: boolean;

  @BelongsTo(() => Company)
  company: Company | null;

  @BelongsTo(() => User)
  user: User | null;

  @BelongsTo(() => AccountScenarioModel)
  accountScenario: AccountScenarioModel;

  @BeforeUpdate
  static async updateIsSyncedWithCRM(instance: SavedAccount) {
    instance.isSyncedWithCrm = false;
  }
}
