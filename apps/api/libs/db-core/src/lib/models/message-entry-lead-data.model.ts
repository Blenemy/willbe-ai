import { BelongsTo, Column, DataType, ForeignKey, HasOne, Model, Table, Default } from 'sequelize-typescript';
import { systemSchema } from '../system-schema';
import { IMessageEntryLeadData, LeadCampaignStatus } from '../interfaces/message-entry-lead-data.interface';
import { ApiProperty } from '@nestjs/swagger';
import { MessageLanguage } from '../interfaces/message-template.interface';
import { MessageEntry } from './message-entry.model';
import { SavedLead } from './saved-lead.model';
import { CompanyProduct } from './company-services.model';
import { MessageStructure } from './message-structure.model';

@Table({
  tableName: 'message_entries_leads_data',
  schema: systemSchema,
  timestamps: true,
  underscored: true,
})
export class MessageEntryLeadData extends Model<IMessageEntryLeadData> {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Message entry lead data ID',
  })
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Message entry ID',
  })
  @ForeignKey(() => MessageEntry)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  messageEntryId: string;

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

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Lead email',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  email: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'Lead phone',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  phone: string;

  @ApiProperty({
    example: 'en',
    description: 'Lead language',
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
    allowNull: true,
  })
  language: MessageLanguage;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Message structure ID',
  })
  @ForeignKey(() => MessageStructure)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  messageStructureId: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Product service ID',
  })
  @ForeignKey(() => CompanyProduct)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  productServiceId: string;

  @ApiProperty({
    example: 'Hello, how are you?',
    description: 'Generated message',
  })
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  message: string;

  @ApiProperty({
    example: LeadCampaignStatus.IN_CADENCE,
    description: 'Lead campaign status',
  })
  @Default(LeadCampaignStatus.IN_CADENCE)
  @Column({
    type: DataType.ENUM(
      LeadCampaignStatus.IN_CADENCE,
      LeadCampaignStatus.RESPONSE,
      LeadCampaignStatus.MEETING,
      LeadCampaignStatus.BOUNCED,
    ),
  })
  status: LeadCampaignStatus;

  @BelongsTo(() => SavedLead)
  lead: SavedLead;

  @BelongsTo(() => CompanyProduct)
  @ApiProperty({
    type: CompanyProduct,
  })
  productService: CompanyProduct;

  @BelongsTo(() => MessageStructure)
  @ApiProperty({
    type: MessageStructure,
  })
  messageStructure: MessageStructure;

  @BelongsTo(() => MessageEntry)
  messageEntry: MessageEntry;

  @ApiProperty({
    type: MessageStructure,
    isArray: true,
  })
  messageStructures: MessageStructure[];

  @ApiProperty({
    type: CompanyProduct,
    isArray: true,
  })
  companyProducts: CompanyProduct[];

  @ApiProperty({
      enum: MessageLanguage,
      isArray: true,
  })
  languages: MessageLanguage[];
}
