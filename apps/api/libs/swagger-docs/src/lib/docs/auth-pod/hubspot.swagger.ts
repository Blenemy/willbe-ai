import { applyDecorators } from '@nestjs/common';
import { 
  ApiOperation, 
  ApiOkResponse, 
  ApiParam,
  ApiQuery,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiProperty,
} from '@nestjs/swagger';

class HubspotFieldDto {
  @ApiProperty({ example: 'name', description: 'Field name identifier' })
  name: string = '';

  @ApiProperty({ example: 'Name', description: 'Human-readable field label' })
  label: string = '';

  @ApiProperty({ example: 'The name of the company', description: 'Field description' })
  description: string = '';

  @ApiProperty({ example: 'string', description: 'Data type of the field' })
  type: string = '';

  @ApiProperty({ example: 'text', description: 'UI field type' })
  fieldType: string = '';

  @ApiProperty({ example: 'companyinformation', description: 'Group the field belongs to' })
  groupName: string = '';

  @ApiProperty({ example: false, description: 'Whether the field is hidden' })
  hidden: boolean = false;
}


class HubspotFieldsMappingResponseDto {
  @ApiProperty({ 
    type: [HubspotFieldDto], 
    description: 'Fields that can be used for first name',
    isArray: true,
    example: [{
      name: 'firstname',
      label: 'First Name',
      description: 'The first name of the contact',
      type: 'string',
      fieldType: 'text',
      groupName: 'contactinformation',
      hidden: false
    }]
  })
  crmLeadFirstNameField: HubspotFieldDto[] = [];

  @ApiProperty({ 
    type: [HubspotFieldDto], 
    description: 'Fields that can be used for last name',
    isArray: true,
    example: [{
      name: 'lastname',
      label: 'Last Name',
      description: 'The last name of the contact',
      type: 'string',
      fieldType: 'text',
      groupName: 'contactinformation',
      hidden: false
    }]
  })
  crmLeadLastNameField: HubspotFieldDto[] = [];

  @ApiProperty({ 
    type: [HubspotFieldDto], 
    description: 'Fields that can be used for company',
    isArray: true,
    example: [{
      name: 'company',
      label: 'Company',
      description: 'The company the contact works for',
      type: 'string',
      fieldType: 'text',
      groupName: 'contactinformation',
      hidden: false
    }]
  })
  crmLeadCompanyField: HubspotFieldDto[] = [];

  @ApiProperty({ 
    type: [HubspotFieldDto], 
    description: 'Fields that can be used for job title',
    isArray: true,
    example: [{
      name: 'jobtitle',
      label: 'Job Title',
      description: 'The job title of the contact',
      type: 'string',
      fieldType: 'text',
      groupName: 'contactinformation',
      hidden: false
    }]
  })
  crmLeadJobTitleField: HubspotFieldDto[] = [];

  @ApiProperty({ 
    type: [HubspotFieldDto], 
    description: 'Fields that can be used for industry',
    isArray: true,
    example: [{
      name: 'industry',
      label: 'Industry',
      description: 'The industry of the contact',
      type: 'string',
      fieldType: 'text',
      groupName: 'contactinformation',
      hidden: false
    }]
  })
  crmLeadIndustryField: HubspotFieldDto[] = [];

  @ApiProperty({ 
    type: [HubspotFieldDto], 
    description: 'Fields that can be used for email',
    isArray: true,
    example: [{
      name: 'email',
      label: 'Email',
      description: 'The email address of the contact',
      type: 'string',
      fieldType: 'text',
      groupName: 'contactinformation',
      hidden: false
    }]
  })
  crmLeadEmailField: HubspotFieldDto[] = [];

  @ApiProperty({ 
    type: [HubspotFieldDto], 
    description: 'Fields that can be used for phone',
    isArray: true,
    example: [{
      name: 'phone',
      label: 'Phone Number',
      description: 'The phone number of the contact',
      type: 'string',
      fieldType: 'text',
      groupName: 'contactinformation',
      hidden: false
    }]
  })
  crmLeadPhoneField: HubspotFieldDto[] = [];
}

