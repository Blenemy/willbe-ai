import { BelongsTo, DataType, ForeignKey } from 'sequelize-typescript';
import { Table, Column, Model } from 'sequelize-typescript';
import {  } from 'sequelize-typescript';
import { systemSchema } from '../system-schema';
import { IReceivedMessage } from '../interfaces/received-message.interface';
import { ApiProperty } from '@nestjs/swagger';
import { SentEmailMessage } from './sent-message.model';
@Table({
  tableName: 'received_messages',
  schema: systemSchema,
  timestamps: true,
  underscored: true,
})
export class ReceivedMessage extends Model<IReceivedMessage> {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Received message record ID',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @ApiProperty({
    example: 'Hello, I\'m interested',
    description: 'Message text',
  })
  @Column({
    type: DataType.TEXT ,
    allowNull: false,
  })
  message: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Sent email message ID',
  })
  @ForeignKey(() => SentEmailMessage)
  @Column({
    type: DataType.STRING,
  })
  sentEmailMessageId: string;

  @BelongsTo(() => SentEmailMessage)
  sentEmailMessage: SentEmailMessage;
}