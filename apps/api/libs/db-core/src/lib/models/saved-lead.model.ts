import { BeforeUpdate, BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { systemSchema } from '../system-schema';
import { ApiProperty } from '@nestjs/swagger';
import { ISavedLead } from '../interfaces/saved-lead.interface';
import { LeadScenarioModel } from './lead-scenario.model';
import { FindLeadsRes } from '../interfaces/lead-scenario.interface';
import { MessageScenario } from './message-scenario.model';
import { MessageScenarioLead } from './message-scenario-lead.model';
import { Company } from './company.model';
import { SavedAccount } from './saved-account.model';
@Table({
  tableName: 'saved_leads',
  schema: systemSchema,
  timestamps: true,
  underscored: true,
})
export class SavedLead extends Model<ISavedLead> {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Saved lead record ID',
  })
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @ApiProperty({
    description: 'Lead data object',
    type: FindLeadsRes,
  })
  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  leadData: FindLeadsRes;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Lead scenario ID',
  })
  @ForeignKey(() => LeadScenarioModel)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  leadScenarioId: string | null;

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
    description: 'Account ID',
  })
  @ForeignKey(() => SavedAccount)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  accountId: string | null;

  @ApiProperty({
    example: '426614174000',
    description: 'Hubspot contact ID',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  hubspotContactId: string | null;

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

  @BelongsTo(() => LeadScenarioModel)
  leadScenario: LeadScenarioModel;

  @BelongsToMany(() => MessageScenario, () => MessageScenarioLead)
  messageScenarios: MessageScenario[];

  @BeforeUpdate
  static async updateIsSyncedWithCRM(instance: SavedLead) {
    instance.isSyncedWithCrm = false;
  }
}