class HubspotCompanyFieldsMappingResponseDto {
  @ApiProperty({ 
    type: [HubspotFieldDto], 
    description: 'Fields that can be used for account name',
    isArray: true,
    example: [{
      name: 'name',
      label: 'Company Name',
      description: 'The name of the company',
      type: 'string',
      fieldType: 'text',
      groupName: 'companyinformation',
      hidden: false
    }]
  })
  crmAccountNameField: HubspotFieldDto[] = [];

  @ApiProperty({ 
    type: [HubspotFieldDto], 
    description: 'Fields that can be used for account city',
    isArray: true,
    example: [{
      name: 'city',
      label: 'City',
      description: 'The city where the company is located',
      type: 'string',
      fieldType: 'text',
      groupName: 'companyinformation',
      hidden: false
    }]
  })
  crmAccountCityField: HubspotFieldDto[] = [];

  @ApiProperty({ 
    type: [HubspotFieldDto], 
    description: 'Fields that can be used for account website',
    isArray: true,
    example: [{
      name: 'website',
      label: 'Website URL',
      description: 'The website URL of the company',
      type: 'string',
      fieldType: 'text',
      groupName: 'companyinformation',
      hidden: false
    }]
  })
  crmAccountWebsiteField: HubspotFieldDto[] = [];

  @ApiProperty({ 
    type: [HubspotFieldDto], 
    description: 'Fields that can be used for account phone',
    isArray: true,
    example: [{
      name: 'phone',
      label: 'Phone Number',
      description: 'The phone number of the company',
      type: 'string',
      fieldType: 'text',
      groupName: 'companyinformation',
      hidden: false
    }]
  })
  crmAccountPhoneField: HubspotFieldDto[] = [];

  @ApiProperty({ 
    type: [HubspotFieldDto], 
    description: 'Fields that can be used for account industry',
    isArray: true,
    example: [{
      name: 'industry',
      label: 'Industry',
      description: 'The industry of the company',
      type: 'string',
      fieldType: 'text',
      groupName: 'companyinformation',
      hidden: false
    }]
  })
  crmAccountIndustryField: HubspotFieldDto[] = [];

  @ApiProperty({ 
    type: [HubspotFieldDto], 
    description: 'Fields that can be used for account country',
    isArray: true,
    example: [{
      name: 'country',
      label: 'Country',
      description: 'The country where the company is located',
      type: 'string',
      fieldType: 'text',
      groupName: 'companyinformation',
      hidden: false
    }]
  })
  crmAccountCountryField: HubspotFieldDto[] = [];

  @ApiProperty({ 
    type: [HubspotFieldDto], 
    description: 'Fields that can be used for account owner',
    isArray: true,
    example: [{
      name: 'hubspot_owner_id',
      label: 'Company Owner',
      description: 'The HubSpot user who owns the company record',
      type: 'string',
      fieldType: 'text',
      groupName: 'companyinformation',
      hidden: false
    }]
  })
  crmAccountOwnerField: HubspotFieldDto[] = [];
}

export class HubspotSyncRes {
  @ApiProperty({ example: 'HubSpot companies enriched and updated' })
  result!: string;

  @ApiProperty({ example: 10 })
  updated!: number;

  @ApiProperty({ example: 15 })
  created!: number;
}

export function ApiConnectToHubspotDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Generate Hubspot OAuth URL for connection' }),
    ApiOkResponse({
      description: 'Hubspot authentication URL',
      content: {
        'application/json': {
          example: {
            url: 'https://app.hubspot.com/oauth/authorize?...'
          }
        }
      }
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized access',
    }),
  );
}

export function ApiHubspotRedirectDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Handle Hubspot OAuth redirect and connect account' }),
    ApiQuery({
      name: 'code',
      required: true,
      description: 'Authorization code from Hubspot',
      type: String,
    }),
    ApiQuery({
      name: 'state',
      required: true,
      description: 'User ID passed as state parameter',
      type: String,
    }),
    ApiOkResponse({
      description: 'Hubspot account connected successfully',
    }),
    ApiBadRequestResponse({
      description: 'Invalid request parameters',
    }),
  );
}

