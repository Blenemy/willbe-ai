import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { IsNotEmpty } from 'class-validator';

export class UpdateFieldsBindingsRequest {
  @ApiProperty({
    description: 'The first name field for the lead',
    example: 'firstname',
  })
  @IsString()
  @IsOptional()
  crmLeadFirstNameField?: string;

  @ApiProperty({
    description: 'The last name field for the lead',
    example: 'lastname',
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  crmLeadLastNameField?: string;

  @ApiProperty({
    description: 'The company field for the lead',
    example: 'company',
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  crmLeadCompanyField?: string;

  @ApiProperty({
    description: 'The job title field for the lead',
    example: 'jobtitle',
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  crmLeadJobTitleField?: string;

  @ApiProperty({
    description: 'The industry field for the lead',
    example: 'industry',
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  crmLeadIndustryField?: string;

  @ApiProperty({
    description: 'The position field for the lead',
    example: 'position',
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  crmLeadPositionField?: string;

  @ApiProperty({
    description: 'The position description field for the lead',
    example: 'job_description',
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  crmLeadPositionDescriptionField?: string;

  @ApiProperty({
    description: 'The email field for the lead',
    example: 'email',
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  crmLeadEmailField?: string;

  @ApiProperty({
    description: 'The phone field for the lead',
    example: 'phone',
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  crmLeadPhoneField?: string;

  @ApiProperty({
    description: 'The language field for the lead',
    example: 'language',
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  crmLeadLanguageField?: string;

  @ApiProperty({
    description: 'The location country field for the lead',
    example: 'country',
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  crmLeadLocationCountryField?: string;

  @ApiProperty({
    description: 'The location city field for the lead',
    example: 'city',
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  crmLeadLocationCityField?: string;

  @ApiProperty({
    description: 'The subtitle field for the lead',
    example: 'subtitle',
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  crmLeadSubtitleField?: string;

  @ApiProperty({
    description: 'The summary field for the lead',
    example: 'summary',
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  crmLeadSummaryField?: string;

  @ApiProperty({
    description: 'The LinkedIn field for the lead',
    example: 'linkedin_profile',
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  crmLeadLinkedInField?: string;

  @ApiProperty({
    description: 'The name field for the account',
    example: 'name',
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  crmAccountNameField?: string;

  @ApiProperty({
    description: 'The city field for the account',
    example: 'city',
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  crmAccountCityField?: string;

  @ApiProperty({
    description: 'The website field for the account',
    example: 'website',
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  crmAccountWebsiteField?: string;

  @ApiProperty({
    description: 'The company title field for the account',
    example: 'company_title',
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  crmAccountCompanyTitleField?: string;

  @ApiProperty({
    description: 'The founded in field for the account',
    example: 'founded_year',
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  crmAccountFoundedInField?: string;

  @ApiProperty({
    description: 'The headquarters field for the account',
    example: 'headquarters',
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  crmAccountHeadquartersField?: string;

  @ApiProperty({
    description: 'The employees field for the account',
    example: 'numberofemployees',
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  crmAccountEmployeesField?: string;

  @ApiProperty({
    description: 'The industry field for the account',
    example: 'industry',
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  crmAccountIndustryField?: string;

  @ApiProperty({
    description: 'The LinkedIn field for the account',
    example: 'linkedin_company_page',
  })
  
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  crmAccountLinkedInField?: string;

  @ApiProperty({
    description: 'The description field for the account',
    example: 'description',
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  crmAccountDescriptionField?: string;

  @ApiProperty({ description: 'The not contacted status for the account', example: 'Not Contacted' })
  @IsString()
  @IsOptional()
  crmAccountNotContactedStatus?: string;

  @ApiProperty({ description: 'The in cadence status for the account', example: 'In Cadence' })
  @IsString()
  @IsOptional()
  crmAccountInCadenceStatus?: string;

  @ApiProperty({ description: 'The response status for the account', example: 'Responded' })
  @IsString()
  @IsOptional()
  crmAccountResponseStatus?: string;

  @ApiProperty({ description: 'The meeting status for the account', example: 'Meeting' })
  @IsString()
  @IsOptional()
  crmAccountMeetingStatus?: string;

  @ApiProperty({ description: 'The bounced status for the account', example: 'Bounced' })
  @IsString()
  @IsOptional()
  crmAccountBouncedStatus?: string;

  @ApiProperty({ description: 'The out of office status for the account', example: 'Out of Office' })
  @IsString()
  @IsOptional()
  crmAccountOutOfOfficeStatus?: string;

  @ApiProperty({ description: 'The unresponsive status for the account', example: 'Unresponsive' })
  @IsString()
  @IsOptional()
  crmAccountUnresponsiveStatus?: string;

  @ApiProperty({ description: 'The not contacted status for the lead', example: 'Not Contacted' })
  @IsString()
  @IsOptional()
  crmLeadNotContactedStatus?: string;

  @ApiProperty({ description: 'The in cadence status for the lead', example: 'In Cadence' })
  @IsString()
  @IsOptional()
  crmLeadInCadenceStatus?: string;

  @ApiProperty({ description: 'The response status for the lead', example: 'Responded' })
  @IsString()
  @IsOptional()
  crmLeadResponseStatus?: string;

  @ApiProperty({ description: 'The meeting status for the lead', example: 'Meeting' })
  @IsString()
  @IsOptional()
  crmLeadMeetingStatus?: string;

  @ApiProperty({ description: 'The bounced status for the lead', example: 'Bounced' })
  @IsString()
  @IsOptional()
  crmLeadBouncedStatus?: string;

  @ApiProperty({ description: 'The out of office status for the lead', example: 'Out of Office' })
  @IsString()
  @IsOptional()
  crmLeadOutOfOfficeStatus?: string;

  @ApiProperty({ description: 'The unresponsive status for the lead', example: 'Unresponsive' })
  @IsString()
  @IsOptional()
  crmLeadUnresponsiveStatus?: string;
}
