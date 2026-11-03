import { Column, DataType, ForeignKey, Model, Table, BelongsTo, HasMany } from 'sequelize-typescript';
import { systemSchema } from '../system-schema';
import { IMessageStructure, MessageType } from '../interfaces/message-structure.interface';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.model';
import { MessageSubjectType } from '../interfaces/message-template.interface';
import { MessageTemplate } from './message-template.model';

@Table({
  tableName: 'message_structures',
  schema: systemSchema,
  timestamps: true,
  underscored: true,
})
export class MessageStructure extends Model<IMessageStructure> {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Message structure ID',
  })
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @ApiProperty({
    example: 'Structure name',
    description: 'Message structure name',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @ApiProperty({
    example: MessageType.FIRST_EMAIL,
    description: 'Message type',
  })
  @Column({
    type: DataType.ENUM(
      MessageType.FIRST_EMAIL,
      MessageType.FOLLOW_UP_EMAIL,
      MessageType.LINKEDIN_CONNECTION,
      MessageType.LINKEDIN_MESSAGE,
      MessageType.LINKEDIN_FOLLOW_UP,
    ),
    allowNull: false,
  })
  messageType: MessageType;

  @ApiProperty({
    enum: MessageSubjectType,
    example: MessageSubjectType.ACCOUNT_COMPANY,
  })
  @Column({
    type: DataType.ENUM(
      MessageSubjectType.ACCOUNT_COMPANY,
      MessageSubjectType.ACCOUNT_COMPANY_TEXT,
      MessageSubjectType.TEXT,
    ),
    allowNull: true,
  })
  subjectType: MessageSubjectType;

  @ApiProperty({
    example: 500,
    description: 'Maximum number of words of the message',
  })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  wordsLimit: number;

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
    description: 'User associated to the message structure',
    example: {
      firstName: 'John',
      lastName: 'Doe',
    },
  })
  @BelongsTo(() => User)
  user: User;

  @HasMany(() => MessageTemplate)
  templates: MessageTemplate[];

  @ApiProperty({
    example: ['English', 'Spanish', 'French'],
    description: 'Available languages for this template',
    type: [String],
  })
  languages: string[];
}