export function ApiSendAccountsDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Manually trigger sending accounts to Hubspot' }),
    ApiOkResponse({
      description: 'Accounts sent to Hubspot successfully',
    }),
    ApiBadRequestResponse({
      description: 'Failed to send accounts',
    }),
  );
}

export function ApiStartWithEnrichDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Start Hubspot integration with data enrichment' }),
    ApiParam({
      name: 'companyId',
      required: true,
      description: 'UUID of the company',
      type: String,
    }),
    ApiOkResponse({
      description: 'Hubspot integration with enrichment started successfully',
    }),
    ApiBadRequestResponse({
      description: 'Invalid company ID or failed to start integration',
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized access',
    }),
  );
}

export function ApiStartWithoutEnrichDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Start Hubspot integration without data enrichment' }),
    ApiParam({
      name: 'companyId',
      required: true,
      description: 'UUID of the company',
      type: String,
    }),
    ApiOkResponse({
      description: 'Hubspot integration without enrichment started successfully',
    }),
    ApiBadRequestResponse({
      description: 'Invalid company ID or failed to start integration',
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized access',
    }),
  );
}

export function ApiGetFieldsBindingsDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Get Hubspot fields bindings for a company' }),
    ApiParam({
      name: 'companyId',
      required: true,
      description: 'UUID of the company',
      type: String,
    }),
    ApiOkResponse({
      description: 'Fields bindings retrieved successfully',
    }),
    ApiBadRequestResponse({
      description: 'Invalid company ID',
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized access',
    }),
  );
}

export function ApiUpdateFieldsBindingsDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Update Hubspot fields bindings for a company' }),
    ApiParam({
      name: 'companyId',
      required: true,
      description: 'UUID of the company',
      type: String,
    }),
    ApiOkResponse({
      description: 'Fields bindings updated successfully',
    }),
    ApiBadRequestResponse({
      description: 'Invalid request data',
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized access',
    }),
  );
}

export function ApiGetHubspotCompaniesTableFieldsDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Get available Hubspot companies table fields grouped by mapping' }),
    ApiParam({
      name: 'companyId',
      required: true,
      description: 'UUID of the company',
      type: String,
    }),
    ApiOkResponse({
      description: 'Hubspot companies table fields retrieved successfully',
      type: HubspotCompanyFieldsMappingResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'Invalid company ID',
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized access',
    }),
  );
}

export function ApiGetHubspotContactsTableFieldsDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Get available Hubspot contacts table fields grouped by mapping' }),
    ApiParam({
      name: 'companyId',
      required: true,
      description: 'UUID of the company',
      type: String,
    }),
    ApiOkResponse({
      description: 'Hubspot contacts table fields grouped by field mapping purpose',
      type: HubspotFieldsMappingResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'Invalid company ID',
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized access',
    }),
  );
}

export function ApiDisconnectFromHubspotDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Disconnect HubSpot account' }),
    ApiParam({
      name: 'companyId',
      required: true,
      description: 'UUID of the company',
      type: String,
    }),
    ApiOkResponse({
      description: 'HubSpot disconnected',
      type: HubspotFieldsMappingResponseDto,
    }),
  );
}

export function ApiUpdateAutoSyncDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Update HubSpot auto sync mode' }),
    ApiOkResponse({
      description: 'HubSpot auto sync mode updated',
    }),
  );
}


export function ApiSyncLeadsDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Sync leads with HubSpot' }),
    ApiOkResponse({
      description: 'Leads successfully synced with HubSpot',
      type: HubspotSyncRes,
    }),
  );
}

export function ApiSyncAccountsDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Sync accounts with HubSpot' }),
    ApiOkResponse({
      description: 'Accounts successfully synced with HubSpot',
      type: HubspotSyncRes,
    }),
  );
}
