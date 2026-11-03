import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { async, firstValueFrom } from 'rxjs';
import { AccountScenarioModel, HubspotToken, SavedAccount, SavedLead, User, CrmFieldsBinding, Company, LeadScenarioModel } from '@willbe-server/db-core';
import { InjectModel } from '@nestjs/sequelize';
import { UsersService } from '../users/users.service';
import { CompaniesService } from '../companies/companies.service';
import { Client as HubspotClient } from '@hubspot/api-client';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { HubspotJob } from './processors/hubspot.processor';
import { UpdateFieldsBindingsRequest } from './dto/update-fields-bindings.dto';

@Injectable()
export class HubspotService {
  private readonly hubspotClientId: string;
  private readonly hubspotClientSecret: string;
  private readonly hubspotRedirectUri: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly userService: UsersService,
    private readonly companyService: CompaniesService,
    @InjectModel(HubspotToken)
    private readonly hubspotTokenModel: typeof HubspotToken,
    @InjectModel(SavedAccount)
    private readonly savedAccountModel: typeof SavedAccount,
    @InjectModel(SavedLead)
    private readonly savedLeadModel: typeof SavedLead,
    @InjectModel(CrmFieldsBinding)
    private readonly crmFieldsBindingModel: typeof CrmFieldsBinding,
    @InjectModel(Company)
    private readonly companyModel: typeof Company,
    @InjectQueue('hubspot-jobs')
    private readonly hubspotJobsQueue: Queue,
  ) {
    this.hubspotClientId = configService.get('HUBSPOT_CLIENT_ID');
    this.hubspotClientSecret = configService.get('HUBSPOT_CLIENT_SECRET');
    this.hubspotRedirectUri = configService.get('HUBSPOT_REDIRECT_URI');
  }

  connectToHubspot(user: User): string {
    const params = new URLSearchParams({
      client_id: this.hubspotClientId,
      redirect_uri: this.hubspotRedirectUri,
      scope: 'crm.objects.contacts.read crm.objects.contacts.write crm.objects.companies.read crm.objects.companies.write',
      response_type: 'code',
      state: user.id,
    });

    return `https://app.hubspot.com/oauth/authorize?${params.toString()}`;
  }

  async hubspotCallback(code: string, userId: string) {
    const tokenUrl = 'https://api.hubapi.com/oauth/v1/token';
    const payload = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: process.env.HUBSPOT_CLIENT_ID,
      client_secret: process.env.HUBSPOT_CLIENT_SECRET,
      redirect_uri: process.env.HUBSPOT_REDIRECT_URI,
      code,
    });

    const res = await firstValueFrom(
      this.httpService.post(tokenUrl, payload.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }),
    );

    const { access_token, refresh_token, expires_in } = res.data;

    const user = await this.userService.findById(userId);
    const company = await this.companyService.findById(user.companyId);

    const hubspotToken = await this.hubspotTokenModel.create({
      companyId: company.id,
      accessToken: access_token,
      refreshToken: refresh_token,
    });

    const crmFieldsBinding = await this.crmFieldsBindingModel.create({
      companyId: company.id,
      crmLeadFirstNameField: 'firstname',
      crmLeadLastNameField: 'lastname',
      crmLeadPositionField: 'hs_buying_role',
      crmLeadPositionDescriptionField: 'jobtitle',
      crmLeadEmailField: 'email',
      crmLeadPhoneField: 'phone',
      crmLeadCompanyField: 'company',
      crmLeadJobTitleField: 'jobtitle',
      crmLeadIndustryField: 'industry',
      crmLeadLanguageField: 'hs_language',
      crmLeadLocationCountryField: 'country',
      crmLeadLocationCityField: 'city',
      crmLeadSummaryField: 'linkedinbio',
      crmLeadLinkedInField: 'hs_linkedin_url',

      crmAccountNameField: 'name',
      crmAccountCityField: 'city',
      crmAccountFoundedInField: 'founded_year',
      crmAccountHeadquartersField: 'country',
      crmAccountWebsiteField: 'website',
      crmAccountEmployeesField: 'numberofemployees',
      crmAccountIndustryField: 'industry',
      crmAccountLinkedInField: 'linkedin_company_page',
      crmAccountDescriptionField: 'description',

      crmAccountNotContactedStatus: 'NEW',
      crmAccountInCadenceStatus: 'OPEN',
      crmAccountResponseStatus: 'CONNECTED',
      crmAccountMeetingStatus: 'IN_PROGRESS',
      crmAccountBouncedStatus: 'UNQUALIFIED',
      crmAccountOutOfOfficeStatus: 'BAD_TIMING',
      crmAccountUnresponsiveStatus: 'ATTEMPTED_TO_CONTACT',

      crmLeadNotContactedStatus: 'NEW',
      crmLeadInCadenceStatus: 'OPEN',
      crmLeadResponseStatus: 'CONNECTED',
      crmLeadMeetingStatus: 'IN_PROGRESS',
      crmLeadBouncedStatus: 'UNQUALIFIED',
      crmLeadOutOfOfficeStatus: 'BAD_TIMING',
      crmLeadUnresponsiveStatus: 'ATTEMPTED_TO_CONTACT',
    });

    return 'HubSpot connected';
  }

  async disconnectFromHubspot(companyId: string) {
    await Promise.all([
      this.hubspotTokenModel.destroy({
        where: {
          companyId,
        },
      }),
      this.crmFieldsBindingModel.destroy({
        where: {
          companyId,
        },
      }),
      this.companyModel.update({
        autoSyncCrm: false,
      }, {
        where: {
          id: companyId,
        },
      }),
    ]);

    return 'HubSpot disconnected';
  }

  async refreshAccessToken(refreshToken: string): Promise<string> {
    const payload = new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: process.env.HUBSPOT_CLIENT_ID,
      client_secret: process.env.HUBSPOT_CLIENT_SECRET,
      refresh_token: refreshToken,
    });
  
    const res = await firstValueFrom(
      this.httpService.post('https://api.hubapi.com/oauth/v1/token', payload.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }),
    );

    const { access_token, refresh_token, expires_in } = res.data;

    return 'HubSpot access token refreshed';
  }

  async startWithoutEnrich(companyId: string) {
    const theCompaniesApiKey = this.configService.get('THE_COMPANIES_API_KEY');

    const hubspotToken = await this.hubspotTokenModel.findOne({
      where: {
        companyId,
      },
    });

    if (!hubspotToken) {
      throw new BadRequestException('HubSpot connection not found');
    }

    const hubspotClient = new HubspotClient({
      accessToken: hubspotToken.accessToken,
    });

    let hubspotCompanies = [];

    try {
      const companySearchRequest = {
        properties: ["name", "domain", "phone", "city", "website"],
        limit: 100,
        after: undefined,
      };
      let hasMoreCompanies = true;
      while(hasMoreCompanies) {
        const companyResult = await this.safeHubspotCall(async () => {
          return await hubspotClient.crm.companies.searchApi.doSearch(companySearchRequest);
        }, hubspotToken.refreshToken);
        hubspotCompanies.push(...companyResult.results);
        if (companyResult.paging?.next?.after) {
          companySearchRequest.after = companyResult.paging.next.after;
        } else {
          hasMoreCompanies = false;
        }
      }
    } catch (error) {
      console.error(`Error fetching companies from HubSpot for company ${companyId}:`, error);
      return;
    }

    for (const hubspotCompany of hubspotCompanies) {
      let savedAccount: SavedAccount | null = null;

      let companyData = null;

      try {
        const companyDataRes = await firstValueFrom(
          this.httpService.get(
            `https://api.thecompaniesapi.com/v2/companies/${hubspotCompany.properties?.domain}`,
            {
              headers: {
                'Authorization': `Basic ${theCompaniesApiKey}`,
              },
            },
          ),
        );

        companyData = companyDataRes.data;
      } catch (error) {
        console.error(`Error fetching company data for ${hubspotCompany.properties?.domain}`);
        continue;
      }

      const transformedCompanyData = this.transformCompanyData(companyData);
      savedAccount = await this.savedAccountModel.create({
        accountData: transformedCompanyData,
        accountScenarioId: null,
        companyId,
        isSyncedWithCrm: true,
      });

      if (!savedAccount) {
        console.error(`Failed to obtain a saved company record for HubSpot company ${hubspotCompany.id}. Skipping contacts.`);
        continue;
      }

      try {
        const contactSearchRequest = {
          filterGroups: [{
            filters: [{
              propertyName: 'associations.company',
              operator: 'EQ' as any,
              value: hubspotCompany.id
            }]
          }],
          properties: ['firstname', 'lastname', 'email', 'phone', 'jobtitle'],
          limit: 100,
          after: undefined,
        };

        let hubspotContacts = [];
        let hasMoreContacts = true;
        while(hasMoreContacts) {
          const contactsResponse = await this.safeHubspotCall(async () => {
            return await hubspotClient.crm.contacts.searchApi.doSearch(contactSearchRequest);
          }, hubspotToken.refreshToken);
          hubspotContacts.push(...contactsResponse.results);
          if (contactsResponse.paging?.next?.after) {
            contactSearchRequest.after = contactsResponse.paging.next.after;
          } else {
            hasMoreContacts = false;
          }
        }

        for (const hubspotContact of hubspotContacts) {
          const transformedContactData = this.transformContactData(hubspotContact);

          const savedLead = await this.savedLeadModel.create({
            leadData: transformedContactData,
            leadScenarioId: null,
            companyId,
            isSyncedWithCrm: true,
          });
        }

      } catch (contactFetchError) {
        console.error(`Error fetching contacts for company ${hubspotCompany.id}:`, contactFetchError);
      }
    }

    return {
      result: 'Hubspot sync without enrich started',
    };
  }

  async startWithEnrich(companyId: string) {
    const hubspotToken = await this.hubspotTokenModel.findOne({
      where: {
        companyId,
      },
    });

    if (!hubspotToken) {
      throw new BadRequestException('HubSpot connection not found');
    } 

    const hubspotClient = new HubspotClient({
      accessToken: hubspotToken.accessToken,
    });
    
    const savedAccounts = await this.savedAccountModel.findAll({
      include: [{
        model: AccountScenarioModel,
        include: [{
          model: User,
          where: {
            companyId,
          },
        }],
      }],
    });

    const chunkSize = 100;
    const accountChunks = [];
    for (let i = 0; i < savedAccounts.length; i += chunkSize) {
      const chunk = savedAccounts.slice(i, i + chunkSize);
      accountChunks.push(chunk);
    }

    for (const chunk of accountChunks) {
      const inputs = chunk.map((account) => ({
        properties: {
          name: account.accountData.name,
          city: account.accountData.location,
          website: account.accountData.profile_url,
        },
      }));

      const res = await this.safeHubspotCall(async () => {
        return await hubspotClient.crm.companies.batchApi.create({
          inputs,
        });
      }, hubspotToken.refreshToken);
    }

    let savedLeads = [];
    try {
      savedLeads = await this.savedLeadModel.findAll({
        include: [{
          model: LeadScenarioModel,
          include: [{
            model: User,
            where: {
              companyId,
            },
          }],
        }],
      });

      await Promise.all([
        this.savedAccountModel.update(
          { isSyncedWithCrm: true },
          { where: { id: savedAccounts.map(account => account.id) } }
        ),
        this.savedLeadModel.update(
          { isSyncedWithCrm: true },
          { where: { id: savedLeads.map(lead => lead.id) } }
        ),
      ]);
    } catch (error) {
      console.error(`Error fetching leads for company ${companyId}:`, error);
    }

    const leadChunks = [];
    for (let i = 0; i < savedLeads.length; i += chunkSize) {
      const chunk = savedLeads.slice(i, i + chunkSize);
      leadChunks.push(chunk);
    }

    for (const chunk of leadChunks) {
      const inputs = chunk.map((lead: SavedLead) => ({
        properties: {
          firstname: lead.leadData.first_name,
          lastname: lead.leadData.last_name,
          company: lead.leadData.name,
          jobtitle: lead.leadData.headline,
          industry: lead.leadData.industry || undefined,
        }
      }));

      const res = await this.safeHubspotCall(async () => {
          return await hubspotClient.crm.contacts.batchApi.create({
            inputs,
          });
      }, hubspotToken.refreshToken);
    }
    
    return {
      result: 'Hubspot sync with enrich started',
    };
  }

  async loadToHubspot(companyId: string) {
    
    const accounts = await this.savedAccountModel.findAll({
      include: [{
        model: AccountScenarioModel,
        include: [{
          model: User,
          where: {
            companyId,
          },
        }],
      }],
    });

    const chunkSize = 100;
    const accountChunks = [];
    for (let i = 0; i < accounts.length; i += chunkSize) {
      const chunk = accounts.slice(i, i + chunkSize);
      accountChunks.push(chunk);
    }
    return accountChunks;
  }

  async getFieldsBindings(companyId: string) {
    const crmFieldsBinding = await this.crmFieldsBindingModel.findOne({
      where: {
        companyId,
      },
    });

    if (!crmFieldsBinding) {
      throw new NotFoundException('No fields bindings found');
    }

    const company = await this.companyModel.findOne({
      where: { id: companyId },
    })

    crmFieldsBinding.dataValues['isAutoSync'] = company.autoSyncCrm;

    return crmFieldsBinding;
  }

  async updateFieldsBindings(companyId: string, dto: UpdateFieldsBindingsRequest) {
    const crmFieldsBinding = await this.crmFieldsBindingModel.findOne({
      where: {
        companyId,
      },
    });

    if (!crmFieldsBinding) {
      throw new NotFoundException('No fields bindings found');
    }

    await crmFieldsBinding.update(dto);

    return await this.getFieldsBindings(companyId);
  }

  async getHubspotCompaniesTableFields(companyId: string) {
    const hubspotToken = await this.hubspotTokenModel.findOne({
      where: {
        companyId,
      },
    });

    if (!hubspotToken) {
      throw new NotFoundException('No HubSpot connection found for this company');
    }

    try {
      const hubspotClient = new HubspotClient({
        accessToken: hubspotToken.accessToken,
      });

      const propertiesResponse = await hubspotClient.crm.properties.coreApi.getAll('companies');
      const statusesPropertiesResponse = await hubspotClient.crm.properties.coreApi.getByName('companies', 'hs_lead_status');
      
      const fields = propertiesResponse.results
        .filter(property => property.hidden !== true)
        .map(property => ({
          name: property.name,
          label: property.label,
          description: property.description,
          type: property.type,
          fieldType: property.fieldType,
          groupName: property.groupName,
          hidden: property.hidden
        }));

      const fieldsByBinding = {
        crmAccountNameField: fields.filter(field => 
          field.name === 'name' || 
          field.name.toLowerCase().includes('name') || 
          field.name.toLowerCase().includes('company')
        ),
        crmAccountCityField: fields.filter(field => 
          field.name === 'city' || 
          field.name.toLowerCase().includes('city') || 
          field.name.toLowerCase().includes('location')
        ),
        crmAccountWebsiteField: fields.filter(field => 
          field.name === 'website' || 
          field.name.toLowerCase().includes('website') || 
          field.name.toLowerCase().includes('url') ||
          field.name.toLowerCase().includes('domain')
        ),
        crmAccountCompanyTitleField: fields.filter(field => 
          field.name === 'title' || 
          field.name.toLowerCase().includes('title')
        ),
        crmAccountFoundedInField: fields.filter(field => 
          field.name === 'founded_year' || 
          field.name.toLowerCase().includes('found') || 
          field.name.toLowerCase().includes('year') ||
          field.name.toLowerCase().includes('established')
        ),
        crmAccountHeadquartersField: fields.filter(field => 
          field.name === 'headquarters' || 
          field.name.toLowerCase().includes('headquarter') ||
          field.name.toLowerCase().includes('country') ||
          field.name.toLowerCase().includes('hq')
        ),
        crmAccountEmployeesField: fields.filter(field => 
          field.name === 'numberofemployees' || 
          field.name.toLowerCase().includes('employee') || 
          field.name.toLowerCase().includes('headcount') ||
          field.name.toLowerCase().includes('size')
        ),
        crmAccountIndustryField: fields.filter(field => 
          field.name === 'industry' || 
          field.name.toLowerCase().includes('industry') ||
          field.name.toLowerCase().includes('sector')
        ),
        crmAccountLinkedInField: fields.filter(field => 
          field.name === 'linkedin_company_page' || 
          field.name.toLowerCase().includes('linkedin')
        ),
        crmAccountDescriptionField: fields.filter(field => 
          field.name === 'description' || 
          field.name.toLowerCase().includes('description') || 
          field.name.toLowerCase().includes('about') ||
          field.name.toLowerCase().includes('summary')
        ),
        crmAccountNotContactedStatus: statusesPropertiesResponse.options,
        crmAccountInCadenceStatus: statusesPropertiesResponse.options,
        crmAccountResponseStatus: statusesPropertiesResponse.options,
        crmAccountMeetingStatus: statusesPropertiesResponse.options,
        crmAccountBouncedStatus: statusesPropertiesResponse.options,
        crmAccountOutOfOfficeStatus: statusesPropertiesResponse.options,
        crmAccountUnresponsiveStatus: statusesPropertiesResponse.options,
      };

      return fieldsByBinding;
    } catch (error) {
      if (error.message?.includes('expired') || error.status === 401) {
        try {
          const payload = new URLSearchParams({
            grant_type: 'refresh_token',
            client_id: process.env.HUBSPOT_CLIENT_ID,
            client_secret: process.env.HUBSPOT_CLIENT_SECRET,
            refresh_token: hubspotToken.refreshToken,
          });
        
          const res = await firstValueFrom(
            this.httpService.post('https://api.hubapi.com/oauth/v1/token', payload.toString(), {
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            }),
          );
  
          const { access_token, refresh_token } = res.data;
  
          await this.hubspotTokenModel.update(
            {
              accessToken: access_token,
              refreshToken: refresh_token || hubspotToken.refreshToken,
            },
            {
              where: {
                companyId,
              },
            },
          );
  
          const hubspotClient = new HubspotClient({
            accessToken: access_token,
          });
  
          const propertiesResponse = await hubspotClient.crm.properties.coreApi.getAll('companies');
          const statusesPropertiesResponse = await hubspotClient.crm.properties.coreApi.getByName('companies', 'hs_lead_status');
          
          const fields = propertiesResponse.results
            .filter(property => property.hidden !== true)
            .map(property => ({
              name: property.name,
              label: property.label,
              description: property.description,
              type: property.type,
              fieldType: property.fieldType,
              groupName: property.groupName,
              hidden: property.hidden
            }));

          const fieldsByBinding = {
            crmAccountNameField: fields.filter(field => 
              field.name === 'name' || 
              field.name.toLowerCase().includes('name') || 
              field.name.toLowerCase().includes('company')
            ),
            crmAccountCityField: fields.filter(field => 
              field.name === 'city' || 
              field.name.toLowerCase().includes('city') || 
              field.name.toLowerCase().includes('location')
            ),
            crmAccountWebsiteField: fields.filter(field => 
              field.name === 'website' || 
              field.name.toLowerCase().includes('website') || 
              field.name.toLowerCase().includes('url') ||
              field.name.toLowerCase().includes('domain')
            ),
            crmAccountCompanyTitleField: fields.filter(field => 
              field.name === 'title' || 
              field.name.toLowerCase().includes('title')
            ),
            crmAccountFoundedInField: fields.filter(field => 
              field.name === 'founded_year' || 
              field.name.toLowerCase().includes('found') || 
              field.name.toLowerCase().includes('year') ||
              field.name.toLowerCase().includes('established')
            ),
            crmAccountHeadquartersField: fields.filter(field => 
              field.name === 'headquarters' || 
              field.name.toLowerCase().includes('headquarter') ||
              field.name.toLowerCase().includes('country') ||
              field.name.toLowerCase().includes('hq')
            ),
            crmAccountEmployeesField: fields.filter(field => 
              field.name === 'numberofemployees' || 
              field.name.toLowerCase().includes('employee') || 
              field.name.toLowerCase().includes('headcount') ||
              field.name.toLowerCase().includes('size')
            ),
            crmAccountIndustryField: fields.filter(field => 
              field.name === 'industry' || 
              field.name.toLowerCase().includes('industry') ||
              field.name.toLowerCase().includes('sector')
            ),
            crmAccountLinkedInField: fields.filter(field => 
              field.name === 'linkedin_company_page' || 
              field.name.toLowerCase().includes('linkedin')
            ),
            crmAccountDescriptionField: fields.filter(field => 
              field.name === 'description' || 
              field.name.toLowerCase().includes('description') || 
              field.name.toLowerCase().includes('about') ||
              field.name.toLowerCase().includes('summary')
            ),
            crmAccountNotContactedStatus: statusesPropertiesResponse.options,
            crmAccountInCadenceStatus: statusesPropertiesResponse.options,
            crmAccountResponseStatus: statusesPropertiesResponse.options,
            crmAccountMeetingStatus: statusesPropertiesResponse.options,
            crmAccountBouncedStatus: statusesPropertiesResponse.options,
            crmAccountOutOfOfficeStatus: statusesPropertiesResponse.options,
            crmAccountUnresponsiveStatus: statusesPropertiesResponse.options,
          };

          return {
            count: fields.length,
            results: fields,
            groupedFields: fieldsByBinding
          };
        } catch (refreshError) {
          throw new Error(`Failed to refresh HubSpot token: ${refreshError.message}`);
        }
      }
      
      throw new Error(`Error retrieving HubSpot company fields: ${error.message}`);
    }
  }

  async getHubspotContactsTableFields(companyId: string) {
    const hubspotToken = await this.hubspotTokenModel.findOne({
      where: {
        companyId,
      },
    });

    if (!hubspotToken) {
      throw new NotFoundException('No HubSpot connection found for this company');
    }

    try {
      const hubspotClient = new HubspotClient({
        accessToken: hubspotToken.accessToken,
      });

      const propertiesResponse = await hubspotClient.crm.properties.coreApi.getAll('contacts');
      const statusesPropertiesResponse = await hubspotClient.crm.properties.coreApi.getByName('contacts', 'hs_lead_status');
      
      const fields = propertiesResponse.results
        .filter(property => property.hidden !== true)
        .map(property => ({
          name: property.name,
          label: property.label,
          description: property.description,
          type: property.type,
          fieldType: property.fieldType,
          groupName: property.groupName,
          hidden: property.hidden
        }));

      const fieldsByBinding = {
        crmLeadFirstNameField: fields.filter(field => 
          field.name === 'firstname' || 
          field.name.toLowerCase().includes('first') ||
          (field.name.toLowerCase().includes('name') && field.name.toLowerCase().includes('first'))
        ),
        crmLeadLastNameField: fields.filter(field => 
          field.name === 'lastname' || 
          field.name.toLowerCase().includes('last') ||
          (field.name.toLowerCase().includes('name') && field.name.toLowerCase().includes('last'))
        ),
        crmLeadCompanyField: fields.filter(field => 
          field.name === 'company' || 
          field.name.toLowerCase().includes('company') || 
          field.name.toLowerCase().includes('organization')
        ),
        crmLeadJobTitleField: fields.filter(field => 
          field.name === 'jobtitle' || 
          field.name.toLowerCase().includes('title') || 
          field.name.toLowerCase().includes('job')
        ),
        crmLeadIndustryField: fields.filter(field => 
          field.name === 'industry' || 
          field.name.toLowerCase().includes('industry') || 
          field.name.toLowerCase().includes('sector')
        ),
        crmLeadPositionField: fields.filter(field => 
          field.name === 'position' || 
          field.name.toLowerCase().includes('position') || 
          field.name.toLowerCase().includes('role')
        ),
        crmLeadPositionDescriptionField: fields.filter(field => 
          field.name === 'position_description' || 
          field.name.toLowerCase().includes('position_description') || 
          field.name.toLowerCase().includes('jobtitle') ||
          field.name.toLowerCase().includes('role_description') ||
          (field.name.toLowerCase().includes('position') && field.name.toLowerCase().includes('description'))
        ),
        crmLeadEmailField: fields.filter(field => 
          field.name === 'email' || 
          field.name.toLowerCase().includes('email')
        ),
        crmLeadPhoneField: fields.filter(field => 
          field.name === 'phone' || 
          field.name.toLowerCase().includes('phone') || 
          field.name.toLowerCase().includes('mobile')
        ),
        crmLeadLanguageField: fields.filter(field => 
          field.name === 'language' || 
          field.name.toLowerCase().includes('language') || 
          field.name.toLowerCase().includes('lang')
        ),
        crmLeadLocationCountryField: fields.filter(field => 
          field.name === 'country' || 
          field.name.toLowerCase().includes('country')
        ),
        crmLeadLocationCityField: fields.filter(field => 
          field.name === 'city' || 
          field.name.toLowerCase().includes('city')
        ),
        crmLeadSubtitleField: fields.filter(field => 
          field.name === 'subtitle' || 
          field.name.toLowerCase().includes('subtitle') ||
          field.name.toLowerCase().includes('description') ||
          field.name.toLowerCase().includes('sub_title')
        ),
        crmLeadSummaryField: fields.filter(field => 
          field.name === 'summary' || 
          field.name.toLowerCase().includes('summary') || 
          field.name.toLowerCase().includes('about') ||
          field.name.toLowerCase().includes('bio')
        ),
        crmLeadLinkedInField: fields.filter(field => 
          field.name === 'linkedin_profile' || 
          field.name.toLowerCase().includes('linkedin')
        ),
        crmLeadNotContactedStatus: statusesPropertiesResponse.options,
        crmLeadInCadenceStatus: statusesPropertiesResponse.options,
        crmLeadResponseStatus: statusesPropertiesResponse.options,
        crmLeadMeetingStatus: statusesPropertiesResponse.options,
        crmLeadBouncedStatus: statusesPropertiesResponse.options,
        crmLeadOutOfOfficeStatus: statusesPropertiesResponse.options,
        crmLeadUnresponsiveStatus: statusesPropertiesResponse.options,
      };

      return fieldsByBinding;
    } catch (error) {
      if (error.message?.includes('expired') || error.status === 401) {
        try {
          const payload = new URLSearchParams({
            grant_type: 'refresh_token',
            client_id: process.env.HUBSPOT_CLIENT_ID,
            client_secret: process.env.HUBSPOT_CLIENT_SECRET,
            refresh_token: hubspotToken.refreshToken,
          });
        
          const res = await firstValueFrom(
            this.httpService.post('https://api.hubapi.com/oauth/v1/token', payload.toString(), {
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            }),
          );
  
          const { access_token, refresh_token } = res.data;
  
          await this.hubspotTokenModel.update(
            {
              accessToken: access_token,
              refreshToken: refresh_token || hubspotToken.refreshToken,
            },
            {
              where: {
                companyId,
              },
            },
          );
  
          const hubspotClient = new HubspotClient({
            accessToken: access_token,
          });
  
          const propertiesResponse = await hubspotClient.crm.properties.coreApi.getAll('contacts');
          const statusesPropertiesResponse = await hubspotClient.crm.properties.coreApi.getByName('contacts', 'hs_lead_status');
          
          const fields = propertiesResponse.results
            .filter(property => property.hidden !== true)
            .map(property => ({
              name: property.name,
              label: property.label,
              description: property.description,
              type: property.type,
              fieldType: property.fieldType,
              groupName: property.groupName,
              hidden: property.hidden
            }));

          const fieldsByBinding = {
            crmLeadFirstNameField: fields.filter(field => 
              field.name === 'firstname' || 
              field.name.toLowerCase().includes('first') ||
              (field.name.toLowerCase().includes('name') && field.name.toLowerCase().includes('first'))
            ),
            crmLeadLastNameField: fields.filter(field => 
              field.name === 'lastname' || 
              field.name.toLowerCase().includes('last') ||
              (field.name.toLowerCase().includes('name') && field.name.toLowerCase().includes('last'))
            ),
            crmLeadCompanyField: fields.filter(field => 
              field.name === 'company' || 
              field.name.toLowerCase().includes('company') || 
              field.name.toLowerCase().includes('organization')
            ),
            crmLeadJobTitleField: fields.filter(field => 
              field.name === 'jobtitle' || 
              field.name.toLowerCase().includes('title') || 
              field.name.toLowerCase().includes('job')
            ),
            crmLeadIndustryField: fields.filter(field => 
              field.name === 'industry' || 
              field.name.toLowerCase().includes('industry') || 
              field.name.toLowerCase().includes('sector')
            ),
            crmLeadPositionField: fields.filter(field => 
              field.name === 'position' || 
              field.name.toLowerCase().includes('position') || 
              field.name.toLowerCase().includes('role')
            ),
            crmLeadPositionDescriptionField: fields.filter(field => 
              field.name === 'position_description' || 
              field.name.toLowerCase().includes('position_description') || 
              field.name.toLowerCase().includes('jobtitle') ||
              field.name.toLowerCase().includes('role_description') ||
              (field.name.toLowerCase().includes('position') && field.name.toLowerCase().includes('description'))
            ),
            crmLeadEmailField: fields.filter(field => 
              field.name === 'email' || 
              field.name.toLowerCase().includes('email')
            ),
            crmLeadPhoneField: fields.filter(field => 
              field.name === 'phone' || 
              field.name.toLowerCase().includes('phone') || 
              field.name.toLowerCase().includes('mobile')
            ),
            crmLeadLanguageField: fields.filter(field => 
              field.name === 'language' || 
              field.name.toLowerCase().includes('language') || 
              field.name.toLowerCase().includes('lang')
            ),
            crmLeadLocationCountryField: fields.filter(field => 
              field.name === 'country' || 
              field.name.toLowerCase().includes('country')
            ),
            crmLeadLocationCityField: fields.filter(field => 
              field.name === 'city' || 
              field.name.toLowerCase().includes('city')
            ),
            crmLeadSubtitleField: fields.filter(field => 
              field.name === 'subtitle' || 
              field.name.toLowerCase().includes('subtitle') ||
              field.name.toLowerCase().includes('description') ||
              field.name.toLowerCase().includes('sub_title')
            ),
            crmLeadSummaryField: fields.filter(field => 
              field.name === 'summary' || 
              field.name.toLowerCase().includes('summary') || 
              field.name.toLowerCase().includes('about') ||
              field.name.toLowerCase().includes('bio')
            ),
            crmLeadLinkedInField: fields.filter(field => 
              field.name === 'linkedin_profile' || 
              field.name.toLowerCase().includes('linkedin')
            ),
            crmLeadNotContactedStatus: statusesPropertiesResponse.options,
            crmLeadInCadenceStatus: statusesPropertiesResponse.options,
            crmLeadResponseStatus: statusesPropertiesResponse.options,
            crmLeadMeetingStatus: statusesPropertiesResponse.options,
            crmLeadBouncedStatus: statusesPropertiesResponse.options,
            crmLeadOutOfOfficeStatus: statusesPropertiesResponse.options,
            crmLeadUnresponsiveStatus: statusesPropertiesResponse.options,
          };

          return {
            count: fields.length,
            results: fields,
            fieldsByBinding
          };
        } catch (refreshError) {
          throw new Error(`Failed to refresh HubSpot token: ${refreshError.message}`);
        }
      }
      
      throw new Error(`Error retrieving HubSpot contact fields: ${error.message}`);
    }
  }

  private async safeHubspotCall<T>(fn: () => Promise<T>, refreshToken: string) {
    for (let i = 0; i <= 1; i++) {
      try {
        const data = await fn();
        return data;
      } catch (error) {
        if (error.code === 401) {
          const payload = new URLSearchParams({
            grant_type: 'refresh_token',
            client_id: process.env.HUBSPOT_CLIENT_ID,
            client_secret: process.env.HUBSPOT_CLIENT_SECRET,
            refresh_token: refreshToken,
          });
        
          const res = await firstValueFrom(
            this.httpService.post('https://api.hubapi.com/oauth/v1/token', payload.toString(), {
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            }),
          );
      
          const { access_token, refresh_token, expires_in } = res.data;
    
          await this.hubspotTokenModel.update({
            accessToken: access_token,
            refreshToken: refresh_token,
          }, {
            where: {
              refreshToken,
            },
          });
        }
      }
    }
  }

  transformContactData(contactData: any) {
    const props = contactData.properties ?? null;

    const firstName = props?.firstname ?? null;
    const lastName = props?.lastname ?? null;
    const jobTitle = props?.jobtitle ?? null;

    let fullName = null;
    if (firstName && lastName) {
        fullName = `${firstName} ${lastName}`;
    } else if (firstName) {
        fullName = firstName;
    } else if (lastName) {
        fullName = lastName;
    }

    const headline = jobTitle;

    let currentPositions = null;
    if (jobTitle) {
        currentPositions = [
            {
                role: jobTitle,
                company: null,
                industry: null,
                location: null,
                company_id: null,
                tenure_at_role: null,
                tenure_at_company: null,
            },
        ];
    }

    const target = {
        id: null,
        name: fullName,
        type: 'PEOPLE',
        premium: null,
        summary: null,
        headline,
        industry: null,
        location: null,
        last_name: lastName,
        first_name: firstName,
        member_urn: null,
        profile_url: null,
        open_profile: null,
        network_distance: null,
        current_positions: currentPositions,
        public_identifier: null,
        pending_invitation: null,
        public_profile_url: null,
        recent_posts_count: null,
        profile_picture_url: null,
        profile_picture_url_large: null,
    };

    return target;
  }

  transformCompanyData(companyData: any) {
    const formatIndustry = (industry) => {
        if (!industry) return null;
        return industry
          .replace(/-/g, ' ')
          .replace(/\b\w/g, l => l.toUpperCase());
    };
  
    const formatLocation = (
        city,
        state,
        country,
    ) => {
        const parts = [city, state, country].filter(part => part != null && part !== '');
        return parts.length > 0 ? parts.join(', ') : null;
    };
  
    const id = companyData.socials?.linkedin?.idNumeric ?? null;
    const logo = companyData.assets?.logoSquare?.src ?? null;
    const name = companyData.about?.name ?? null;
    const summary = companyData.descriptions?.primary ?? null;
    const industry = formatIndustry(companyData.about?.industry);
    const headcount = companyData.about?.totalEmployees ?? null;
    const profile_url = companyData.socials?.linkedin?.url ?? null;
  
    const city = companyData.locations?.headquarters?.city?.name;
    const state = companyData.locations?.headquarters?.state?.name;
    const country = companyData.locations?.headquarters?.country?.name;
    const location = formatLocation(city, state, country);
  
    const targetData = {
        id: id,
        logo: logo,
        name: name,
        type: 'COMPANY',
        summary: summary,
        industry: industry,
        location: location,
        headcount: headcount,
        profile_url: profile_url,
    };
  
    return targetData;
  }
}
