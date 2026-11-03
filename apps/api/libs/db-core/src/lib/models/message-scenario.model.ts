import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import { IMessageScenario, MessageScenarioStatus } from '../interfaces/message-scenario.interface';
import { systemSchema } from '../system-schema';
import { ApiProperty } from '@nestjs/swagger';
import { SavedLead } from './saved-lead.model';
import { User } from './user.model';
import { MessageScenarioLead } from './message-scenario-lead.model';
import { MessageEntry } from './message-entry.model';

@Table({
  tableName: 'message_scenarios',
  schema: systemSchema,
  timestamps: true,
  underscored: true,
})
export class MessageScenario extends Model<IMessageScenario> {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Message scenario ID',
  })
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @ApiProperty({
    example: 'Scenario name',
    description: 'Message scenario name',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @ApiProperty({
    example: 'not_started',
    description: 'Message scenario status',
    enum: MessageScenarioStatus,
  })
  @Column({
    type: DataType.ENUM(
      MessageScenarioStatus.NOT_STARTED,
      MessageScenarioStatus.IN_PROGRESS,
      MessageScenarioStatus.DONE,
    ),
    allowNull: false,
  })
  status: MessageScenarioStatus;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'User ID',
  })
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  userId: string;

  @ApiProperty({
    type: SavedLead,
    isArray: true,
  })
  @BelongsTo(() => User)
  user: User;

  @BelongsToMany(() => SavedLead, () => MessageScenarioLead)
  leads: SavedLead[];

  @HasMany(() => MessageEntry)
  messageEntries: MessageEntry[];
}