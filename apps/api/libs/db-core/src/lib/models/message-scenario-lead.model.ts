import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { IMessageScenarioLead } from '../interfaces/message-scenario-lead.interface';
import { systemSchema } from '../system-schema';
import { ApiProperty } from '@nestjs/swagger';
import { MessageScenario } from './message-scenario.model';
import { SavedLead } from './saved-lead.model';

@Table({
  tableName: 'message_scenarios_leads',
  schema: systemSchema,
  timestamps: true,
  underscored: true,
})
export class MessageScenarioLead extends Model<IMessageScenarioLead> {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Message scenario lead record ID',
  })
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Message scenario ID',
  })
  @ForeignKey(() => MessageScenario)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  messageScenarioId: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Lead ID',
  })
  @ForeignKey(() => SavedLead)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  leadId: string;
}