import {
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { IMessageEntry, MessageEntryType } from '../interfaces/message-entry.interface';
import { systemSchema } from '../system-schema';
import { MessageEntryLeadData } from './message-entry-lead-data.model';
import { MessageScenario } from './message-scenario.model';

@Table({
  tableName: 'message_entries',
  schema: systemSchema,
  timestamps: true,
  underscored: true,
})
export class MessageEntry extends Model<IMessageEntry> {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Message entry ID',
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
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @ForeignKey(() => MessageScenario)
  messageScenarioId: string;

  @ApiProperty({
    example: MessageEntryType.FIRST_EMAIL,
    description: 'Message entry type',
  })
  @Column({
    type: DataType.ENUM(
      MessageEntryType.FIRST_EMAIL,
      MessageEntryType.FOLLOW_UP_EMAIL,
      MessageEntryType.LINKEDIN_CONNECTION,
      MessageEntryType.LINKEDIN_MESSAGE,
      MessageEntryType.LINKEDIN_FOLLOW_UP,
    ),
    allowNull: true,
  })
  type: MessageEntryType;

  @ApiProperty({
    example: '2021-01-01',
    description: 'Date message will be send',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  sendDate: string | null;

  @ApiProperty({
    example: '2021-01-01T00:00:00.000Z',
    description: 'Send date in UTC',
  })
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  sendDateUtc: Date | null;

  @ApiProperty({
    example: true,
    description: 'Send message now',
  })
  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  sendNow: boolean;

  @ApiProperty({
    type: MessageEntryLeadData,
    isArray: true,
  })
  @HasMany(() => MessageEntryLeadData)
  messageEntryLeadData: MessageEntryLeadData[];

  @BelongsTo(() => MessageScenario)
  messageScenario: MessageScenario;

  // @BeforeCreate
  // @BeforeUpdate
  // static normalizeSendDate(instance: MessageEntry) {
  //   const input = instance.sendDate;

  //   console.log('normalizeSendDate');
  //   console.log(input);
  //   console.log(typeof input);

  //   // Если sendDate пришёл как строка (с offset) — парсим вручную
  //   if (typeof input === 'string') {
  //     const dt = DateTime.fromISO(input);

  //     instance.sendDate = dt.toUTC().toJSDate(); // сохраняем в UTC
  //     instance.sendDateTz = dt.toFormat('ZZ'); // сохраняем, например, '+02:00'
  //   }

  //   // Если пришёл Date, то offset уже не узнать — не делаем ничего
  // }
}