import { Column, Model, Table, DataType, ForeignKey, BelongsTo, Unique } from 'sequelize-typescript';
import { systemSchema } from '../system-schema';
import { ICrmFieldsBinding } from '../interfaces/crm-fields-binding.interface';
import { Company } from './company.model';
import { ApiProperty } from '@nestjs/swagger';
@Table({
  tableName: 'crm_fields_bindings',
  schema: systemSchema,
  timestamps: true,
  underscored: true,
})

export class CrmFieldsBinding extends Model<ICrmFieldsBinding> {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Crm fields binding ID',
  })
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Company ID',
  })
  @ForeignKey(() => Company)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  companyId: string;

  @BelongsTo(() => Company)
  company: Company;

  @ApiProperty({
    example: 'first_name',
    description: 'Crm lead first name field',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  crmLeadFirstNameField: string;

  @ApiProperty({
    example: 'last_name',
    description: 'Crm lead last name field',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  crmLeadLastNameField: string;

  @ApiProperty({
    example: 'company',
    description: 'Crm lead company field',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  crmLeadCompanyField: string;

  @ApiProperty({
    example: 'job_title',
    description: 'Crm lead job title field',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  crmLeadJobTitleField: string;

  @ApiProperty({
    example: 'industry',
    description: 'Crm lead industry field',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  crmLeadIndustryField: string;

  @ApiProperty({
    example: 'position',
    description: 'CRM lead position field',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  crmLeadPositionField: string;

  @ApiProperty({
    example: 'position_description',
    description: 'CRM lead position description field',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  crmLeadPositionDescriptionField: string;

  @ApiProperty({
    example: 'email',
    description: 'CRM lead email field',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  crmLeadEmailField: string;

  @ApiProperty({
    example: 'phone',
    description: 'CRM lead phone field',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  crmLeadPhoneField: string;

  @ApiProperty({
    example: 'language',
    description: 'CRM lead language field',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  crmLeadLanguageField: string;

  @ApiProperty({
    example: 'country',
    description: 'CRM lead location country field',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  crmLeadLocationCountryField: string;

  @ApiProperty({
    example: 'city',
    description: 'CRM lead location city field',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  crmLeadLocationCityField: string;

  @ApiProperty({
    example: 'subtitle',
    description: 'CRM lead subtitle field',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  crmLeadSubtitleField: string;

  @ApiProperty({
    example: 'summary',
    description: 'CRM lead summary field',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  crmLeadSummaryField: string;

  @ApiProperty({
    example: 'linkedin_url',
    description: 'CRM lead LinkedIn field',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  crmLeadLinkedInField: string;

  @ApiProperty({
    example: 'name',
    description: 'Crm account name field',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  crmAccountNameField: string;

  @ApiProperty({
    example: 'city',
    description: 'Crm account city field',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  crmAccountCityField: string;

  @ApiProperty({
    example: 'website',
    description: 'Crm account website field',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  crmAccountWebsiteField: string;

  @ApiProperty({
    example: 'company_title',
    description: 'CRM account company title field',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  crmAccountCompanyTitleField: string;

  @ApiProperty({
    example: 'founded_in',
    description: 'CRM account founded in field',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  crmAccountFoundedInField: string;

  @ApiProperty({
    example: 'headquarters',
    description: 'CRM account headquarters field',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  crmAccountHeadquartersField: string;

  @ApiProperty({
    example: 'employees',
    description: 'CRM account employees field',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  crmAccountEmployeesField: string;

  @ApiProperty({
    example: 'industry',
    description: 'CRM account industry field',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  crmAccountIndustryField: string;

  @ApiProperty({
    example: 'linkedin',
    description: 'CRM account LinkedIn field',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  crmAccountLinkedInField: string;

  @ApiProperty({
    example: 'description',
    description: 'CRM account description field',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  crmAccountDescriptionField: string;

  @ApiProperty({ example: 'not_contacted', description: 'CRM account not contacted status' })
  @Column({ type: DataType.STRING, allowNull: true })
  crmAccountNotContactedStatus: string;

  @ApiProperty({ example: 'in_cadence', description: 'CRM account in cadence status' })
  @Column({ type: DataType.STRING, allowNull: true })
  crmAccountInCadenceStatus: string;

  @ApiProperty({ example: 'response', description: 'CRM account response status' })
  @Column({ type: DataType.STRING, allowNull: true })
  crmAccountResponseStatus: string;

  @ApiProperty({ example: 'meeting', description: 'CRM account meeting status' })
  @Column({ type: DataType.STRING, allowNull: true })
  crmAccountMeetingStatus: string;

  @ApiProperty({ example: 'bounced', description: 'CRM account bounced status' })
  @Column({ type: DataType.STRING, allowNull: true })
  crmAccountBouncedStatus: string;

  @ApiProperty({ example: 'out_of_office', description: 'CRM account out of office status' })
  @Column({ type: DataType.STRING, allowNull: true })
  crmAccountOutOfOfficeStatus: string;

  @ApiProperty({ example: 'unresponsive', description: 'CRM account unresponsive status' })
  @Column({ type: DataType.STRING, allowNull: true })
  crmAccountUnresponsiveStatus: string;

  @ApiProperty({ example: 'not_contacted', description: 'CRM lead not contacted status' })
  @Column({ type: DataType.STRING, allowNull: true })
  crmLeadNotContactedStatus: string;

  @ApiProperty({ example: 'in_cadence', description: 'CRM lead in cadence status' })
  @Column({ type: DataType.STRING, allowNull: true })
  crmLeadInCadenceStatus: string;

  @ApiProperty({ example: 'response', description: 'CRM lead response status' })
  @Column({ type: DataType.STRING, allowNull: true })
  crmLeadResponseStatus: string;

  @ApiProperty({ example: 'meeting', description: 'CRM lead meeting status' })
  @Column({ type: DataType.STRING, allowNull: true })
  crmLeadMeetingStatus: string;

  @ApiProperty({ example: 'bounced', description: 'CRM lead bounced status' })
  @Column({ type: DataType.STRING, allowNull: true })
  crmLeadBouncedStatus: string;

  @ApiProperty({ example: 'out_of_office', description: 'CRM lead out of office status' })
  @Column({ type: DataType.STRING, allowNull: true })
  crmLeadOutOfOfficeStatus: string;

  @ApiProperty({ example: 'unresponsive', description: 'CRM lead unresponsive status' })
  @Column({ type: DataType.STRING, allowNull: true })
  crmLeadUnresponsiveStatus: string;
}