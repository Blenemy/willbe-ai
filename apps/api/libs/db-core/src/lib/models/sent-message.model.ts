import { BelongsTo, DataType, HasOne, Model, Table, ForeignKey } from 'sequelize-typescript';
import { Column } from 'sequelize-typescript';
import { systemSchema } from '../system-schema';
import { ApiProperty } from '@nestjs/swagger';
import { ISentEmailMessage, SentMessageStatus } from '../interfaces/sent-message.interface';
import { MessageEntryLeadData } from './message-entry-lead-data.model';

@Table({
  tableName: 'sent_email_messages',
  schema: systemSchema,
  timestamps: true,
  underscored: true,
})
export class SentEmailMessage extends Model<ISentEmailMessage> {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Sent message record ID',
  })
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Gmail message ID',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  emailMessageId: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Message entry lead data ID',
  })
  @ForeignKey(() => MessageEntryLeadData)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  messageEntryLeadDataId: string;
  
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Message scenario ID',
  })
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  messageScenarioId: string;

  @ApiProperty({
    example: 'sent',
    description: 'Status',
  })
  @Column({
    type: DataType.ENUM('sent', 'responded', 'bounced', 'not_answered'),
    allowNull: false,
  })
  status: SentMessageStatus;

  @ApiProperty({
    example: '2021-01-01T00:00:00.000Z',
    description: 'Sent at',
  })
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  sentAt: Date;

  @ApiProperty({
    example: '2021-01-01T00:00:00.000Z',
    description: 'Responded at',
  })
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  respondedAt: Date;

  @BelongsTo(() => MessageEntryLeadData)
  messageEntryLeadData: MessageEntryLeadData;
}
