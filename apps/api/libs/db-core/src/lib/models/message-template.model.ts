import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { systemSchema } from '../system-schema';
import { IMessageTemplate, MessageLanguage } from '../interfaces/message-template.interface';
import { ApiProperty } from '@nestjs/swagger';
import { MessageStructure } from './message-structure.model';
import { IMessageTemplateSection } from '../interfaces/message-template.interface';

@Table({
  tableName: 'message_templates',
  schema: systemSchema,
  timestamps: true,
  underscored: true,
})
export class MessageTemplate extends Model<IMessageTemplate> {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Message template ID',
  })
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @ApiProperty({
    example: 'Increase brand awareness',
    description: 'Objective of the message',
  })
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  objective: string;

  @ApiProperty({
    example: 'Partnership Opportunity',
    description: 'Subject of the message',
  })
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  subject: string;

  @ApiProperty({
    example: 'Dear John',
    description: 'Greeting part of the message',
  })
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  greeting: string;

  @ApiProperty({
    example: { wordsLimit: 100, text: 'I would like to discuss a potential partnership...' },
    description: 'Introduction part of the message',
  })
  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  introduction: IMessageTemplateSection;

  @ApiProperty({
    example: [{ wordsLimit: 100, text: 'I would like to discuss a potential partnership...' }],
    description: 'Paragraphs of the message',
  })
  @Column({
    type: DataType.ARRAY(DataType.JSONB),
  })
  paragraphs: IMessageTemplateSection[];

  @ApiProperty({
    example: { wordsLimit: 100, text: 'Looking forward to your response.' },
    description: 'Goodbye part of the message',
  })
  @Column({
    type: DataType.JSONB,
  })
  goodbye: IMessageTemplateSection;

  @ApiProperty({
    example: 'Dear Mr. Anderson, I would like to discuss a potential partnership...',
    description: 'Sample message',
  })
  @Column({
    type: DataType.TEXT,
  })
  sampleMessage: string;

  @ApiProperty({
    enum: MessageLanguage,
    example: MessageLanguage.EN,
  })
  @Column({
    type: DataType.ENUM(
      MessageLanguage.ES,
      MessageLanguage.EN,
      MessageLanguage.FR,
      MessageLanguage.PT,
      MessageLanguage.DE,
      MessageLanguage.IT,
    ),
    allowNull: false,
  })
  language: MessageLanguage;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID of the associated message structure',
  })
  @ForeignKey(() => MessageStructure)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  messageStructureId: string;
}
